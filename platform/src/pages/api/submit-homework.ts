import type { APIRoute } from 'astro';
import { validateSession } from '../../lib/auth';
import { supabaseAdmin } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const cookies = request.headers.get('cookie');
  const student = await validateSession(cookies);
  if (!student) {
    return new Response(JSON.stringify({ error: 'Oturum bulunamadı.' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const assignmentId = formData.get('assignmentId')?.toString().trim();
    const file = formData.get('file') as File | null;

    if (!assignmentId || !file) {
      return new Response(JSON.stringify({ error: 'Eksik bilgi veya dosya.' }), { status: 400 });
    }

    if (!file.name.endsWith('.zip')) {
      return new Response(JSON.stringify({ error: 'Sadece ZIP dosyası kabul edilmektedir.' }), { status: 400 });
    }

    const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
    if (file.size > MAX_SIZE) {
      return new Response(JSON.stringify({ error: 'Dosya çok büyük. Maksimum boyut 50 MB.' }), { status: 413 });
    }

    // Deadline kontrolü
    const { data: assignment, error: assignErr } = await supabaseAdmin
      .from('assignments')
      .select('id, deadline, is_active')
      .eq('id', assignmentId)
      .single();

    if (assignErr || !assignment || !assignment.is_active) {
      return new Response(JSON.stringify({ error: 'Ödev bulunamadı veya aktif değil.' }), { status: 404 });
    }

    const now = new Date();
    const deadline = new Date(assignment.deadline);
    const isLate = now > deadline;

    // Supabase Storage'a yükle
    const storagePath = `${student.id}/${assignmentId}.zip`;
    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from('submissions')
      .upload(storagePath, buffer, {
        contentType: 'application/zip',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Dosya yüklenirken bir hata oluştu.' }), { status: 500 });
    }

    // submissions tablosuna kayıt (upsert)
    const { error: dbError } = await supabaseAdmin
      .from('submissions')
      .upsert({
        student_id: student.id,
        assignment_id: assignmentId,
        file_path: storagePath,
        submitted_at: now.toISOString(),
        is_late: isLate,
        status: 'submitted'
      }, {
        onConflict: 'student_id,assignment_id'
      });

    if (dbError) {
      console.error('DB upsert error:', dbError);
      return new Response(JSON.stringify({ error: 'Kayıt sırasında bir hata oluştu.' }), { status: 500 });
    }

    const lateNote = isLate ? ' (Geç teslim olarak kaydedildi.)' : '';
    return new Response(JSON.stringify({
      success: true,
      message: `Ödeviniz başarıyla teslim edildi.${lateNote}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Submit error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Bilinmeyen bir hata oluştu.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

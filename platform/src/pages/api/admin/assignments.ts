import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@/lib/supabase';
import { SUBMISSION_STATUS, GRADE_ON_TIME, GRADE_LATE } from '@/lib/constants';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  // Otomatik notlandırma aksiyonu
  if (body.action === 'auto-grade') {
    const { id } = body;
    if (!id) return new Response(JSON.stringify({ error: 'ID gerekli.' }), { status: 400 });

    const { data: submissions } = await supabaseAdmin
      .from('submissions')
      .select('id, is_late')
      .eq('assignment_id', id)
      .eq('status', SUBMISSION_STATUS.SUBMITTED);

    if (!submissions?.length) {
      return new Response(JSON.stringify({ ok: true, count: 0 }), { status: 200 });
    }

    const now = new Date().toISOString();
    await Promise.all(
      submissions.map(s =>
        supabaseAdmin.from('submissions').update({
          status: SUBMISSION_STATUS.GRADED,
          score: s.is_late ? GRADE_LATE : GRADE_ON_TIME,
          graded_at: now,
        }).eq('id', s.id)
      )
    );

    return new Response(JSON.stringify({ ok: true, count: submissions.length }), { status: 200 });
  }

  const { week_number, title, deadline } = body;

  if (!week_number || !title || !deadline) {
    return new Response(JSON.stringify({ error: 'Eksik alan.' }), { status: 400 });
  }

  const { error } = await supabaseAdmin.from('assignments').insert({
    week_number,
    title,
    deadline,
    is_active: true,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

export const PATCH: APIRoute = async ({ request }) => {
  const { id, ...updates } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID gerekli.' }), { status: 400 });
  }

  const { error } = await supabaseAdmin.from('assignments').update(updates).eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ request }) => {
  const { id } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID gerekli.' }), { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('assignments')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

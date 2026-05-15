import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const { studentNumber } = await request.json();
  if (!studentNumber) return new Response(JSON.stringify({ found: false }), { status: 400 });

  const { data } = await supabaseAdmin
    .from('students')
    .select('id, pin_hash')
    .eq('student_number', studentNumber.trim())
    .single();

  if (!data) return new Response(JSON.stringify({ found: false }), { status: 404 });

  return new Response(JSON.stringify({
    found: true,
    needsPin: !data.pin_hash,
    studentId: !data.pin_hash ? data.id : undefined
  }), { status: 200 });
};

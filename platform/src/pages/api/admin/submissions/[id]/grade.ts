import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@/lib/supabase';

export const PATCH: APIRoute = async ({ request, params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID gerekli.' }), { status: 400 });
  }

  const { status, score } = await request.json();

  const updates: Record<string, unknown> = {};
  if (status !== undefined) updates.status = status;
  if (score !== undefined) updates.score = score;
  if (status === 'graded') updates.graded_at = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from('submissions')
    .update(updates)
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

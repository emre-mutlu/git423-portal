import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const { week_number, title, deadline } = await request.json();

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

import type { APIRoute } from 'astro';
import { createAdminCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  const { password } = await request.json();
  const adminPassword = import.meta.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return new Response(JSON.stringify({ error: 'Hatalı şifre.' }), { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': createAdminCookie(),
    },
  });
};

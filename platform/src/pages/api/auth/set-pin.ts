import type { APIRoute } from 'astro';
import { setPin, createSessionCookie } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
  const { studentId, pin } = await request.json();
  if (!studentId || !pin) return new Response(null, { status: 400 });

  const ok = await setPin(studentId, pin.trim());
  if (!ok) return new Response(null, { status: 400 });

  const cookie = await createSessionCookie(studentId);
  return new Response(null, { status: 200, headers: { 'Set-Cookie': cookie } });
};

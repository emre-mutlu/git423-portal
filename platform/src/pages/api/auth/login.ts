import type { APIRoute } from 'astro';
import { loginStudent, createSessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  const { studentNumber, pin } = await request.json();
  if (!studentNumber || !pin) return new Response(null, { status: 400 });

  const result = await loginStudent(studentNumber.trim(), pin.trim());

  if (!result.success) return new Response(null, { status: 401 });

  const cookie = await createSessionCookie(result.studentId!);
  return new Response(null, { status: 200, headers: { 'Set-Cookie': cookie } });
};

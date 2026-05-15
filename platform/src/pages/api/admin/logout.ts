import type { APIRoute } from 'astro';
import { ADMIN_COOKIE } from '../../../lib/auth';

export const POST: APIRoute = () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin/login',
      'Set-Cookie': `${ADMIN_COOKIE}=; Path=/admin; HttpOnly; Max-Age=0`,
    },
  });
};

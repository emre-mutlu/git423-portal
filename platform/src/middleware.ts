import { defineMiddleware } from 'astro:middleware';
import { validateSession, validateAdminSession } from './lib/auth';

const STUDENT_PROTECTED = ['/grades', '/submit'];
const ADMIN_PROTECTED = ['/admin', '/api/admin'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const cookies = context.request.headers.get('cookie');

  // Admin rotaları
  if (ADMIN_PROTECTED.some(p => pathname.startsWith(p))) {
    if (pathname === '/admin/login' || pathname === '/api/admin/login') return next();
    if (!validateAdminSession(cookies)) {
      return context.redirect('/admin/login');
    }
    return next();
  }

  // Öğrenci rotaları
  if (STUDENT_PROTECTED.some(p => pathname.startsWith(p))) {
    const student = await validateSession(cookies);
    if (!student) {
      return context.redirect('/login');
    }
    // Student bilgisini locals'a taşı (sayfalarda kullanmak için)
    context.locals.student = student;
    return next();
  }

  return next();
});

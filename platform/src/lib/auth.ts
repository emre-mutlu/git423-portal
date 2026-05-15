import { supabaseAdmin } from './supabase';

const SESSION_COOKIE = 'git423_session';
const ADMIN_COOKIE = 'git423_admin';

// PIN hashleme — Web Crypto API (sunucu tarafı, native)
async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(pin + 'git423salt');
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateToken(): Promise<string> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Session token'ı cookie değeri olarak encode et: studentId:token
function encodeSession(studentId: string, token: string): string {
  return Buffer.from(`${studentId}:${token}`).toString('base64');
}

function decodeSession(cookie: string): { studentId: string; token: string } | null {
  try {
    const decoded = Buffer.from(cookie, 'base64').toString('utf-8');
    const [studentId, token] = decoded.split(':');
    if (!studentId || !token) return null;
    return { studentId, token };
  } catch {
    return null;
  }
}

// Öğrenci giriş — no + PIN kontrolü
export async function loginStudent(studentNumber: string, pin: string): Promise<{ success: boolean; studentId?: string; needsPin?: boolean }> {
  const { data: student, error } = await supabaseAdmin
    .from('students')
    .select('id, pin_hash')
    .eq('student_number', studentNumber)
    .single();

  if (error || !student) return { success: false };

  // Henüz PIN belirlenmemiş
  if (!student.pin_hash) return { success: false, needsPin: true, studentId: student.id };

  const hash = await hashPin(pin);
  if (hash !== student.pin_hash) return { success: false };

  return { success: true, studentId: student.id };
}

// İlk PIN belirleme
export async function setPin(studentId: string, pin: string): Promise<boolean> {
  if (!/^\d{4}$/.test(pin)) return false;
  const hash = await hashPin(pin);
  const { error } = await supabaseAdmin
    .from('students')
    .update({ pin_hash: hash })
    .eq('id', studentId);
  return !error;
}

// Session cookie oluştur
export async function createSessionCookie(studentId: string): Promise<string> {
  const token = await generateToken();
  const value = encodeSession(studentId, token);
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}

// Session cookie doğrula → student row döner
export async function validateSession(cookieHeader: string | null): Promise<{ id: string; student_number: string; name_masked: string; branch: string } | null> {
  if (!cookieHeader) return null;

  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;

  const decoded = decodeSession(match[1]);
  if (!decoded) return null;

  const { data: student } = await supabaseAdmin
    .from('students')
    .select('id, student_number, name_masked, branch')
    .eq('id', decoded.studentId)
    .single();

  return student ?? null;
}

// Admin cookie oluştur
export function createAdminCookie(): string {
  return `${ADMIN_COOKIE}=authorized; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`;
}

// Admin session doğrula
export function validateAdminSession(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return cookieHeader.includes(`${ADMIN_COOKIE}=authorized`);
}

// Logout cookie (geçersiz kıl)
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0`;
}

export { SESSION_COOKIE, ADMIN_COOKIE };

import type { APIRoute } from 'astro';
import { validateSession, setPin } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase';

async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(pin + 'git423salt');
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request }) => {
  const cookies = request.headers.get('cookie');
  const student = await validateSession(cookies);
  if (!student) {
    return new Response(JSON.stringify({ error: 'Oturum bulunamadı.' }), { status: 401 });
  }

  const { currentPin, newPin } = await request.json();

  if (!currentPin || !newPin) {
    return new Response(JSON.stringify({ error: 'Eksik bilgi.' }), { status: 400 });
  }

  if (!/^\d{4}$/.test(newPin)) {
    return new Response(JSON.stringify({ error: 'Yeni PIN 4 haneli rakam olmalıdır.' }), { status: 400 });
  }

  // Mevcut PIN'i doğrula
  const { data: row } = await supabaseAdmin
    .from('students')
    .select('pin_hash')
    .eq('id', student.id)
    .single();

  const currentHash = await hashPin(currentPin);
  if (!row?.pin_hash || row.pin_hash !== currentHash) {
    return new Response(JSON.stringify({ error: 'Mevcut PIN hatalı.' }), { status: 403 });
  }

  const ok = await setPin(student.id, newPin);
  if (!ok) {
    return new Response(JSON.stringify({ error: 'PIN güncellenemedi.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

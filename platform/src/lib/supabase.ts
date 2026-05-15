import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Client-side (öğrenci arayüzü)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side (API route'ları, admin)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

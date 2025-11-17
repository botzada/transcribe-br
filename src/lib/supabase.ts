import { createClient } from '@supabase/supabase-js';

// Validar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

// Remover espaços e barras extras
const cleanUrl = supabaseUrl.trim().replace(/\/+$/, '');
const cleanKey = supabaseAnonKey.trim();

// Cliente público do Supabase (usa anon key)
export const supabase = createClient(cleanUrl, cleanKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

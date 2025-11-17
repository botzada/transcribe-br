import { createClient } from '@supabase/supabase-js';

// Cliente admin com service role key (bypassa RLS)
// Usar APENAS no servidor (Server Actions, API Routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

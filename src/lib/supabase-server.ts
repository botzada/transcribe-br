import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Criar cliente Supabase para Server Components e Server Actions
 * Implementação robusta com gerenciamento correto de cookies
 */
export async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Ignorar erros em contextos read-only (Server Components)
            // Isso é esperado e não afeta a funcionalidade
          }
        },
      },
    }
  );
}

/**
 * Cliente Supabase Admin (Service Role) para operações privilegiadas
 * Use APENAS em Server Actions/Components para operações administrativas
 * 
 * IMPORTANTE: Este cliente bypassa RLS (Row Level Security)
 */
export async function getSupabaseAdmin() {
  const { createClient } = await import("@supabase/supabase-js");
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurado");
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurado");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

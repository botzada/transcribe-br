import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para Client Components
 * Use este cliente em componentes com "use client"
 */
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

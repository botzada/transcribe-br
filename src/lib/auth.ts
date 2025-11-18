"use server";

import { getSupabaseServer } from "./supabase-server";

/**
 * Server Action: Obter usuário atual
 * Use APENAS em Server Components ou Server Actions
 * 
 * IMPORTANTE: Esta função busca o usuário autenticado via cookies
 * Retorna null se não houver usuário logado (isso é normal e esperado)
 */
export async function getCurrentUser() {
  try {
    const supabase = await getSupabaseServer();
    
    // Primeiro, verificar se existe uma sessão ativa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("[AUTH] Erro ao buscar sessão:", sessionError.message);
      return null;
    }

    if (!session) {
      // Não há sessão ativa - usuário não está logado
      // Isso é NORMAL e não é um erro
      console.log("[AUTH] Nenhuma sessão ativa encontrada");
      return null;
    }

    // Buscar dados completos do usuário
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("[AUTH] Erro ao buscar dados do usuário:", userError.message);
      return null;
    }

    if (!user) {
      console.log("[AUTH] Sessão existe mas usuário não encontrado");
      return null;
    }

    console.log("[AUTH] Usuário autenticado:", user.email);
    return user;
    
  } catch (error) {
    console.error("[AUTH] Erro inesperado ao obter usuário:", error);
    return null;
  }
}

/**
 * Server Action: Fazer logout
 */
export async function logout() {
  try {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("[AUTH] Erro ao fazer logout:", error.message);
      return { success: false, error: error.message };
    }

    console.log("[AUTH] Logout realizado com sucesso");
    return { success: true };
  } catch (error) {
    console.error("[AUTH] Erro inesperado ao fazer logout:", error);
    return { success: false, error: "Erro ao fazer logout" };
  }
}

/**
 * Server Action: Verificar se usuário está autenticado
 */
export async function isAuthenticated() {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error("[AUTH] Erro ao verificar autenticação:", error);
    return false;
  }
}

/**
 * Server Action: Obter sessão atual
 */
export async function getSession() {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[AUTH] Erro ao buscar sessão:", error.message);
      return null;
    }

    return session;
  } catch (error) {
    console.error("[AUTH] Erro inesperado ao obter sessão:", error);
    return null;
  }
}

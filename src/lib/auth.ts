'use client';

import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  plan: 'free' | 'premium' | 'business';
  credits: number;
}

// Obter usuário atual do Supabase Auth
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;

    // Buscar dados adicionais do usuário na tabela profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError.message);
      return null;
    }

    if (!profileData) return null;

    return {
      id: profileData.id,
      email: profileData.email,
      name: user.user_metadata?.name || profileData.email.split('@')[0],
      plan: profileData.plan,
      credits: profileData.credits,
    };
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
}

// Verificar se usuário está autenticado
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

// Registrar novo usuário - USAR registerUser() de actions/auth.ts
export async function register(email: string, password: string, name?: string): Promise<User | null> {
  console.error('AVISO: Use registerUser() de actions/auth.ts para registro (bypassa RLS)');
  return null;
}

// Login do usuário usando Supabase Auth
export async function login(email: string, password: string): Promise<User | null> {
  try {
    // 1. Fazer login com Supabase Auth usando signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erro ao fazer login:', error.message);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Usuário não encontrado');
    }

    // 2. Buscar perfil do usuário com tratamento de erro adequado
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // 3. Se perfil não existir, criar automaticamente
    if (profileError || !profile) {
      console.log('Perfil não encontrado, criando automaticamente...');
      
      // Criar perfil com id exatamente igual ao user.id para passar pela policy RLS
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,           // IMPORTANTÍSSIMO: deve ser exatamente user.id
          email: data.user.email!,
          credits: 30,
          plan: 'free',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar perfil automaticamente:', insertError.message);
        throw new Error(`Erro ao criar perfil: ${insertError.message}`);
      }

      // Retornar com perfil recém-criado
      return {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
        plan: newProfile.plan,
        credits: newProfile.credits,
      };
    }

    // 4. Retornar objeto completo com perfil existente
    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || profile.email.split('@')[0],
      plan: profile.plan,
      credits: profile.credits,
    };
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

// Logout usando Supabase Auth
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

// Atualizar créditos do usuário
export async function updateUserCredits(userId: string, newCredits: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao atualizar créditos:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar créditos:', error);
    return false;
  }
}

// Atualizar plano do usuário
export async function updateUserPlan(userId: string, plan: 'free' | 'premium' | 'business'): Promise<boolean> {
  try {
    // Definir créditos baseado no plano
    const creditsMap = {
      free: 30,
      premium: 300,
      business: 1000,
    };
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        plan, 
        credits: creditsMap[plan],
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao atualizar plano:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    return false;
  }
}

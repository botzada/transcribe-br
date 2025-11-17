'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

// Registrar novo usuário usando admin client (bypassa RLS)
export async function registerUser(email: string, password: string, name?: string) {
  try {
    // Criar usuário no Supabase Auth usando admin client
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        name: name || email.split('@')[0]
      }
    });

    if (error) {
      console.error("Erro ao registrar:", error.message);
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Usuário não retornado" };
    }

    // Criar perfil na tabela profiles usando admin client (bypassa RLS)
    // IMPORTANTE: id deve ser exatamente data.user.id
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: data.user.id,           // IMPORTANTÍSSIMO: deve ser exatamente user.id
        email: data.user.email!,
        credits: 30,
        plan: 'free',
      });

    if (profileError) {
      console.error('Erro ao criar perfil do usuário:', profileError.message);
      return { success: false, error: profileError.message };
    }

    return { 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: name || email.split('@')[0],
        plan: 'free',
        credits: 30,
      }
    };
  } catch (error: any) {
    console.error('Erro ao registrar:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

// Login do usuário e criar perfil automaticamente se não existir
export async function loginUser(email: string, password: string) {
  try {
    // 1. Fazer login com Supabase Auth usando admin client
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erro ao fazer login:', error.message);
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    // 2. Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // 3. Se perfil não existir, criar automaticamente usando admin (bypassa RLS)
    if (!profile || profileError) {
      console.log('Perfil não encontrado, criando automaticamente...');
      
      // IMPORTANTE: id deve ser exatamente data.user.id para passar pela policy RLS
      const { data: newProfile, error: insertError } = await supabaseAdmin
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
        return { success: false, error: insertError.message };
      }

      // Retornar com perfil recém-criado
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
          plan: newProfile.plan,
          credits: newProfile.credits,
        }
      };
    }

    // 4. Retornar objeto completo com perfil existente
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || profile.email.split('@')[0],
        plan: profile.plan,
        credits: profile.credits,
      }
    };
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

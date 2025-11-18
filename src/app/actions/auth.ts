'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSupabaseServer } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * REGISTRAR NOVO USUÁRIO
 * 
 * Fluxo correto:
 * 1. Criar usuário no Auth usando admin (bypassa RLS)
 * 2. Criar perfil usando admin (bypassa RLS)
 * 3. Fazer login automático usando client normal (cria sessão no browser)
 */
export async function registerUser(email: string, password: string, name?: string) {
  try {
    // 1. Criar usuário no Supabase Auth usando admin client
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        name: name || email.split('@')[0]
      }
    });

    if (adminError) {
      console.error("❌ Erro ao registrar:", adminError.message);
      return { success: false, error: adminError.message };
    }

    if (!adminData.user) {
      return { success: false, error: "Usuário não retornado" };
    }

    console.log("✅ Usuário criado no Auth:", adminData.user.id);

    // 2. Criar perfil na tabela profiles usando admin client (bypassa RLS)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: adminData.user.id,
        email: adminData.user.email!,
        plan: 'free',
        credits: 30
      });

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError.message);
      return { success: false, error: profileError.message };
    }

    console.log("✅ Perfil criado com sucesso");

    // 3. CRÍTICO: Fazer login automático usando client normal (cria sessão no browser)
    const supabase = await getSupabaseServer();
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      console.error('❌ Erro ao fazer login automático:', loginError.message);
      return { success: false, error: 'Conta criada mas erro ao fazer login: ' + loginError.message };
    }

    if (!loginData.session) {
      return { success: false, error: 'Conta criada mas sessão não foi estabelecida' };
    }

    console.log("✅ Login automático realizado, sessão criada");

    // Revalidar cache
    revalidatePath('/dashboard');
    revalidatePath('/');
    
    return { 
      success: true, 
      user: {
        id: adminData.user.id,
        email: adminData.user.email!,
        name: name || email.split('@')[0],
        plan: 'free',
        credits: 30,
      },
      shouldRedirect: true
    };
  } catch (error: any) {
    console.error('❌ Erro ao registrar:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

/**
 * LOGIN DO USUÁRIO
 * 
 * Fluxo correto:
 * 1. Fazer login usando client normal (cria sessão no browser)
 * 2. Verificar se perfil existe
 * 3. Se não existir, criar usando admin (bypassa RLS)
 */
export async function loginUser(email: string, password: string) {
  try {
    // 1. CRÍTICO: Fazer login com client normal (cria sessão no browser)
    const supabase = await getSupabaseServer();
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      console.error('❌ Erro ao fazer login:', loginError.message);
      return { success: false, error: 'Email ou senha inválidos' };
    }

    if (!loginData.user || !loginData.session) {
      return { success: false, error: 'Erro ao estabelecer sessão' };
    }

    console.log("✅ Login realizado, sessão criada:", loginData.user.email);

    // 2. Buscar perfil do usuário usando admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', loginData.user.id)
      .single();

    // 3. Se perfil não existir, criar automaticamente usando admin (bypassa RLS)
    if (!profile) {
      console.log('⚠️ Perfil não encontrado, criando automaticamente...');
      
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: loginData.user.id,
          email: loginData.user.email!,
          plan: 'free',
          credits: 30
        });

      if (insertError) {
        console.error('❌ Erro ao criar perfil automaticamente:', insertError.message);
        // Não retornar erro - usuário já está logado
      } else {
        console.log("✅ Perfil criado automaticamente");
      }
    }

    // 4. Revalidar cache
    revalidatePath('/dashboard');
    revalidatePath('/');

    // 5. CRÍTICO: Retornar sucesso e deixar o client fazer o redirecionamento
    return {
      success: true,
      user: {
        id: loginData.user.id,
        email: loginData.user.email!,
        name: loginData.user.user_metadata?.name || (profile?.email || loginData.user.email!).split('@')[0],
        plan: profile?.plan || 'free',
        credits: profile?.credits || 30,
      },
      shouldRedirect: true
    };
  } catch (error: any) {
    console.error('❌ Erro ao fazer login:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

/**
 * LOGOUT DO USUÁRIO
 */
export async function logoutUser() {
  try {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Erro ao fazer logout:', error.message);
      return { success: false, error: error.message };
    }

    console.log("✅ Logout realizado com sucesso");
    
    // Revalidar cache e redirecionar
    revalidatePath('/');
    redirect('/login');
  } catch (error: any) {
    console.error('❌ Erro ao fazer logout:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

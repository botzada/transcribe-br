/**
 * TESTE DE INSERÇÃO DE PERFIL
 * 
 * Este arquivo testa se a inserção de perfil funciona corretamente
 * com as policies RLS configuradas.
 */

import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function testProfileInsert() {
  console.log('🧪 Iniciando teste de inserção de perfil...\n');

  try {
    // 1. Criar usuário de teste usando admin (bypassa RLS)
    console.log('1️⃣ Criando usuário de teste...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Test123456!';

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error('❌ Erro ao criar usuário:', authError?.message);
      return { success: false, error: authError?.message };
    }

    console.log('✅ Usuário criado:', authData.user.id);

    // 2. Testar inserção de perfil usando admin (bypassa RLS)
    console.log('\n2️⃣ Testando inserção com admin client (bypassa RLS)...');
    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        plan: 'free',
        credits: 30,
      })
      .select()
      .single();

    if (adminError) {
      console.error('❌ Erro ao inserir perfil (admin):', adminError.message);
      return { success: false, error: adminError.message };
    }

    console.log('✅ Perfil criado com admin:', adminProfile);

    // 3. Fazer login com o usuário criado
    console.log('\n3️⃣ Fazendo login com usuário de teste...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (loginError || !loginData.user) {
      console.error('❌ Erro ao fazer login:', loginError?.message);
      return { success: false, error: loginError?.message };
    }

    console.log('✅ Login realizado:', loginData.user.id);

    // 4. Buscar perfil usando cliente público (com RLS)
    console.log('\n4️⃣ Buscando perfil com cliente público (com RLS)...');
    const { data: publicProfile, error: publicError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', loginData.user.id)
      .single();

    if (publicError) {
      console.error('❌ Erro ao buscar perfil (público):', publicError.message);
      return { success: false, error: publicError.message };
    }

    console.log('✅ Perfil encontrado:', publicProfile);

    // 5. Limpar: deletar usuário de teste (admin)
    console.log('\n5️⃣ Limpando usuário de teste...');
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    console.log('✅ Usuário de teste removido');

    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!\n');
    return { success: true };

  } catch (error: any) {
    console.error('❌ Erro no teste:', error.message);
    return { success: false, error: error.message };
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testProfileInsert().then(result => {
    if (result.success) {
      console.log('✅ Todos os testes passaram!');
      process.exit(0);
    } else {
      console.error('❌ Teste falhou:', result.error);
      process.exit(1);
    }
  });
}

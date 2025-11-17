import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';

/**
 * Teste de conexão com Supabase
 * Este arquivo pode ser usado para verificar se a conexão está funcionando
 */

export async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');

  // 1. Verificar variáveis de ambiente
  console.log('1️⃣ Verificando variáveis de ambiente:');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log(`   URL: ${url ? '✅ Configurada' : '❌ Não configurada'}`);
  console.log(`   Anon Key: ${anonKey ? '✅ Configurada' : '❌ Não configurada'}`);
  console.log(`   Service Key: ${serviceKey ? '✅ Configurada' : '❌ Não configurada'}\n`);

  if (!url || !anonKey) {
    console.error('❌ Variáveis de ambiente não configuradas corretamente!');
    return false;
  }

  // 2. Testar conexão com cliente público (anon key)
  console.log('2️⃣ Testando cliente público (anon key):');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error(`   ❌ Erro: ${error.message}`);
      console.error(`   Código: ${error.code}`);
      console.error(`   Detalhes: ${error.details}\n`);
      return false;
    }

    console.log(`   ✅ Conexão bem-sucedida!`);
    console.log(`   Registros encontrados: ${data?.length || 0}\n`);
  } catch (error: any) {
    console.error(`   ❌ Erro ao conectar: ${error.message}\n`);
    return false;
  }

  // 3. Testar conexão com cliente admin (service role key)
  if (serviceKey) {
    console.log('3️⃣ Testando cliente admin (service role key):');
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .limit(1);

      if (error) {
        console.error(`   ❌ Erro: ${error.message}`);
        console.error(`   Código: ${error.code}`);
        console.error(`   Detalhes: ${error.details}\n`);
        return false;
      }

      console.log(`   ✅ Conexão admin bem-sucedida!`);
      console.log(`   Registros encontrados: ${data?.length || 0}\n`);
    } catch (error: any) {
      console.error(`   ❌ Erro ao conectar com admin: ${error.message}\n`);
      return false;
    }
  }

  console.log('✅ Todos os testes passaram!\n');
  return true;
}

// Teste de autenticação
export async function testAuth() {
  console.log('🔐 Testando autenticação...\n');

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.log('   ℹ️ Nenhum usuário autenticado no momento');
      return null;
    }

    if (user) {
      console.log('   ✅ Usuário autenticado:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}\n`);
      return user;
    }

    return null;
  } catch (error: any) {
    console.error(`   ❌ Erro ao verificar autenticação: ${error.message}\n`);
    return null;
  }
}

// Executar testes (descomente para usar)
// testSupabaseConnection();
// testAuth();

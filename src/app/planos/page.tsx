import { getCurrentUser } from '@/lib/auth';
import PlanosClient from './planos-client';

/**
 * Página de Planos - Server Component
 * Busca o usuário no servidor e passa para o Client Component
 */
export default async function PlanosPage() {
  // Buscar usuário autenticado no servidor
  // Se retornar null, significa que o usuário não está logado (comportamento esperado)
  const user = await getCurrentUser();

  // Passar dados do usuário para o Client Component
  return <PlanosClient user={user} />;
}

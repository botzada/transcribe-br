'use server';

import { 
  getUserProfile, 
  hasEnoughCredits, 
  deductCredits,
  updateUserPlan,
  CREDIT_COSTS,
  type PlanType 
} from '@/lib/credits';

/**
 * Verificar e descontar créditos para transcrição curta
 */
export async function useTranscriptionShort(userId: string) {
  const cost = CREDIT_COSTS.transcription_short;
  
  // Verificar se tem créditos suficientes
  const hasCredits = await hasEnoughCredits(userId, cost);
  
  if (!hasCredits) {
    return {
      success: false,
      error: 'Créditos insuficientes',
      message: `Você precisa de ${cost} crédito(s) para realizar esta transcrição.`,
    };
  }

  // Descontar créditos
  const result = await deductCredits(userId, cost);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      message: 'Erro ao descontar créditos. Tente novamente.',
    };
  }

  return {
    success: true,
    remainingCredits: result.remainingCredits,
    message: `${cost} crédito(s) descontado(s). Você tem ${result.remainingCredits} créditos restantes.`,
  };
}

/**
 * Verificar e descontar créditos para transcrição longa
 */
export async function useTranscriptionLong(userId: string) {
  const cost = CREDIT_COSTS.transcription_long;
  
  const hasCredits = await hasEnoughCredits(userId, cost);
  
  if (!hasCredits) {
    return {
      success: false,
      error: 'Créditos insuficientes',
      message: `Você precisa de ${cost} créditos para realizar esta transcrição.`,
    };
  }

  const result = await deductCredits(userId, cost);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      message: 'Erro ao descontar créditos. Tente novamente.',
    };
  }

  return {
    success: true,
    remainingCredits: result.remainingCredits,
    message: `${cost} créditos descontados. Você tem ${result.remainingCredits} créditos restantes.`,
  };
}

/**
 * Verificar e descontar créditos para resumo
 */
export async function useSummary(userId: string) {
  const cost = CREDIT_COSTS.summary;
  
  const hasCredits = await hasEnoughCredits(userId, cost);
  
  if (!hasCredits) {
    return {
      success: false,
      error: 'Créditos insuficientes',
      message: `Você precisa de ${cost} crédito(s) para gerar um resumo.`,
    };
  }

  const result = await deductCredits(userId, cost);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      message: 'Erro ao descontar créditos. Tente novamente.',
    };
  }

  return {
    success: true,
    remainingCredits: result.remainingCredits,
    message: `${cost} crédito(s) descontado(s). Você tem ${result.remainingCredits} créditos restantes.`,
  };
}

/**
 * Buscar perfil completo do usuário
 */
export async function fetchUserProfile(userId: string) {
  const profile = await getUserProfile(userId);
  
  if (!profile) {
    return {
      success: false,
      error: 'Perfil não encontrado',
    };
  }

  return {
    success: true,
    profile,
  };
}

/**
 * Atualizar plano após pagamento aprovado
 */
export async function upgradePlan(userId: string, plan: PlanType) {
  const result = await updateUserPlan(userId, plan);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      message: 'Erro ao atualizar plano. Tente novamente.',
    };
  }

  return {
    success: true,
    message: `Plano atualizado para ${plan.toUpperCase()} com sucesso!`,
  };
}

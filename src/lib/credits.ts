// Sistema de créditos
import { getCurrentUser } from './auth';
import { CREDIT_COSTS } from './types';

const STORAGE_KEY = 'transcribebr_user';

export function getCredits(): number {
  const user = getCurrentUser();
  return user?.credits || 0;
}

export function hasEnoughCredits(cost: number): boolean {
  return getCredits() >= cost;
}

export function deductCredits(cost: number): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (user.credits < cost) {
    return false;
  }
  
  user.credits -= cost;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return true;
}

export function addCredits(amount: number): void {
  const user = getCurrentUser();
  if (!user) return;
  
  user.credits += amount;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getCreditCost(action: keyof typeof CREDIT_COSTS): number {
  return CREDIT_COSTS[action];
}

export function formatCredits(credits: number): string {
  return credits.toLocaleString('pt-BR');
}

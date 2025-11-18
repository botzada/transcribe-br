// Types para o sistema de assinaturas

export type PlanType = 'free' | 'premium' | 'business';
export type SubscriptionStatus = 'ativo' | 'cancelado' | 'expirado';

export interface SubscriptionStatusData {
  planoAtual: PlanType;
  valor: number;
  proximaCobranca: string | null;
  status: SubscriptionStatus;
  creditosTotais: number;
  creditosUsados: number;
  creditosDisponiveis: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  next_billing_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  plan: PlanType;
  payment_date: string;
  created_at: string;
}

export interface Credits {
  id: string;
  user_id: string;
  total_credits: number;
  used_credits: number;
  available_credits: number;
  updated_at: string;
}

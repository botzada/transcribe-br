// Types para TranscribeBR

export type Plan = 'free' | 'premium' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  credits: number;
  createdAt: Date;
}

export interface Transcription {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  duration: number;
  status: 'processing' | 'completed' | 'failed';
  transcriptionText?: string;
  summary?: string;
  createdAt: Date;
  creditsUsed: number;
}

export interface CreditAction {
  upload: 10;
  transcription: 20;
  summaryBasic: 15;
  summaryAdvanced: 25;
  export: 2;
}

export interface PlanDetails {
  name: string;
  credits: number;
  price: number;
  features: string[];
}

export const PLANS: Record<Plan, PlanDetails> = {
  free: {
    name: 'Free',
    credits: 30,
    price: 0,
    features: [
      '30 créditos/mês',
      'Transcrição básica',
      'Resumo automático',
      'Exportar em TXT',
    ],
  },
  premium: {
    name: 'Premium',
    credits: 300,
    price: 29.90,
    features: [
      '300 créditos/mês',
      'Transcrição avançada',
      'Resumo inteligente',
      'Exportar em TXT, PDF, DOCX',
      'Suporte prioritário',
    ],
  },
  business: {
    name: 'Business',
    credits: 1000,
    price: 79.90,
    features: [
      '1000 créditos/mês',
      'Transcrição premium',
      'Resumo com IA avançada',
      'Todos os formatos de exportação',
      'API de integração',
      'Suporte 24/7',
    ],
  },
};

export const CREDIT_COSTS: CreditAction = {
  upload: 10,
  transcription: 20,
  summaryBasic: 15,
  summaryAdvanced: 25,
  export: 2,
};

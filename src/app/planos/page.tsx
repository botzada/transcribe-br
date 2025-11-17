'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Check, Zap, Crown, Building2, ArrowRight } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

export default function PlanosPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const user = getCurrentUser();

  const handleSelectPlan = (plan: 'free' | 'premium' | 'business') => {
    if (!user) {
      router.push('/cadastro');
      return;
    }

    if (plan === 'free') {
      router.push('/dashboard');
      return;
    }

    // Redirecionar para página de ficha cadastral com o plano selecionado
    router.push(`/ficha-cadastral?plan=${plan}`);
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Zap,
      price: 0,
      yearlyPrice: 0,
      description: 'Perfeito para começar',
      credits: 30,
      features: [
        '30 créditos por mês',
        'Transcrição básica',
        'Resumo automático',
        'Exportar em TXT',
        'Suporte por email',
        'Histórico de 7 dias',
      ],
      cta: 'Começar Grátis',
      popular: false,
      gradient: 'from-gray-500 to-gray-600',
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      price: 49.90,
      yearlyPrice: 499.00,
      description: 'Para profissionais exigentes',
      credits: 300,
      features: [
        '300 créditos por mês',
        'Transcrição avançada com IA',
        'Resumo inteligente personalizado',
        'Exportar em TXT, PDF, DOCX',
        'Suporte prioritário via WhatsApp',
        'Histórico ilimitado',
        'Transcrição em tempo real',
        'Identificação de falantes',
      ],
      cta: 'Assinar Premium',
      popular: true,
      gradient: 'from-[#4D6CFA] to-[#6A4DFB]',
    },
    {
      id: 'business',
      name: 'Business',
      icon: Building2,
      price: 149.90,
      yearlyPrice: 1499.00,
      description: 'Para equipes e empresas',
      credits: 1000,
      features: [
        '1000 créditos por mês',
        'Tudo do Premium +',
        'API de integração',
        'Múltiplos usuários (até 5)',
        'Gerenciamento de equipe',
        'Relatórios avançados',
        'Suporte dedicado 24/7',
        'SLA garantido',
        'Treinamento personalizado',
        'Backup automático',
      ],
      cta: 'Assinar Business',
      popular: false,
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center shadow-lg shadow-[#4D6CFA]/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TranscribeBR</span>
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Começar Grátis
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-gray-400">
            Todos os planos incluem transcrição automática e resumo inteligente. 
            Comece grátis e faça upgrade quando precisar.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] text-white shadow-lg shadow-[#4D6CFA]/25'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] text-white shadow-lg shadow-[#4D6CFA]/25'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Anual
            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold">
              -17%
            </span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const displayPrice = billingCycle === 'monthly' ? plan.price : plan.yearlyPrice;
            const monthlyEquivalent = billingCycle === 'yearly' ? (plan.yearlyPrice / 12).toFixed(2) : null;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 transition-all ${
                  plan.popular
                    ? 'bg-white/[0.05] border-2 border-[#4D6CFA] shadow-2xl shadow-[#4D6CFA]/20 scale-105'
                    : 'bg-white/[0.03] border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] text-white text-sm font-bold shadow-lg">
                    Mais Popular
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      R$ {displayPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-400">
                      /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {monthlyEquivalent && (
                    <p className="text-sm text-emerald-400 mt-1">
                      Equivale a R$ {monthlyEquivalent.replace('.', ',')}/mês
                    </p>
                  )}
                </div>

                {/* Credits */}
                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Créditos mensais</p>
                  <p className="text-2xl font-bold text-white">{plan.credits}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id as 'free' | 'premium' | 'business')}
                  className={`w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] text-white hover:shadow-lg hover:shadow-[#4D6CFA]/25'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">
                Como funcionam os créditos?
              </h3>
              <p className="text-gray-400">
                Cada ação consome créditos: upload (10), transcrição (20), resumo básico (15), 
                resumo avançado (25) e exportação (2). Os créditos são renovados mensalmente.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-400">
                Sim! Você pode cancelar sua assinatura a qualquer momento. Seus créditos 
                permanecerão ativos até o final do período pago.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">
                Qual a diferença entre os planos?
              </h3>
              <p className="text-gray-400">
                O plano Free é ideal para testar. Premium oferece mais créditos e recursos avançados. 
                Business inclui API, múltiplos usuários e suporte dedicado para empresas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-400">
            <p>© 2024 TranscribeBR. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { createPixPayment } from "./actions";
import PixModal from "@/components/custom/pix-modal";

interface PlanosClientProps {
  user: User | null;
}

export default function PlanosClient({ user }: PlanosClientProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode?: string;
    copyPaste?: string;
    amount: number;
    planName: string;
  } | null>(null);

  // Cálculo dos preços
  const premiumMonthly = 97;
  const businessMonthly = 297;

  // Planos anuais: (preço × 12) com 60% de desconto
  const premiumAnnual = Math.round((premiumMonthly * 12) * 0.4); // 60% desconto = paga 40%
  const businessAnnual = Math.round((businessMonthly * 12) * 0.4);

  const plans = [
    {
      name: "Premium",
      description: "Ideal para profissionais e pequenas equipes",
      monthlyPrice: premiumMonthly,
      annualPrice: premiumAnnual,
      monthlyCredits: 10000,
      annualCredits: 15000, // +50% créditos
      features: [
        "15.000 créditos mensais",
        "Acesso a todos os modelos de IA",
        "Suporte prioritário",
        "Histórico ilimitado",
        "Exportação de dados",
        "API de integração",
      ],
      popular: false,
    },
    {
      name: "Business",
      description: "Para empresas que precisam de mais poder",
      monthlyPrice: businessMonthly,
      annualPrice: businessAnnual,
      monthlyCredits: 50000,
      annualCredits: 80000, // +60% créditos
      features: [
        "80.000 créditos mensais",
        "Todos os recursos do Premium",
        "Suporte dedicado 24/7",
        "Treinamento personalizado",
        "SLA garantido",
        "Gerenciamento de equipes",
        "Relatórios avançados",
        "Integração empresarial",
      ],
      popular: true,
    },
  ];

  const handlePurchase = async (planName: string, price: number) => {
    if (!user) {
      alert("Você precisa estar logado para assinar um plano");
      return;
    }

    setLoading(planName);

    try {
      const result = await createPixPayment({
        planName,
        planType: billingCycle,
        amount: price,
      });

      if (result.success && result.pixCopyPaste) {
        setPixData({
          qrCode: result.pixQrCode,
          copyPaste: result.pixCopyPaste,
          amount: price,
          planName: `${planName} - ${billingCycle === "monthly" ? "Mensal" : "Anual"}`,
        });
        setShowPixModal(true);
      } else {
        alert(result.error || "Erro ao criar pagamento");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        {/* Botão Voltar ao Dashboard */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
            Escolha seu Plano
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10">
            Planos flexíveis para atender suas necessidades. Economize até 60% com o plano anual.
          </p>

          {/* Toggle de Ciclo de Pagamento */}
          <div className="inline-flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                -60%
              </span>
            </button>
          </div>
        </div>

        {/* Grid de Planos */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const credits = billingCycle === "monthly" ? plan.monthlyCredits : plan.annualCredits;
            const savings = billingCycle === "annual" 
              ? Math.round(((plan.monthlyPrice * 12) - plan.annualPrice) / (plan.monthlyPrice * 12) * 100)
              : 0;
            const isLoading = loading === plan.name;

            return (
              <div
                key={plan.name}
                className={`relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:shadow-3xl ${
                  plan.popular ? "ring-4 ring-blue-500 ring-offset-4 dark:ring-offset-slate-950" : ""
                }`}
              >
                {/* Badge "Mais Popular" */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Mais Popular
                    </span>
                  </div>
                )}

                {/* Nome e Descrição */}
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    {plan.description}
                  </p>
                </div>

                {/* Preço */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100">
                      R$ {price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{billingCycle === "monthly" ? "mês" : "ano"}
                    </span>
                  </div>
                  
                  {billingCycle === "annual" && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        Economize {savings}% no plano anual
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Equivalente a R$ {Math.round(price / 12)}/mês
                      </p>
                    </div>
                  )}
                </div>

                {/* Créditos */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-700 rounded-2xl p-4 mb-6 sm:mb-8 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Créditos mensais</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {credits.toLocaleString("pt-BR")}
                  </p>
                  {billingCycle === "annual" && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                      +{Math.round(((credits - plan.monthlyCredits) / plan.monthlyCredits) * 100)}% créditos extras
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Botão CTA */}
                <button
                  onClick={() => handlePurchase(plan.name, price)}
                  disabled={isLoading || !user}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-2xl"
                      : "bg-gray-900 dark:bg-slate-700 text-white hover:bg-gray-800 dark:hover:bg-slate-600 shadow-lg hover:shadow-2xl"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : user ? (
                    "Assinar Agora"
                  ) : (
                    "Faça login para assinar"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Todos os planos incluem 14 dias de garantia. Cancele quando quiser.
          </p>
          {user && (
            <p className="mt-4 text-sm text-blue-600 dark:text-blue-400">
              Logado como: {user.email}
            </p>
          )}
        </div>
      </div>

      {/* Modal PIX */}
      {pixData && (
        <PixModal
          isOpen={showPixModal}
          onClose={() => setShowPixModal(false)}
          pixQrCode={pixData.qrCode}
          pixCopyPaste={pixData.copyPaste}
          amount={pixData.amount}
          planName={pixData.planName}
        />
      )}
    </div>
  );
}

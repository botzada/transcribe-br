"use client";

import { useEffect, useState } from "react";
import { CreditCard, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getSubscriptionStatus, cancelSubscription } from "@/lib/actions/subscription";
import { SubscriptionStatusData } from "@/lib/types/subscription";

interface SubscriptionStatusCardProps {
  userId: string;
}

export default function SubscriptionStatusCard({ userId }: SubscriptionStatusCardProps) {
  const [status, setStatus] = useState<SubscriptionStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadStatus();
  }, [userId]);

  async function loadStatus() {
    setLoading(true);
    const data = await getSubscriptionStatus(userId);
    setStatus(data);
    setLoading(false);
  }

  async function handleCancelSubscription() {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura? Você terá acesso até o fim do período atual.")) {
      return;
    }

    setCanceling(true);
    setMessage(null);

    const result = await cancelSubscription(userId);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      await loadStatus(); // Recarregar dados
    } else {
      setMessage({ type: "error", text: result.message });
    }

    setCanceling(false);
  }

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#4D6CFA] animate-spin" />
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="text-center text-gray-400">
          Erro ao carregar informações da assinatura
        </div>
      </div>
    );
  }

  // Calcular porcentagem de créditos usados
  const creditPercentage = (status.creditosUsados / status.creditosTotais) * 100;

  // Definir cor do status
  const statusColors = {
    ativo: "text-green-400",
    cancelado: "text-yellow-400",
    expirado: "text-red-400",
  };

  const statusIcons = {
    ativo: <CheckCircle className="w-5 h-5" />,
    cancelado: <AlertCircle className="w-5 h-5" />,
    expirado: <XCircle className="w-5 h-5" />,
  };

  // Definir cor do plano
  const planColors = {
    free: "from-gray-500 to-gray-600",
    premium: "from-[#4D6CFA] to-[#6A4DFB]",
    business: "from-purple-500 to-pink-500",
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${planColors[status.planoAtual]} flex items-center justify-center`}>
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white capitalize">
              Plano {status.planoAtual}
            </h2>
            <div className={`flex items-center gap-2 ${statusColors[status.status]}`}>
              {statusIcons[status.status]}
              <span className="text-sm font-medium capitalize">{status.status}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            R$ {status.valor.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">por mês</div>
        </div>
      </div>

      {/* Próxima Cobrança */}
      {status.proximaCobranca && status.status === "ativo" && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Próxima cobrança</span>
            <span className="text-sm font-medium text-white">
              {new Date(status.proximaCobranca).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      )}

      {/* Barra de Créditos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Créditos</span>
          <span className="text-sm font-medium text-white">
            {status.creditosDisponiveis} / {status.creditosTotais}
          </span>
        </div>

        {/* Barra de Progresso */}
        <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${planColors[status.planoAtual]} transition-all duration-500`}
            style={{ width: `${100 - creditPercentage}%` }}
          />
        </div>

        {/* Detalhes dos Créditos */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>Usados: {status.creditosUsados}</span>
          <span>Disponíveis: {status.creditosDisponiveis}</span>
        </div>
      </div>

      {/* Mensagem de Feedback */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        </div>
      )}

      {/* Botão Cancelar Plano */}
      {status.planoAtual !== "free" && status.status === "ativo" && (
        <button
          onClick={handleCancelSubscription}
          disabled={canceling}
          className="w-full px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {canceling ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Cancelando...
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5" />
              Cancelar Plano
            </>
          )}
        </button>
      )}

      {/* Informação para plano cancelado */}
      {status.status === "cancelado" && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-400">
              <p className="font-medium mb-1">Plano cancelado</p>
              <p className="text-yellow-400/80">
                Você terá acesso aos recursos até{" "}
                {status.proximaCobranca
                  ? new Date(status.proximaCobranca).toLocaleDateString("pt-BR")
                  : "o fim do período"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informação para plano expirado */}
      {status.status === "expirado" && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-400">
              <p className="font-medium mb-1">Plano expirado</p>
              <p className="text-red-400/80">
                Sua assinatura expirou. Renove para continuar usando os recursos premium.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

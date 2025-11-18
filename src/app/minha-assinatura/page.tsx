"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import Navbar from "@/components/custom/navbar";
import SubscriptionStatusCard from "@/components/custom/SubscriptionStatusCard";
import { Loader2 } from "lucide-react";

export default function MinhaAssinaturaPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user }, error } = await supabaseBrowser.auth.getUser();
        
        if (error || !user) {
          router.push("/login");
          return;
        }

        setUserId(user.id);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4D6CFA] animate-spin" />
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Minha Assinatura
          </h1>
          <p className="text-gray-400">
            Gerencie seu plano e acompanhe seus créditos
          </p>
        </div>

        {/* Card de Status */}
        <SubscriptionStatusCard userId={userId} />

        {/* Informações Adicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Como funcionam os planos */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Como funcionam os planos?
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <span className="font-medium text-white">Free:</span> 10 créditos/mês - Ideal para começar
              </div>
              <div>
                <span className="font-medium text-[#4D6CFA]">Premium:</span> 100 créditos/mês - Para uso regular
              </div>
              <div>
                <span className="font-medium text-purple-400">Business:</span> 500 créditos/mês - Para empresas
              </div>
            </div>
          </div>

          {/* Uso de créditos */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Uso de créditos
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span>Transcrição curta (&lt;10min)</span>
                <span className="font-medium text-white">1 crédito</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Transcrição longa (&gt;10min)</span>
                <span className="font-medium text-white">5 créditos</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Resumo automático</span>
                <span className="font-medium text-white">1 crédito</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA para upgrade */}
        <div className="mt-8 bg-gradient-to-r from-[#4D6CFA]/20 to-[#6A4DFB]/20 border border-[#4D6CFA]/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Precisa de mais créditos?
          </h3>
          <p className="text-gray-300 mb-6">
            Faça upgrade do seu plano e tenha acesso a mais recursos
          </p>
          <button
            onClick={() => router.push("/planos")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Ver Planos Disponíveis
          </button>
        </div>
      </div>
    </div>
  );
}

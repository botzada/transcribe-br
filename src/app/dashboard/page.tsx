'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Navbar from '@/components/custom/navbar';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { getCredits } from '@/lib/credits';
import { PLANS } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
    setCredits(getCredits());
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  const planDetails = user ? PLANS[user.plan] : null;

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Olá, {user?.name}! 👋
          </h1>
          <p className="text-gray-400">
            Bem-vindo ao seu painel de controle
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Credits Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-400">Disponível</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{credits}</div>
            <div className="text-sm text-gray-400">Créditos</div>
          </div>

          {/* Plan Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6A4DFB] to-[#4D6CFA] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <Link
                href="/planos"
                className="text-sm text-[#4D6CFA] hover:text-[#6A4DFB] font-medium"
              >
                Upgrade
              </Link>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {planDetails?.name}
            </div>
            <div className="text-sm text-gray-400">Plano atual</div>
          </div>

          {/* Transcriptions Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-sm text-gray-400">Transcrições</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Action */}
            <Link
              href="/upload"
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#4D6CFA]/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Fazer Upload
                  </h3>
                  <p className="text-sm text-gray-400">
                    Envie áudio ou vídeo para transcrever
                  </p>
                </div>
              </div>
            </Link>

            {/* Plans Action */}
            <Link
              href="/planos"
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#4D6CFA]/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6A4DFB] to-[#4D6CFA] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Ver Planos
                  </h3>
                  <p className="text-sm text-gray-400">
                    Upgrade para mais créditos e recursos
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Atividade Recente</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Nenhuma transcrição ainda
              </h3>
              <p className="text-gray-400 mb-6">
                Faça upload do seu primeiro arquivo para começar
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] text-white font-medium hover:opacity-90 transition-opacity"
              >
                <Upload className="w-5 h-5" />
                Fazer Upload
              </Link>
            </div>
          </div>
        </div>

        {/* Credit Usage Info */}
        <div className="mt-8 bg-gradient-to-r from-[#4D6CFA]/10 to-[#6A4DFB]/10 border border-[#4D6CFA]/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[#4D6CFA] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Como funcionam os créditos?
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4D6CFA]" />
                  Upload de arquivo: 10 créditos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4D6CFA]" />
                  Transcrição: 20 créditos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4D6CFA]" />
                  Resumo automático: 15 créditos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4D6CFA]" />
                  Resumo avançado: 25 créditos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4D6CFA]" />
                  Exportar arquivo: 2 créditos
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

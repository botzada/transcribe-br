'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, CreditCard, Mail, Zap, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/custom/navbar';
import { supabase } from '@/lib/supabase';
import { PLAN_CONFIG } from '@/lib/credits';

interface UserProfile {
  id: string;
  email: string;
  plan: 'free' | 'premium' | 'business';
  credits: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const planDetails = PLAN_CONFIG[profile.plan];

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Meu Perfil
          </h1>
          <p className="text-gray-400">
            Gerencie suas informações e plano
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {profile.email.split('@')[0]}
              </h2>
              <p className="text-gray-400">Membro desde 2024</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#4D6CFA]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-white font-medium">{profile.email}</p>
              </div>
            </div>

            {/* Plano */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-[#4D6CFA]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Plano Atual</p>
                <p className="text-white font-medium">{planDetails.name}</p>
              </div>
            </div>

            {/* Créditos */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-[#4D6CFA]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Créditos Disponíveis</p>
                <p className="text-white font-medium text-2xl">{profile.credits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Details Card */}
        <div className="bg-gradient-to-r from-[#4D6CFA]/20 to-[#6A4DFB]/20 border border-[#4D6CFA]/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Plano {planDetails.name}
              </h3>
              <p className="text-gray-400">
                {planDetails.credits} créditos inclusos
              </p>
            </div>
            {profile.plan === 'free' && (
              <Link
                href="/planos"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Fazer Upgrade
              </Link>
            )}
          </div>

          {profile.plan !== 'free' && (
            <div className="text-sm text-gray-300">
              <p>✓ Transcrição avançada</p>
              <p>✓ Resumo inteligente</p>
              <p>✓ Suporte prioritário</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Precisa de mais créditos?
              </h3>
              <p className="text-sm text-gray-400">
                Escolha um plano que atenda suas necessidades
              </p>
            </div>
            <Link
              href="/planos"
              className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors"
            >
              Comprar Créditos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

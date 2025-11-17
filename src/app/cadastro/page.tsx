'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Mail, Lock, User, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { registerUser } from '@/app/actions/auth';

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!name || !email || !password || !confirmPassword) {
        setError('Preencha todos os campos');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres');
        setLoading(false);
        return;
      }

      const result = await registerUser(email, password, name);
      
      if (result.success) {
        setSuccess('✅ Conta criada com sucesso! Você ganhou 30 créditos grátis. Redirecionando...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(`❌ Erro ao criar conta: ${result.error}`);
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
      setError('❌ Erro ao criar conta. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center shadow-lg shadow-[#4D6CFA]/20">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">TranscribeBR</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Criar conta grátis</h1>
          <p className="text-gray-400 mb-8">Ganhe 30 créditos para começar</p>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-400 font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all"
                  placeholder="João Silva"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] text-white font-semibold hover:shadow-lg hover:shadow-[#4D6CFA]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar conta grátis
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-[#4D6CFA] hover:text-[#6A4DFB] font-semibold transition-colors">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1">
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  );
}

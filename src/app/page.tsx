'use client';

import Link from 'next/link';
import { ArrowRight, Zap, FileText, Brain, Shield, Clock, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TranscribeBR</span>
            </div>
            <div className="flex items-center gap-4">
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
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Zap className="w-4 h-4 text-[#4D6CFA]" />
            <span className="text-sm text-gray-300">Transcrição automática com IA</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Transforme áudio em texto
            <span className="block mt-2 bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] bg-clip-text text-transparent">
              com inteligência artificial
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Transcreva reuniões, entrevistas, podcasts e vídeos automaticamente. 
            Resumos inteligentes em segundos.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Começar Grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/planos"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
            >
              Ver Planos
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            30 créditos grátis • Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Tudo que você precisa
          </h2>
          <p className="text-lg text-gray-400">
            Recursos poderosos para transcrição e resumo profissional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#4D6CFA]/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Transcrição Rápida</h3>
            <p className="text-gray-400">
              Converta áudio em texto em segundos com precisão de até 95%
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#4D6CFA]/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Resumo Inteligente</h3>
            <p className="text-gray-400">
              IA avançada gera resumos automáticos dos pontos principais
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#4D6CFA]/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">100% Seguro</h3>
            <p className="text-gray-400">
              Seus arquivos são criptografados e protegidos com segurança máxima
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#4D6CFA]/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Economize Tempo</h3>
            <p className="text-gray-400">
              Reduza horas de trabalho manual para minutos de processamento
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#4D6CFA]/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Múltiplos Formatos</h3>
            <p className="text-gray-400">
              Exporte em TXT, PDF, DOCX e outros formatos populares
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#4D6CFA]/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sistema de Créditos</h3>
            <p className="text-gray-400">
              Pague apenas pelo que usar com nosso sistema flexível de créditos
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#4D6CFA] to-[#6A4DFB] p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Crie sua conta grátis e ganhe 30 créditos para testar todas as funcionalidades
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-[#4D6CFA] font-medium hover:bg-gray-100 transition-colors"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">TranscribeBR</span>
              </div>
              <p className="text-sm text-gray-400">
                Transcrição e resumo inteligente com IA
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/planos" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Planos
                  </Link>
                </li>
                <li>
                  <Link href="/cadastro" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Começar Grátis
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/termos" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/reembolso" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Reembolso
                  </Link>
                </li>
                <li>
                  <Link href="/licenca" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Licença
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://wa.me/5569992688660"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2024 TranscribeBR. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

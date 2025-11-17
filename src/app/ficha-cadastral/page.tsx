'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FileText, User, Mail, Phone, MapPin, FileCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

export default function FichaCadastralPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan') as 'premium' | 'business' | null;
  const user = getCurrentUser();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: '',
    phone: '',
    city: '',
    state: '',
    observations: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/cadastro');
      return;
    }

    if (!selectedPlan || (selectedPlan !== 'premium' && selectedPlan !== 'business')) {
      router.push('/planos');
    }
  }, [user, selectedPlan, router]);

  const planDetails = {
    premium: {
      name: 'Premium',
      price: 'R$ 49,90/mês',
      credits: 300,
    },
    business: {
      name: 'Business',
      price: 'R$ 149,90/mês',
      credits: 1000,
    },
  };

  const currentPlan = selectedPlan ? planDetails[selectedPlan] : null;

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      setFormData({ ...formData, [name]: formatCPF(value) });
    } else if (name === 'phone') {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validações
      if (!formData.name || !formData.email || !formData.cpf || !formData.phone || !formData.city || !formData.state) {
        setError('Preencha todos os campos obrigatórios');
        setLoading(false);
        return;
      }

      if (formData.cpf.replace(/\D/g, '').length !== 11) {
        setError('CPF inválido');
        setLoading(false);
        return;
      }

      if (formData.phone.replace(/\D/g, '').length < 10) {
        setError('Telefone inválido');
        setLoading(false);
        return;
      }

      // Montar mensagem para WhatsApp
      const message = `
🎯 *NOVA FICHA CADASTRAL - TranscribeBR*

📋 *Dados do Cliente:*
👤 Nome: ${formData.name}
📧 Email: ${formData.email}
🆔 CPF: ${formData.cpf}
📱 Telefone: ${formData.phone}
📍 Cidade/Estado: ${formData.city} - ${formData.state}

💎 *Plano Escolhido:*
${currentPlan?.name} - ${currentPlan?.price}
⚡ ${currentPlan?.credits} créditos/mês

${formData.observations ? `📝 *Observações:*\n${formData.observations}` : ''}

---
Aguardando confirmação de pagamento.
      `.trim();

      // Codificar mensagem para URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/5569992688660?text=${encodedMessage}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // Aguardar 2 segundos e redirecionar para página de pagamento
      setTimeout(() => {
        router.push(`/pagamento?plan=${selectedPlan}`);
      }, 2000);
    } catch (err) {
      setError('Erro ao enviar ficha. Tente novamente.');
      setLoading(false);
    }
  };

  if (!currentPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center shadow-lg shadow-[#4D6CFA]/20">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">TranscribeBR</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <FileCheck className="w-4 h-4 text-[#4D6CFA]" />
            <span className="text-sm text-gray-300">Etapa 1 de 2</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Ficha Cadastral
          </h1>
          <p className="text-gray-400">
            Preencha seus dados para continuar com o pagamento
          </p>
        </div>

        {/* Plan Summary */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#4D6CFA]/10 to-[#6A4DFB]/10 border border-[#4D6CFA]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Plano selecionado</p>
              <p className="text-2xl font-bold text-white">{currentPlan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Valor</p>
              <p className="text-2xl font-bold text-white">{currentPlan.price}</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nome completo *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all"
                  placeholder="João Silva"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* CPF e Telefone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-300 mb-2">
                  CPF *
                </label>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                  Cidade *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all"
                    placeholder="São Paulo"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                  Estado *
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all"
                  required
                >
                  <option value="" className="bg-[#1A1A1A]">Selecione</option>
                  <option value="AC" className="bg-[#1A1A1A]">Acre</option>
                  <option value="AL" className="bg-[#1A1A1A]">Alagoas</option>
                  <option value="AP" className="bg-[#1A1A1A]">Amapá</option>
                  <option value="AM" className="bg-[#1A1A1A]">Amazonas</option>
                  <option value="BA" className="bg-[#1A1A1A]">Bahia</option>
                  <option value="CE" className="bg-[#1A1A1A]">Ceará</option>
                  <option value="DF" className="bg-[#1A1A1A]">Distrito Federal</option>
                  <option value="ES" className="bg-[#1A1A1A]">Espírito Santo</option>
                  <option value="GO" className="bg-[#1A1A1A]">Goiás</option>
                  <option value="MA" className="bg-[#1A1A1A]">Maranhão</option>
                  <option value="MT" className="bg-[#1A1A1A]">Mato Grosso</option>
                  <option value="MS" className="bg-[#1A1A1A]">Mato Grosso do Sul</option>
                  <option value="MG" className="bg-[#1A1A1A]">Minas Gerais</option>
                  <option value="PA" className="bg-[#1A1A1A]">Pará</option>
                  <option value="PB" className="bg-[#1A1A1A]">Paraíba</option>
                  <option value="PR" className="bg-[#1A1A1A]">Paraná</option>
                  <option value="PE" className="bg-[#1A1A1A]">Pernambuco</option>
                  <option value="PI" className="bg-[#1A1A1A]">Piauí</option>
                  <option value="RJ" className="bg-[#1A1A1A]">Rio de Janeiro</option>
                  <option value="RN" className="bg-[#1A1A1A]">Rio Grande do Norte</option>
                  <option value="RS" className="bg-[#1A1A1A]">Rio Grande do Sul</option>
                  <option value="RO" className="bg-[#1A1A1A]">Rondônia</option>
                  <option value="RR" className="bg-[#1A1A1A]">Roraima</option>
                  <option value="SC" className="bg-[#1A1A1A]">Santa Catarina</option>
                  <option value="SP" className="bg-[#1A1A1A]">São Paulo</option>
                  <option value="SE" className="bg-[#1A1A1A]">Sergipe</option>
                  <option value="TO" className="bg-[#1A1A1A]">Tocantins</option>
                </select>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label htmlFor="observations" className="block text-sm font-medium text-gray-300 mb-2">
                Observações (opcional)
              </label>
              <textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6CFA] focus:border-transparent transition-all resize-none"
                placeholder="Alguma informação adicional que deseja compartilhar..."
              />
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
                  Enviando...
                </>
              ) : (
                <>
                  Continuar para Pagamento
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link href="/planos" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1">
            ← Voltar para planos
          </Link>
        </div>
      </div>
    </div>
  );
}

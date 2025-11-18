"use client";

import { X, Copy, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixQrCode?: string;
  pixCopyPaste?: string;
  amount: number;
  planName: string;
}

export default function PixModal({
  isOpen,
  onClose,
  pixQrCode,
  pixCopyPaste,
  amount,
  planName,
}: PixModalProps) {
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    if (pixCopyPaste) {
      await navigator.clipboard.writeText(pixCopyPaste);
      setCopied(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Pagamento via PIX</h2>
          <p className="text-blue-100 text-sm">
            Escaneie o QR Code ou copie o código
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações do Plano */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-700 rounded-2xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Plano selecionado
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {planName}
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              R$ {amount.toFixed(2)}
            </p>
          </div>

          {/* QR Code */}
          {pixQrCode && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <Image
                  src={`data:image/png;base64,${pixQrCode}`}
                  alt="QR Code PIX"
                  width={250}
                  height={250}
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Escaneie o QR Code com o app do seu banco
              </p>
            </div>
          )}

          {/* Código PIX Copia e Cola */}
          {pixCopyPaste && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Ou copie o código:
                </p>
              </div>
              <div className="relative">
                <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-4 pr-12 break-all text-sm font-mono text-gray-800 dark:text-gray-200">
                  {pixCopyPaste}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 dark:text-green-400 text-center font-semibold">
                  ✓ Código copiado!
                </p>
              )}
            </div>
          )}

          {/* Instruções */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
              ⚡ Pagamento instantâneo
            </p>
            <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• O pagamento é confirmado em até 2 minutos</li>
              <li>• Você receberá um email de confirmação</li>
              <li>• O PIX expira em 24 horas</li>
            </ul>
          </div>

          {/* Botão de Verificar */}
          <button
            onClick={() => {
              setChecking(true);
              setTimeout(() => {
                setChecking(false);
                // Aqui você pode adicionar lógica para verificar o status
              }, 2000);
            }}
            disabled={checking}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {checking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verificando...
              </>
            ) : (
              "Já paguei - Verificar"
            )}
          </button>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

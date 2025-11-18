'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User, CreditCard, FileText } from 'lucide-react';
import { logout } from '@/lib/auth';
import { getCredits } from '@/lib/credits';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        // Buscar usuário atual
        const { data: { user: currentUser } } = await supabaseBrowser.auth.getUser();
        
        if (currentUser) {
          setUser(currentUser);
          
          // Buscar créditos do usuário
          const userCredits = await getCredits(currentUser.id);
          setCredits(userCredits);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [pathname]);

  if (loading || !user) return null;

  return (
    <nav className="border-b border-white/10 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4D6CFA] to-[#6A4DFB] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TranscribeBR</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                pathname === '/dashboard'
                  ? 'text-[#4D6CFA]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className={`text-sm font-medium transition-colors ${
                pathname === '/upload'
                  ? 'text-[#4D6CFA]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upload
            </Link>
            <Link
              href="/planos"
              className={`text-sm font-medium transition-colors ${
                pathname === '/planos'
                  ? 'text-[#4D6CFA]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Planos
            </Link>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            {/* Credits */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <CreditCard className="w-4 h-4 text-[#4D6CFA]" />
              <span className="text-sm font-medium text-white">
                {credits} créditos
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{user.email}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

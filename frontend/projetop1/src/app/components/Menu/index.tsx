// components/Menu.tsx
"use client";

import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";

export default function Menu() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - baseado no print */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                {/* Ícone de chat/entrevista */}
                <svg
                  className="w-6 h-6 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">
                AI Interview
              </span>
            </Link>
          </div>

          {/* Menu Items */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-orange-500"
              >
                Início
              </Link>

              {/* Link para entrevista - só aparece se estiver logado */}
              {isAuthenticated && (
                <Link
                  href="/interview"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-orange-500"
                >
                  Entrevista
                </Link>
              )}

              <Link
                href="/contato"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-orange-500"
              >
                Contato
              </Link>

              {/* Botões condicionais baseados no status de autenticação */}
              {!isAuthenticated ? (
                <Link
                  href="/entrar"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-orange-500"
                >
                  Entrar
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Olá, <span className="font-medium">{user?.name}</span>
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

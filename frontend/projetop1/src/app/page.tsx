// app/page.tsx
"use client";

import Link from "next/link";
import Form from "./components/Form";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="bg-[#f2f4f7] min-h-screen p-5">
      {/* Se não estiver logado, mostrar Form de login */}
      {!isAuthenticated ? (
        <Form />
      ) : (
        /* Se estiver logado, mostrar dashboard/boas-vindas */
        <div className="max-w-4xl mx-auto">
          {/* Boas-vindas */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo de volta, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Pronto para sua próxima entrevista técnica?
              </p>
            </div>
          </div>

          {/* Card da Entrevista */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Entrevista Técnica com Ada
              </h2>
              <p className="text-gray-600 mb-6">
                Pratique suas habilidades de programação com nossa IA
                especializada
              </p>
              <Link href="/interview">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Iniciar Entrevista com Ada
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

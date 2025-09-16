import { useState } from "react";
import InterviewRoom from "./InterviewRoom";
import { useAuth } from "../../contexts/AuthContext";

interface InterviewFlowProps {
  onStart: () => void;
  onBack: () => void;
  showInterview: boolean;
  isConnecting: boolean;
  userName?: string;
}

export default function InterviewFlow({
  onStart,
  onBack,
  showInterview,
  isConnecting,
  userName,
}: InterviewFlowProps) {
  // Preservei o uso de useAuth caso precise do usuário localmente (opcional)
  const { user } = useAuth();

  // Antes de conectar, mostra botão para gerar token
  if (!showInterview) {
    return (
      <div className="flex h-103 w-full justify-center items-center">
        <button
          onClick={onStart}
          disabled={isConnecting}
          className="h-15 flex justify-center items-center cursor-pointer bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-8 py-3 rounded-full font-medium transition-colors disabled:cursor-not-allowed"
        >
          {isConnecting ? "Conectando..." : "Iniciar Entrevista"}
        </button>
      </div>
    );
  }

  // Quando já estiver conectado, renderizamos o InterviewRoom (que depende do LiveKitRoom)
  return <InterviewRoom onBack={onBack} userName={userName || user?.name} />;
}

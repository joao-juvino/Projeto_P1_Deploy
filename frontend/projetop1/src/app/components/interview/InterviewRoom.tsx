// app/components/interview/InterviewRoom.tsx
"use client";

import { useState, useEffect } from "react";
import { useRoomContext, useConnectionState } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";

interface InterviewRoomProps {
  onBack: () => void;
  userName?: string;
}

export default function InterviewRoom({
  onBack,
  userName,
}: InterviewRoomProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Conectando...");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (connectionState === ConnectionState.Connected) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      setConnectionStatus("Conectado");
      setIsRecording(true);
    } else if (connectionState === ConnectionState.Connecting) {
      setConnectionStatus("Conectando com Ada...");
    } else if (connectionState === ConnectionState.Disconnected) {
      setConnectionStatus("Desconectado");
      setIsRecording(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDisconnect = () => {
    room?.disconnect();
    onBack();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 h-full flex flex-col relative">
      {/* Header com timer */}
      <div className="absolute top-4 right-4 text-right">
        <div className="text-3xl font-mono text-gray-900 mb-1">
          01:{formatTime(elapsedTime)}
        </div>
        <div className="text-sm text-gray-500">{connectionStatus}</div>
      </div>

      {/* Área central com avatar e status */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Avatar da Ada */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 shadow-2xl border-4 border-white">
            <div className="w-full h-full flex items-end justify-center bg-gradient-to-t from-slate-900/20 to-transparent">
              {/* Silhueta feminina estilizada */}
              <div className="w-20 h-20 mb-2">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-white/90 fill-current"
                >
                  {/* Cabeça */}
                  <circle cx="50" cy="25" r="12" />
                  {/* Cabelo */}
                  <path d="M38 18 C38 12, 42 8, 50 8 C58 8, 62 12, 62 18 C62 22, 60 25, 58 27 C56 24, 54 22, 50 22 C46 22, 44 24, 42 27 C40 25, 38 22, 38 18 Z" />
                  {/* Corpo */}
                  <ellipse cx="50" cy="55" rx="15" ry="25" />
                  {/* Ombros */}
                  <path d="M35 45 C35 42, 37 40, 40 40 C43 40, 45 42, 45 45 L45 55 C45 58, 42 60, 40 60 C37 60, 35 58, 35 55 Z" />
                  <path d="M55 45 C55 42, 57 40, 60 40 C63 40, 65 42, 65 45 L65 55 C65 58, 62 60, 60 60 C57 60, 55 58, 55 55 Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Indicador de status */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div
              className={`w-6 h-6 rounded-full border-2 border-white ${
                connectionState === ConnectionState.Connected
                  ? "bg-green-500"
                  : connectionState === ConnectionState.Connecting
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {connectionState === ConnectionState.Connected && isRecording && (
                <div className="w-full h-full rounded-full bg-green-500 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {/* Nome */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Ada</h2>

        {/* Status da conversa */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-2">
            {connectionState === ConnectionState.Connected
              ? "Entrevista em andamento"
              : connectionState === ConnectionState.Connecting
              ? "Conectando com Ada..."
              : "Conectando..."}
          </p>

          {connectionState === ConnectionState.Connected && (
            <p className="text-sm text-gray-500">
              {userName && `${userName}, a`}Ada está pronta para conduzir sua
              entrevista técnica
            </p>
          )}
        </div>

        {/* Visualizador de áudio/microfone */}
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
            {isRecording ? (
              <div className="w-8 h-8 rounded-full bg-white animate-pulse"></div>
            ) : (
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
              </svg>
            )}
          </div>
        </div>

        {/* Botão de cancelar entrevista */}
        <button
          onClick={handleDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancel interview
        </button>
      </div>

      {/* Footer com instruções */}
      {connectionState === ConnectionState.Connected && (
        <div className="text-center text-sm text-gray-500 border-t pt-4">
          <p>💡 Fale naturalmente. Ada pode ouvir e responder em tempo real.</p>
        </div>
      )}
    </div>
  );
}

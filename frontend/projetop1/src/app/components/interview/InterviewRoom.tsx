"use client";

import { useState, useEffect } from "react";
import { useRoomContext, useConnectionState } from "@livekit/components-react";
// --- NOVO: Importando tipos e eventos necessários ---
import { ConnectionState, RoomEvent, DataPacket_Kind, RemoteParticipant } from "livekit-client";
import { CircleX, Mic } from "lucide-react";
import Image from "next/image";

// --- NOVO: Importando nosso hook para acessar o contexto ---
import { useInterview } from "../../contexts/InterviewContext";
import { redirect } from "next/navigation";

interface InterviewRoomProps {
  onBack: () => void;
  userName?: string;
}

export default function InterviewRoom({ onBack, userName }: InterviewRoomProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Conectando...");

  // --- NOVO: Conectando ao contexto para obter a função de atualizar a pergunta ---
  const { setCurrentQuestion } = useInterview();

  // useEffect para o timer (seu código original, sem alterações)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionState === ConnectionState.Connected) {
      interval = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
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

  // --- NOVO: useEffect dedicado para escutar as mensagens de dados do agente ---
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
      kind?: DataPacket_Kind,
      topic?: string
    ) => {
      if (topic === "interview_events") {
        const messageStr = new TextDecoder().decode(payload);
        try {
          const message = JSON.parse(messageStr);
          if (message.type === "SHOW_TECHNICAL_QUESTION") {
            console.log("Pergunta recebida do agente! Atualizando o contexto...");
            // Usamos a função do contexto para deixar a pergunta "disponível" para todos
            setCurrentQuestion(message.payload);
          }
        } catch (error) {
          console.error("Falha ao processar mensagem do agente:", error);
        }
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, setCurrentQuestion]); // Depende do 'room' e da função 'setCurrentQuestion'

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
    redirect("/")
  };

  // O JSX deste componente permanece o mesmo. Ele não precisa mostrar a pergunta.
  return (
    <div className="flex flex-row w-full justify-between py-10">
      {/* ... (todo o seu JSX original do InterviewRoom) ... */}
      <div className="flex flex-row w-full justify-between py-10">
        {/* Lado esquerdo: avatar e nome */}
        <div className="flex flex-col justify-center items-center w-1/2">
          <div className="mb-5 relative">
            <Image src="/imgs/ada.png" alt="Ada" width={120} height={120} className="rounded-full" />
            {/* Indicador de status */}
            <span
              className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${connectionState === ConnectionState.Connected
                  ? "bg-green-500 animate-pulse"
                  : connectionState === ConnectionState.Connecting
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
            />
          </div>
          <h3 className="text-3xl font-bold">Ada</h3>
          <p className="text-gray-500 text-sm mt-2">{connectionStatus}</p>
        </div>

        {/* Lado direito: timer, mic e cancelar */}
        <div className="w-1/2 flex flex-col justify-between items-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <h3 className="text-4xl font-bold font-mono">{formatTime(elapsedTime)}</h3>

            {/* Microfone animado */}
            <div
              className={`rounded-full w-16 h-16 flex items-center justify-center shadow-lg ${isRecording ? "bg-orange-500 animate-pulse" : "bg-gray-300"
                }`}
            >
              <Mic className="text-white w-8 h-8" />
            </div>
          </div>

          {/* Botão cancelar entrevista */}
          <button
            onClick={handleDisconnect}
            className="cursor-pointer flex items-center gap-3 text-white font-bold bg-[#FF4D4F] hover:bg-red-600 px-6 py-3 rounded-full transition-colors mt-8"
          >
            <CircleX className="w-5 h-5" />
            <span>Cancel interview</span>
          </button>
        </div>
      </div>
    </div>
  );
}

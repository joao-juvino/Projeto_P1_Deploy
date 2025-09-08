"use client";

import { useState, useEffect } from "react";
import { useRoomContext, useConnectionState } from "@livekit/components-react";
// --- NOVO: Importando tipos e eventos necessários ---
import { ConnectionState, RoomEvent, DataPacket_Kind, RemoteParticipant } from "livekit-client";
import { CircleX, Mic } from "lucide-react";
import Image from "next/image";

// --- NOVO: Importando nosso hook para acessar o contexto ---
import { useInterview } from "@/contexts/InterviewContext";

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
    // ... (função sem alterações)
  };

  const handleDisconnect = () => {
    // ... (função sem alterações)
  };

  // O JSX deste componente permanece o mesmo. Ele não precisa mostrar a pergunta.
  return (
    <div className="flex flex-row w-full justify-between py-10">
      {/* ... (todo o seu JSX original do InterviewRoom) ... */}
    </div>
  );
}
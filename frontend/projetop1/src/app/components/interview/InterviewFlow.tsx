import { useState, useEffect } from "react";
import { LiveKitRoom, RoomAudioRenderer, useRoomContext } from "@livekit/components-react";
import InterviewRoom from "./InterviewRoom";
import { useAuth } from "../../contexts/AuthContext";

const LIVEKIT_URL = process.env.LIVEKIT_URL || "wss://adaai-x3018794.livekit.cloud";

export default function InterviewFlow() {
  const { user } = useAuth();
  const [token, setToken] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInterview, setShowInterview] = useState(false);

  const generateToken = async () => {
    try {
      setIsConnecting(true);
      const response = await fetch("http://localhost:8000/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: "dev-room",
          identity: `${user?.id}-${Date.now()}`,
          name: user?.name || "Candidato",
        }),
        mode: "cors",
      });

      if (!response.ok) throw new Error("Erro ao gerar token");

      const data = await response.json();
      setToken(data.token);
      setShowInterview(true);
    } catch (error) {
      console.error("Erro ao conectar:", error);
      alert("Erro ao conectar. Verifique se o servidor LiveKit está rodando.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStartInterview = () => generateToken();
  const handleBackToDescription = () => {
    setShowInterview(false);
    setToken("");
  };

  // Antes de conectar, mostra botão para gerar token
  if (!showInterview) {
    return (
      <div className="flex w-full justify-center">
        <button
          onClick={handleStartInterview}
          disabled={isConnecting}
          className="cursor-pointer bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-8 py-3 rounded-full font-medium transition-colors disabled:cursor-not-allowed"
        >
          {isConnecting ? "Conectando..." : "Iniciar Entrevista"}
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={LIVEKIT_URL}
      data-lk-theme="default"
      style={{ width: "100%" }}
      connectOptions={{ autoSubscribe: true }}
      audio={true}
    >
      <InterviewRoom onBack={handleBackToDescription} userName={user?.name} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

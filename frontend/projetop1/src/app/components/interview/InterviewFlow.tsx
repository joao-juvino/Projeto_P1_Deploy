'use client';

import { useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer, useRoomContext } from '@livekit/components-react';
import InterviewCard from './InterviewCard';
import InterviewRoom from './InterviewRoom';
import { useAuth } from '../../contexts/AuthContext';

const LIVEKIT_URL = "wss://adaai-x3018794.livekit.cloud";

function AudioToggleButton() {
  const roomContext = useRoomContext();
  const [enabled, setEnabled] = useState(false);

  const toggleAudio = () => {
    if (!roomContext?.localParticipant) return;
    roomContext.localParticipant.setMicrophoneEnabled(!enabled);
    setEnabled(!enabled);
  };

  return (
    <button
      onClick={toggleAudio}
      style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {enabled ? 'Desativar áudio' : 'Ativar áudio'}
    </button>
  );
}

export default function InterviewFlow() {
  const { user } = useAuth();
  const [token, setToken] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInterview, setShowInterview] = useState(false);

  const generateToken = async () => {
    try {
      setIsConnecting(true);
      const response = await fetch('http://localhost:8000/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room: 'dev-room',
          identity: `${user?.id}-${Date.now()}`,
          name: user?.name || 'Candidato'
        }),
        mode: 'cors',
      });

      if (!response.ok) throw new Error('Erro ao gerar token');

      const data = await response.json();
      setToken(data.token);
      setShowInterview(true);
    } catch (error) {
      console.error('Erro ao conectar:', error);
      alert('Erro ao conectar. Verifique se o servidor LiveKit está rodando.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStartInterview = () => generateToken();
  const handleBackToDescription = () => {
    setShowInterview(false);
    setToken('');
  };

  if (!showInterview) {
    return (
      <div className="max-w-4xl mx-auto">
        <InterviewCard
          onStartInterview={handleStartInterview}
          isConnecting={isConnecting}
          userName={user?.name}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <LiveKitRoom
        token={token}
        serverUrl={LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: 'calc(100vh - 120px)', backgroundColor: "red" }}
        connectOptions={{ autoSubscribe: true }}
      >
        <InterviewRoom onBack={handleBackToDescription} userName={user?.name} />
        <RoomAudioRenderer />
        <AudioToggleButton />
      </LiveKitRoom>
    </div>
  );
}

// app/components/interview/InterviewFlow.tsx
'use client';

import { useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import InterviewCard from './InterviewCard';
import InterviewRoom from './InterviewRoom';
import { useAuth } from '../../contexts/AuthContext';

// Configurações do LiveKit
const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880';

export default function InterviewFlow() {
  const { user } = useAuth();
  const [token, setToken] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInterview, setShowInterview] = useState(false);

  // Função para gerar token
  const generateToken = async () => {
    try {
      setIsConnecting(true);
      
      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room: 'dev-room',
          identity: `${user?.id}-${Date.now()}`,
          name: user?.name || 'Candidato'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao gerar token');
      }
      
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

  const handleStartInterview = () => {
    generateToken();
  };

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
        style={{ height: 'calc(100vh - 120px)' }}
        connectOptions={{ autoSubscribe: true }}
      >
        <InterviewRoom onBack={handleBackToDescription} userName={user?.name} />
        <RoomAudioRenderer />
        <StartAudio label="Clique para ativar áudio" />
      </LiveKitRoom>
    </div>
  );
}
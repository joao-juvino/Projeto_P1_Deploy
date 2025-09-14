"use client";
import { Button, Select } from "antd";
import ProtectedRoute from "../components/ProtectedRoute";
import InterviewFlow from "../components/interview/InterviewFlow";
import { BookText, Code, Lightbulb, Play, Tag } from "lucide-react";
import CodeEditor from "../components/CodeEditor";

import { InterviewProvider, useInterview } from "../contexts/InterviewContext";
import { useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import InterviewRoom from "../components/interview/InterviewRoom";
import { useAuth } from "../contexts/AuthContext";

const LIVEKIT_URL = process.env.LIVEKIT_URL || "wss://adaai-x3018794.livekit.cloud";

export function InterviewLayout() {
  const { currentQuestion } = useInterview();
  const { user } = useAuth();

  // código do editor
  const [code, setCode] = useState("// Digite seu código aqui");

  // controle do LiveKit moved to layout
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

  const handleChangeLanguage = () => {};

  // ===========================================================
  // Se showInterview for true: embrulhamos TODO o layout no LiveKitRoom
  // assim todos os componentes (incl. CodeEditor / botão de enviar código)
  // podem usar useRoomContext() livremente.
  // Caso contrário, renderizamos o layout normalmente (com o botão de iniciar).
  // ===========================================================
  if (showInterview && token) {
    return (
      <LiveKitRoom
        token={token}
        serverUrl={LIVEKIT_URL}
        data-lk-theme="default"
        style={{ width: "100%" }}
        connectOptions={{ autoSubscribe: true }}
        audio={true}
      >
        <div className="flex bg-[#f2f4f7] p-5 h-screen gap-5">
          <div className="flex flex-col gap-5 w-1/2 overflow-y-auto">
            <div className="bg-white p-10 rounded-2xl">
              <div className="flex text-2xl font-bold items-center">
                <BookText className="mr-2" />
                <h3>Description</h3>
              </div>

              {currentQuestion ? (
                <>
                  <h1 className="my-5 text-4xl font-bold">{`${currentQuestion.questionId}. ${currentQuestion.title}`}</h1>
                  <div className="mb-10 flex flex-wrap gap-4 font-bold">
                    <div className="flex justify-center items-center px-6 py-2 rounded-full bg-[#F2F4F7]">
                      <span
                        className={
                          currentQuestion.difficulty?.toLowerCase() === "easy"
                            ? "text-green-500"
                            : currentQuestion.difficulty?.toLowerCase() === "medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                        }
                      >
                        {currentQuestion.difficulty || "N/A"}
                      </span>
                    </div>
                    <div className="flex gap-2 justify-center items-center px-6 py-2 rounded-full bg-[#F2F4F7]">
                      <Tag />
                      <span>Topics</span>
                    </div>
                    <div className="flex gap-2 justify-center items-center px-6 py-2 rounded-full bg-[#F2F4F7]">
                      <Lightbulb />
                      <span>Hint</span>
                    </div>
                  </div>
                  <div className="prose lg:prose-xl max-w-none">
                    <p className="whitespace-pre-wrap">
                      {currentQuestion.content ||
                        "No detailed description provided."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400 py-20">
                  <h1 className="text-2xl font-bold">Aguardando a pergunta...</h1>
                  <p className="mt-2">
                    Ada, a entrevistadora, irá fornecer a pergunta técnica em breve.
                  </p>
                </div>
              )}
            </div>

            <div className="flex bg-white p-10 rounded-2xl">
              {/* Quando conectado, o InterviewFlow renderiza o InterviewRoom (dentro do LiveKitRoom) */}
              <InterviewFlow
                onStart={handleStartInterview}
                onBack={handleBackToDescription}
                showInterview={showInterview}
                isConnecting={isConnecting}
                userName={user?.name}
              />
            </div>
          </div>

          <div className="w-1/2 flex flex-col bg-white p-10 rounded-2xl">
            <div className="mb-5 flex items-center gap-3 font-bold text-2xl">
              <Code size={40} className="text-green-500" />
              <h2>Code</h2>
            </div>
            <Select
              defaultValue="js"
              style={{ width: 120 }}
              onChange={handleChangeLanguage}
              options={[{ value: "js", label: "Javascript" }]}
              className="!mb-5"
            />
            <CodeEditor value={code} onChange={setCode} />

            {/* Botão de enviar código — agora que estamos dentro do LiveKitRoom,
                useRoomContext pode ser utilizado dentro do handler do publish. */}
            <div className="flex justify-end">
              <SendCodeButton code={code} />
            </div>
          </div>

          {/* Room audio renderer (global ao LiveKitRoom) */}
          <RoomAudioRenderer />
        </div>
      </LiveKitRoom>
    );
  }

  // versão quando ainda não iniciou a entrevista (sem LiveKitRoom)
  return (
    <div className="flex bg-[#f2f4f7] p-5 h-screen gap-5">
      <div className="flex flex-col gap-5 w-1/2 overflow-y-auto">
        <div className="bg-white p-10 rounded-2xl">
          <div className="flex text-2xl font-bold items-center">
            <BookText className="mr-2" />
            <h3>Description</h3>
          </div>

          {currentQuestion ? (
            <>
              <h1 className="my-5 text-4xl font-bold">{`${currentQuestion.questionId}. ${currentQuestion.title}`}</h1>
              <div className="mb-10 flex flex-wrap gap-4 font-bold">
                <div className="flex justify-center items-center px-6 py-2 rounded-full bg-[#F2F4F7]">
                  <span
                    className={
                      currentQuestion.difficulty?.toLowerCase() === "easy"
                        ? "text-green-500"
                        : currentQuestion.difficulty?.toLowerCase() === "medium"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }
                  >
                    {currentQuestion.difficulty || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 justify-center items-center px-6 py-2 rounded-full bg-[#F2F4F7]">
                  <Tag />
                  <span>Topics</span>
                </div>
                <div className="flex gap-2 justify-center items-center px-6 py-2 rounded-full bg-[#F2F4F7]">
                  <Lightbulb />
                  <span>Hint</span>
                </div>
              </div>
              <div className="prose lg:prose-xl max-w-none">
                <p className="whitespace-pre-wrap">
                  {currentQuestion.content ||
                    "No detailed description provided."}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-20">
              <h1 className="text-2xl font-bold">Aguardando a pergunta...</h1>
              <p className="mt-2">
                Ada, a entrevistadora, irá fornecer a pergunta técnica em breve.
              </p>
            </div>
          )}
        </div>

        <div className="flex bg-white p-10 rounded-2xl">
          <InterviewFlow
            onStart={handleStartInterview}
            onBack={handleBackToDescription}
            showInterview={showInterview}
            isConnecting={isConnecting}
            userName={user?.name}
          />
        </div>
      </div>

      <div className="w-1/2 flex flex-col bg-white p-10 rounded-2xl">
        <div className="mb-5 flex items-center gap-3 font-bold text-2xl">
          <Code size={40} className="text-green-500" />
          <h2>Code</h2>
        </div>
        <Select
          defaultValue="js"
          style={{ width: 120 }}
          onChange={handleChangeLanguage}
          options={[{ value: "js", label: "Javascript" }]}
          className="!mb-5"
        />
        <CodeEditor value={code} onChange={setCode} />
      </div>
    </div>
  );
}

// componente pequeno responsável por publicar o código — usa useRoomContext
// precisa viver dentro de LiveKitRoom, por isso só é usado quando showInterview === true
import { useRoomContext } from "@livekit/components-react";
function SendCodeButton({ code }: { code: string }) {
  const room = useRoomContext();
  const handleSubmitCode = () => {
    if (!room) return;
    const payload = {
      type: "CODE_SUBMISSION",
      payload: code,
    };
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));

    room.localParticipant.publishData(data, { topic: "interview_events" });
    console.log("Código enviado para o agente:", code);
  };

  return (
    <button onClick={handleSubmitCode} className="mt-5 bg-orange-500 cursor-pointer w-50 py-3 rounded-full text-white">
      Enviar solução
    </button>
  );
}

export default function InterviewPage() {
  return (
    <ProtectedRoute>
      <InterviewProvider>
        <InterviewLayout />
      </InterviewProvider>
    </ProtectedRoute>
  );
}

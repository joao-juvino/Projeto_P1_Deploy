"use client";

import { Select } from "antd";
import ProtectedRoute from "../components/ProtectedRoute";
import InterviewFlow from "../components/interview/InterviewFlow";
import { BookText, Code, Lightbulb, Tag } from "lucide-react";
import CodeEditor from "../components/CodeEditor";

import { InterviewProvider, useInterview } from "../contexts/InterviewContext";
import { useAuth } from "../contexts/AuthContext";

import { useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
  useDataChannel,
} from "@livekit/components-react";

const LIVEKIT_URL =
  process.env.LIVEKIT_URL || "wss://adaai-x3018794.livekit.cloud";

// URL do backend (defina NEXT_PUBLIC_API_BASE_URL no Vercel)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ===========================================================
// MAIN INTERVIEW LAYOUT  (sem export!)
// ===========================================================
function InterviewLayout() {
  const { currentQuestion } = useInterview();
  const { user } = useAuth();

  const [code, setCode] = useState("// Digite seu código aqui");

  // controle do LiveKit
  const [token, setToken] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInterview, setShowInterview] = useState(false);

  const generateToken = async () => {
    try {
      setIsConnecting(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://insufficient-aurelie-ada-ai-1318dfea.koyeb.app";
      const response = await fetch(API_BASE_URL + "/livekit/token", {
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
            {/* ------------------ QUESTION DESCRIPTION ------------------ */}
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
                            : currentQuestion.difficulty?.toLowerCase() ===
                              "medium"
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
                  <h1 className="text-2xl font-bold">
                    Aguardando a pergunta...
                  </h1>
                  <p className="mt-2">
                    Ada, a entrevistadora, irá fornecer a pergunta técnica em
                    breve.
                  </p>
                </div>
              )}
            </div>

            {/* ------------------ FLOW ------------------ */}
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

          {/* ------------------ CODE EDITOR + FEEDBACK ------------------ */}
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

            <FeedbackPanel code={code} />
          </div>

          <RoomAudioRenderer />
        </div>
      </LiveKitRoom>
    );
  }

  // versão pré-entrevista (sem LiveKitRoom)
  return (
    <div className="flex bg-[#f2f4f7] p-5 h-screen gap-5">
      <div className="flex flex-col gap-5 w-1/2 overflow-y-auto">
        <div className="bg-white p-10 rounded-2xl">
          <div className="flex text-2xl font-bold items-center">
            <BookText className="mr-2" />
            <h3>Description</h3>
          </div>
          <p className="text-gray-500 mt-4">
            Inicie a entrevista para receber a primeira questão técnica.
          </p>
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
        <CodeEditor value={code} onChange={setCode} />
      </div>
    </div>
  );
}

// ===========================================================
// COMPONENTE DE FEEDBACK + BOTÕES
// ===========================================================
function FeedbackPanel({ code }: { code: string }) {
  const room = useRoomContext();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Receber feedbacks do agente
  useDataChannel("interview_events", (msg) => {
    try {
      let text: string | null = null;

      // msg.payload é Uint8Array | string
      if (typeof msg.payload === "string") {
        text = msg.payload;
      } else if (msg.payload instanceof Uint8Array) {
        text = new TextDecoder().decode(msg.payload);
      }

      if (!text) return;

      const data = JSON.parse(text);
      if (data.type === "PARTIAL_FEEDBACK_RESULT") {
        setFeedback(data.payload.text);
      } else if (data.type === "FINAL_FEEDBACK_RESULT") {
        setFeedback(data.payload.text);
      } else if (data.type === "SHOW_EVALUATION_FEEDBACK") {
        setFeedback(data.payload.text);
      }
    } catch (error) {
      console.error("Erro ao processar feedback:", error);
    }
  });

  const sendEvent = async (type: string) => {
    if (!room || !code.trim()) return;
    setIsLoading(true);
    try {
      const payload = { type, payload: { text: code } };
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(payload));
      room.localParticipant.publishData(data, { topic: "agent_control" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-3 mt-5">
        <button
          className="bg-orange-500 text-white py-3 px-5 rounded-full cursor-pointer"
          onClick={() => sendEvent("REQUEST_PARTIAL_FEEDBACK")}
          disabled={isLoading}
        >
          Feedback Parcial
        </button>
        <button
          className="bg-orange-500 text-white py-3 px-5 rounded-full cursor-pointer"
          onClick={() => sendEvent("SUBMIT_SOLUTION_FINAL")}
          disabled={isLoading}
        >
          Enviar Solução Final
        </button>
      </div>

      {feedback && (
        <div className="mt-5 p-4 bg-gray-100 rounded-xl">
          <h3 className="font-bold mb-2">Feedback:</h3>
          <pre className="whitespace-pre-wrap text-sm">{feedback}</pre>
        </div>
      )}
    </>
  );
}

// ===========================================================
// PAGE WRAPPER
// ===========================================================
export default function InterviewPage() {
  return (
    <ProtectedRoute>
      <InterviewProvider>
        <InterviewLayout />
      </InterviewProvider>
    </ProtectedRoute>
  );
}

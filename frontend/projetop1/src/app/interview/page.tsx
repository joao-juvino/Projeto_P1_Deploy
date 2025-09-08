"use client";
import { Select } from "antd";
import ProtectedRoute from "../components/ProtectedRoute";
import InterviewFlow from "../components/interview/InterviewFlow";
import { BookText, Code, Lightbulb, Tag } from "lucide-react";
import CodeEditor from "../components/CodeEditor";

import { InterviewProvider, useInterview } from "../contexts/InterviewContext";

function InterviewLayout() {
  const { currentQuestion } = useInterview();

  const handleChangeLanguage = () => {};

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
          <InterviewFlow />
        </div>
      </div>
      <div className="w-1-2 flex flex-col bg-white p-10 rounded-2xl">
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
        <CodeEditor />
      </div>
    </div>
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
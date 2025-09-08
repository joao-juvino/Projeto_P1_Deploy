"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface TechnicalQuestion {
  questionId: string;
  title: string;
  difficulty?: string;
  content?: string;
  topicTags?: string[];
}

interface InterviewContextType {
  currentQuestion: TechnicalQuestion | null;
  setCurrentQuestion: (question: TechnicalQuestion | null) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined
);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [currentQuestion, setCurrentQuestion] =
    useState<TechnicalQuestion | null>(null);

  const value = { currentQuestion, setCurrentQuestion };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
}
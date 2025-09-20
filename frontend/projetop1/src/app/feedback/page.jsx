"use client";
import { useEffect, useState } from "react";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) setFeedback(decodeURIComponent(hash.substring(1)));
  }, []);

  if (!feedback)
    return <p className="text-gray-500 text-center mt-10">Nenhum feedback encontrado.</p>;

  const renderFeedback = () => {
    return feedback
      .split("**")
      .map((part, index) => {
        // Títulos numéricos
        if (part.match(/^\d+\./)) {
          return (
            <h3
              key={index}
              className="text-xl font-bold mt-6 mb-3 text-gray-800 border-b border-gray-300 pb-1"
            >
              {part}
            </h3>
          );
        }

        // Pontos fortes / fracos
        if (part.startsWith("Pontos Fortes") || part.startsWith("Pontos Fracos")) {
          return (
            <div key={index} className="mb-5">
              <strong className="font-semibold text-gray-700">{part.split(":")[0]}:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                {part
                  .split(":")[1]
                  .split("*")
                  .filter(Boolean)
                  .map((item, i) => (
                    <li key={i} className="mb-1">
                      {item.trim()}
                    </li>
                  ))}
              </ul>
            </div>
          );
        }

        if (part.trim().startsWith("function") || part.includes("console.log")) {
          return (
            <pre
              key={index}
              className="bg-gray-100 rounded-md p-4 mb-4 overflow-x-auto text-sm text-gray-800 font-mono"
            >
              {part.trim().split(/\\r?\\n/).map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </pre>
          );
        }

        // Parágrafo normal
        return (
          <p key={index} className="mb-3 text-gray-700 leading-relaxed">
            {part}
          </p>
        );
      });
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-10 font-sans leading-relaxed bg-white rounded-lg shadow-lg">
      {renderFeedback()}
    </div>
  );
}

// app/components/interview/InterviewCard.tsx
"use client";

interface InterviewCardProps {
  onStartInterview: () => void;
  isConnecting: boolean;
  userName?: string;
}

export default function InterviewCard({
  onStartInterview,
  isConnecting,
  userName,
}: InterviewCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Header com ícone */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-gray-900">Description</h2>
      </div>

      {/* Título da entrevista */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">1. Two Sum</h1>

      {/* Tags */}
      <div className="flex items-center gap-4 mb-6">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Easy
        </span>
        <div className="flex items-center text-gray-600">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a2 2 0 012-2z"
            />
          </svg>
          Topics
        </div>
        <div className="flex items-center text-gray-600">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          Hint
        </div>
      </div>

      {/* Descrição */}
      <div className="text-gray-700 leading-relaxed mb-8">
        <p className="mb-4">
          Given an array of integers{" "}
          <code className="bg-gray-100 px-1 rounded">nums</code> and an integer{" "}
          <code className="bg-gray-100 px-1 rounded">target</code>, return
          indices of the two numbers such that they add up to target. You may
          assume that each input would have exactly one solution, and you may
          not use the same element twice.
        </p>
        <p className="mb-4">
          You can return the answer in any order. Try to come up with an
          algorithm that is less than{" "}
          <code className="bg-gray-100 px-1 rounded">O(n²)</code> time
          complexity.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-800 mb-2">Example:</p>
          <p className="text-sm text-gray-600">
            <strong>Input:</strong> nums = [2,7,11,15], target = 9<br />
            <strong>Output:</strong> [0,1]
            <br />
            <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we
            return [0, 1].
          </p>
        </div>
      </div>

      {/* Botão para iniciar entrevista */}
      <div className="text-center">
        <div className="mb-4">
          {userName && (
            <p className="text-sm text-gray-600">
              Olá <span className="font-medium">{userName}</span>, pronto para
              começar?
            </p>
          )}
        </div>

        <button
          onClick={onStartInterview}
          disabled={isConnecting}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center mx-auto"
        >
          {isConnecting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Conectando com Ada...
            </>
          ) : (
            "Iniciar Entrevista com Ada"
          )}
        </button>

        {isConnecting && (
          <p className="text-sm text-gray-500 mt-2">
            Aguarde enquanto conectamos você com a Ada...
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Input from "../Input";
import AuthLinks from "../AuthLinks";
import { authService, ApiError } from "../../services/auth";

const RecoverForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validação básica
      if (!email) {
        throw new Error("Por favor, digite seu email");
      }

      if (!email.includes("@")) {
        throw new Error("Por favor, digite um email válido");
      }

      const response = await authService.forgotPassword(email);
      setSuccess(response.message);
    } catch (err: any) {
      const apiError = err as ApiError;

      if (apiError.status === 400) {
        setError("Email inválido ou não encontrado");
      } else if (apiError.status === 0) {
        setError("Não foi possível conectar ao servidor");
      } else {
        setError(apiError.message || "Erro interno do servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[606px] min-h-[600px] bg-white flex flex-col items-center p-8">
        <div className="w-full flex justify-center mb-8">
          <img src="/imgs/app.png" alt="Logo do aplicativo" />
        </div>

        <h1 className="text-[#7F8C8D] text-xl font-medium mb-8">
          Recuperar Senha
        </h1>

        <div className="w-full max-w-[350px] bg-[#F9F2E1] border border-[#E8D5A3] rounded p-4 mb-8">
          <p className="text-[#8A6914] text-sm leading-5">
            Esqueceu sua senha? Digite seu endereço de e-mail abaixo e
            enviaremos uma mensagem permitindo que você redefina sua senha.
          </p>
        </div>

        {/* Mensagens de feedback */}
        {error && (
          <div className="w-full max-w-[350px] bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="w-full max-w-[350px] bg-green-50 border border-green-200 rounded p-3 mb-4">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <form
          className="w-full max-w-[350px] flex flex-col"
          onSubmit={handleSubmit}
        >
          <Input
            name="Email"
            type="email"
            placeholder="user@email.com"
            value={email}
            onChange={setEmail}
            disabled={loading}
          />

          <button
            className={`w-full my-5 text-white rounded py-3 transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5CB85C] hover:bg-[#4CAE4C]"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Recuperar"}
          </button>
        </form>

        <AuthLinks showBackToLogin />
      </div>
    </div>
  );
};

export default RecoverForm;

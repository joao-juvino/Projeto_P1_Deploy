"use client";

import { useState } from "react";
import Input from "../Input";
import { authService, ApiError } from "../../services/auth";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setEmail("");
    setError("");
    setSuccess("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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

      // Fechar modal após alguns segundos
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err: any) {
      const apiError = err as ApiError;

      if (apiError.status === 400) {
        setError("Email inválido");
      } else if (apiError.status === 0) {
        setError("Não foi possível conectar ao servidor");
      } else {
        setError(apiError.message || "Erro interno do servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-[#37474F]">
            Esqueci minha senha
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Informação */}
          <div className="bg-[#F9F2E1] border border-[#E8D5A3] rounded p-4 mb-6">
            <p className="text-[#8A6914] text-sm leading-5">
              Digite seu endereço de e-mail e enviaremos um link para redefinir
              sua senha.
            </p>
          </div>

          {/* Mensagens de feedback */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
              <p className="text-green-700 text-sm">{success}</p>
              <p className="text-green-600 text-xs mt-1">
                Fechando automaticamente...
              </p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <Input
              name="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={setEmail}
              disabled={loading}
            />

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-4 py-2 text-white rounded transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#5CB85C] hover:bg-[#4CAE4C]"
                }`}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

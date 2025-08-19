"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLinks from "../AuthLinks";
import Input from "../Input";
import ForgotPasswordModal from "../ForgotPasswordModal";
import { authService, ApiError } from "../../services/auth";

const Form = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpa mensagens ao digitar
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validação básica
      if (!formData.email || !formData.password) {
        throw new Error("Por favor, preencha todos os campos");
      }

      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      setSuccess(response.message);

      // Redirecionar após login bem-sucedido
      setTimeout(() => {
        router.push("/dashboard"); // Ajuste para sua rota pós-login
      }, 1500);
    } catch (err: any) {
      const apiError = err as ApiError;

      if (apiError.status === 401) {
        setError("Email ou senha incorretos");
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
      <div className="w-[606px] min-h-[749px] bg-white flex flex-col items-center justify-center px-8">
        <form
          className="flex flex-col items-center w-full max-w-[350px]"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex justify-center mb-8">
            <img src="/imgs/app.png" alt="Logo do aplicativo" />
          </div>

          {/* Mensagens de feedback */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="w-full bg-green-50 border border-green-200 rounded p-3 mb-4">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <Input
            name="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            placeholder="seu@email.com"
            disabled={loading}
          />

          <Input
            name="Senha"
            type="password"
            value={formData.password}
            onChange={(value) => handleInputChange("password", value)}
            placeholder="Digite sua senha"
            disabled={loading}
          />

          <button
            className={`w-full my-5 text-white rounded-sm py-3 transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#37474F] hover:bg-[#2C3E45]"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <AuthLinks
          showForgotPassword
          onForgotPasswordClick={() => setShowForgotPasswordModal(true)}
        />
      </div>

      {/* Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
};

export default Form;

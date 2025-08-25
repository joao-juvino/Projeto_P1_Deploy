"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import AuthLinks from "../AuthLinks";
import Input from "../Input";
import ForgotPasswordModal from "../ForgotPasswordModal";

const Form = () => {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();

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
        setError("Por favor, preencha todos os campos");
        return;
      }

      const result = await login(formData.email, formData.password);

      if (result.success) {
        setSuccess(result.message || "Login realizado com sucesso!");

        // Redirecionar após login bem-sucedido
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setError(result.error || "Erro no login");
      }
    } catch (err: any) {
      setError(err.message || "Erro interno do servidor");
    } finally {
      setLoading(false);
    }
  };

  const isFormLoading = loading || authLoading;

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
            disabled={isFormLoading}
          />

          <Input
            name="Senha"
            type="password"
            value={formData.password}
            onChange={(value) => handleInputChange("password", value)}
            placeholder="Digite sua senha"
            disabled={isFormLoading}
          />

          <button
            className={`w-full my-5 text-white rounded-sm py-3 transition-colors ${
              isFormLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#37474F] hover:bg-[#2C3E45]"
            }`}
            type="submit"
            disabled={isFormLoading}
          >
            {isFormLoading ? "Entrando..." : "Entrar"}
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

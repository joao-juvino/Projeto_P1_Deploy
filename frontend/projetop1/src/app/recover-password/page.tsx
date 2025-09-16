"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "../components/Input";
import AuthLinks from "../components/AuthLinks";
import { authService, ApiError } from "../services/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Token de recuperação inválido ou expirado");
    }
  }, [token]);

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

    if (!token) {
      setError("Token de recuperação não encontrado");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validações
      if (!formData.password) {
        throw new Error("Por favor, digite a nova senha");
      }

      if (formData.password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("As senhas não coincidem");
      }

      const response = await authService.resetPassword(
        token,
        formData.password
      );
      setSuccess(response.message);

      // Redirecionar para login após alguns segundos
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: any) {
      const apiError = err as ApiError;

      if (apiError.status === 400) {
        setError("Token inválido ou expirado");
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
          Redefinir Senha
        </h1>

        <div className="w-full max-w-[350px] bg-[#E8F4FD] border border-[#B3D9F2] rounded p-4 mb-8">
          <p className="text-[#1565C0] text-sm leading-5">
            Digite sua nova senha abaixo. Certifique-se de escolher uma senha
            segura.
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
            <p className="text-green-600 text-xs mt-1">
              Redirecionando para o login...
            </p>
          </div>
        )}

        <form
          className="w-full max-w-[350px] flex flex-col"
          onSubmit={handleSubmit}
        >
          <Input
            name="Nova Senha"
            type="password"
            placeholder="Digite sua nova senha"
            value={formData.password}
            onChange={(value) => handleInputChange("password", value)}
            disabled={loading}
            required
          />

          <Input
            name="Confirmar Senha"
            type="password"
            placeholder="Confirme sua nova senha"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange("confirmPassword", value)}
            disabled={loading}
            required
          />

          <button
            className={`w-full my-5 text-white rounded py-3 transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5CB85C] hover:bg-[#4CAE4C]"
            }`}
            type="submit"
            disabled={loading || !token}
          >
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>

        <AuthLinks showBackToLogin />
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <div className="bg-[#f2f4f7] min-h-screen p-5">
      <Suspense
        fallback={
          <div className="w-full flex justify-center items-center min-h-screen">
            <div className="text-[#7F8C8D]">Carregando...</div>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

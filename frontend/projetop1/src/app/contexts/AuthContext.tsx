// app/contexts/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (
    token: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure sua URL base da API aqui
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há um usuário logado no localStorage ao carregar
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erro ao carregar usuário salvo:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Criar dados do usuário (adapte conforme sua API retorna)
        const userData = {
          id: Date.now().toString(), // Use o ID real da API se disponível
          name: email.split("@")[0], // Use o nome real da API se disponível
          email: email,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return {
          success: true,
          message: data.message || "Login realizado com sucesso!",
        };
      } else {
        return {
          success: false,
          error: data.message || "Erro no login",
        };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: "Não foi possível conectar ao servidor",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Cadastro realizado com sucesso!",
        };
      } else {
        return {
          success: false,
          error: data.message || "Erro no cadastro",
        };
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return {
        success: false,
        error: "Não foi possível conectar ao servidor",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Email de recuperação enviado!",
        };
      } else {
        return {
          success: false,
          error: data.message || "Erro ao solicitar recuperação",
        };
      }
    } catch (error) {
      console.error("Erro ao solicitar recuperação:", error);
      return {
        success: false,
        error: "Não foi possível conectar ao servidor",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Senha redefinida com sucesso!",
        };
      } else {
        return {
          success: false,
          error: data.message || "Erro ao redefinir senha",
        };
      }
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      return {
        success: false,
        error: "Não foi possível conectar ao servidor",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    forgotPassword,
    resetPassword,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

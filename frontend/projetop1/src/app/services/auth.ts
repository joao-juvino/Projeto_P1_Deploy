const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface LoginData {
  username?: string;
  email?: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface ApiResponse {
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
}

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || "Erro na requisição",
          status: response.status,
        };
        throw error;
      }

      return data;
    } catch (error: any) {
      if (error.status) {
        throw error;
      }

      // Erro de rede ou conexão
      throw {
        message: "Erro de conexão com o servidor",
        status: 0,
      } as ApiError;
    }
  }

  async login(loginData: LoginData): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>("/signin", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  }

  async signup(signupData: SignupData): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>("/signup", {
      method: "POST",
      body: JSON.stringify(signupData),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>("/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>("/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  async confirmEmail(token: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`/confirm/${token}`, {
      method: "GET",
    });
  }
}

export const authService = new AuthService();

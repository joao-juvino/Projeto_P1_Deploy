// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Aqui você faria a autenticação com seu backend Python/Sanic
    // Por enquanto, vou simular uma autenticação simples

    // Exemplo de chamada para seu backend Sanic:
    /*
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const userData = await response.json();
    */

    // Simulação simples para demonstração
    // Remova isso e use a chamada real para seu backend
    if (email === "test@test.com" && password === "123456") {
      const user = {
        id: "1",
        name: "Pedro",
        email: email,
      };

      return NextResponse.json({
        success: true,
        user,
      });
    } else {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

"use client";

import Link from "next/link";

interface AuthLinksProps {
  showCreateAccount?: boolean;
  showBackToLogin?: boolean;
  showForgotPassword?: boolean;
  onForgotPasswordClick?: () => void;
}

const AuthLinks = ({
  showCreateAccount = false,
  showBackToLogin = false,
  showForgotPassword = false,
  onForgotPasswordClick,
}: AuthLinksProps = {}) => {
  if (
    showCreateAccount === undefined &&
    showBackToLogin === undefined &&
    showForgotPassword === undefined
  ) {
    return (
      <>
        <button
          onClick={onForgotPasswordClick}
          className="text-[#37474F] hover:underline cursor-pointer bg-none border-none"
        >
          Esqueceu a senha?
        </button>
        <Link className="text-[#37474F] hover:underline" href="/cadastro">
          Cadastre-se
        </Link>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      {showCreateAccount && (
        <Link href="/cadastro" className="text-[#5CB85C] hover:underline">
          Criar nova conta
        </Link>
      )}
      {showBackToLogin && (
        <Link href="/" className="text-[#657786] hover:underline">
          Voltar para o login
        </Link>
      )}
      {showForgotPassword && (
        <button
          onClick={onForgotPasswordClick}
          className="text-[#5CB85C] hover:underline cursor-pointer bg-none border-none"
        >
          Esqueci minha senha
        </button>
      )}
    </div>
  );
};

export default AuthLinks;

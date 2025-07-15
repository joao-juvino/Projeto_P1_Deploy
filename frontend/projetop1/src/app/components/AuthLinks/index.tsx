import Link from "next/link";

interface AuthLinksProps {
  showCreateAccount?: boolean;
  showBackToLogin?: boolean;
  showForgotPassword?: boolean;
}

const AuthLinks = ({
  showCreateAccount = false,
  showBackToLogin = false,
  showForgotPassword = false,
}: AuthLinksProps = {}) => {
  if (
    showCreateAccount === undefined &&
    showBackToLogin === undefined &&
    showForgotPassword === undefined
  ) {
    return (
      <>
        <Link
          className="text-[#37474F] hover:underline"
          href="/recover-password"
        >
          Esqueceu a senha?
        </Link>
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
        <Link
          href="/recover-password"
          className="text-[#5CB85C] hover:underline"
        >
          Esqueci minha senha
        </Link>
      )}
    </div>
  );
};

export default AuthLinks;

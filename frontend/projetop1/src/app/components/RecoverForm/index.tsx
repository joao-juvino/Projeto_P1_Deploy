import Input from "../Input";
import AuthLinks from "../AuthLinks";

const RecoverForm = () => {
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

        <form className="w-full max-w-[350px] flex flex-col">
          <Input name="Email" type="email" placeholder="user@email.com" />

          <button
            className="w-full my-5 text-white rounded py-3 bg-[#5CB85C] hover:bg-[#4CAE4C] transition-colors"
            type="submit"
          >
            Recuperar
          </button>
        </form>

        <AuthLinks showBackToLogin />
      </div>
    </div>
  );
};

export default RecoverForm;

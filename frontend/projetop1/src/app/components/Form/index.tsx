import AuthLinks from "../AuthLinks";
import Input from "../Input"

const Form = () => {
    return (
        <div className="w-full flex justify-center">
            <div className="w-[606px] h-[749px] bg-white flex flex-col items-center">
                <form className="flex flex-col items-center">
                    <div className="w-full flex justify-center">
                        <img src="/imgs/app.png"/>
                    </div>
                    <Input name={"E-mail"} type={"email"}/>
                    <Input name={"Senha"} type={"password"}/>
                    <button className="w-[300px] my-5 text-white rounded-sm py-3 bg-[#37474F]" type="submit">Entrar</button>
                </form>
                <AuthLinks />
                
            </div>
        </div>
    );
}

export default Form;

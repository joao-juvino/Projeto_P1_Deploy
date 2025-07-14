const Menu = () => {
    return (
        <div className="flex flex-col items-start px-5 py-10 md:flex-row md:items-center md:px-20 md:py-5 ">
            <div className="w-[103px] h-[92px]" >
                <img className="w-full h-full" src="/imgs/logo.png" alt="human figure using a headset" />
            </div>
            <nav className="md:ml-30">
                <ul className="flex items-center gap-10 mt-5 md:mt-0 md:gap-20">
                    <li>Início</li>
                    <li>Contanto</li>
                    <li>Entrar</li>
                </ul>
            </nav>
        </div>
    );
}

export default Menu;

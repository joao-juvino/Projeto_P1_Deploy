const Input = ({name, type}) => {
    return (
        <>
            <label className="w-full mb-2 text-[#657786]">{name}:</label>
            <input className="p-5 w-full mb-5 bg-[#E6E6E6] h-10 rounded-full" type={type} />
        </>
    );
}

export default Input;

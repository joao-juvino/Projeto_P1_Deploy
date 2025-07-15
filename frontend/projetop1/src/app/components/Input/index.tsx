interface InputProps {
  name: string;
  type: string;
  placeholder?: string;
}

const Input = ({ name, type, placeholder }: InputProps) => {
  return (
    <div className="w-full mb-5">
      <label className="block mb-2 text-[#657786] font-medium">{name}:</label>
      <input
        className="p-3 w-full bg-[#E6E6E6] h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5CB85C] transition-all"
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;

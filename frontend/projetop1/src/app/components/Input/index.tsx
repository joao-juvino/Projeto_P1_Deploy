"use client";

interface InputProps {
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

const Input = ({
  name,
  type,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
}: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full max-w-[300px] mb-4">
      <label className="block text-[#37474F] text-sm font-medium mb-2">
        {name}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#37474F] focus:border-transparent transition-all ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}
      />
    </div>
  );
};

export default Input;

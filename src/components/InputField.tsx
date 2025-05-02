// components/InputField.tsx
import React from "react";

type Props = {
  label: string;
  name: string;
  register: unknown;
  type?: string;
  placeholder?: string;
};

const InputField = ({ label, name, register, type = "text", placeholder }: Props) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input id={name} {...register(name)} type={type} placeholder={placeholder} className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
    </div>
  );
};

export default InputField;

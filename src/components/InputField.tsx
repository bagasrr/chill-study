// file: components/InputField.tsx

import React from "react";
// 1. Import tipe yang diperlukan dari react-hook-form
import { UseFormRegister, Path, FieldValues } from "react-hook-form";

// 2. Buat tipe Props menjadi generik dengan <TFieldValues extends FieldValues>
type Props<TFieldValues extends FieldValues> = {
  label: string;
  // 3. 'name' sekarang harus merupakan nama field yang valid dari form (Path<T>)
  name: Path<TFieldValues>;
  // 4. 'register' sekarang memiliki tipe yang benar sesuai dari react-hook-form
  register: UseFormRegister<TFieldValues>;
  type?: string;
  placeholder?: string;
};

// 5. Gunakan tipe generik pada komponen
const InputField = <TFieldValues extends FieldValues>({ label, name, register, type = "text", placeholder }: Props<TFieldValues>) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        {...register(name)} // Sekarang 'name' di sini 100% aman secara tipe
        type={type}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>
  );
};

export default InputField;

import { NavigateBefore, Save } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";

interface BackSubmitButtonProps {
  submit: string;
  disable: boolean;
  onClick?: () => void;
}
const BackSubmitButton = ({ submit = "Submit", disable = false, onClick }: BackSubmitButtonProps) => {
  const router = useRouter();
  return (
    <div className="flex justify-between">
      <button type="button" onClick={() => router.back()} className={`w-fit py-2 px-5 text-blue-800 border border-blue-700 hover:bg-blue-700/20 rounded-md ${disable ? "opacity-50 cursor-not-allowed" : ""}`}>
        <NavigateBefore />
        Kembali
      </button>
      <button type="submit" className={`w-fit py-2 px-5 text-green-800 border border-green-700 hover:bg-green-700/20 rounded-md ${disable ? "opacity-50 cursor-not-allowed" : ""}`} disabled={disable} onClick={onClick}>
        {submit} <Save />
      </button>
    </div>
  );
};

export default BackSubmitButton;

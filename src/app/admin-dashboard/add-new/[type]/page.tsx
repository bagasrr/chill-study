"use client";
import AddAdminForm from "@/components/AddForm/AddAdminForm";
import AddKelasForm from "@/components/AddForm/AddKelasForm";
import AddMateriForm from "@/components/AddForm/AddMateriForm";
import AddStudentForm from "@/components/AddForm/AddStudentForm";
import { useParams } from "next/navigation";

const formComponents: Record<string, JSX.Element> = {
  admin: <AddAdminForm />,
  student: <AddStudentForm />,
  materi: <AddMateriForm />,
  kelas: <AddKelasForm />,
};

export default function AddNewAccountPage() {
  const { type } = useParams<{ type: string }>();

  return formComponents[type] || <div className="bg-slate-100 h-screen text-center  margin-auto items-center text-3xl ">Halaman Tidak Ditemukan</div>;
}

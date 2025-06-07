"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useKelasWithoutExam } from "@/lib/hooks/useKelasWithoutExam";
import { Delete, NavigateBefore } from "@mui/icons-material";
import toast from "react-hot-toast";
import { GradientCircularProgress } from "../GradientCircularProgress";
import { useState } from "react";
import axios from "axios";

type QuestionType = {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
};

type FormType = {
  kelasId: string;
  title: string;
  description: string;
  graduate: number;
  questions: QuestionType[];
};

export default function AddExamForm() {
  const router = useRouter();
  const { kelas, isLoading } = useKelasWithoutExam();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control } = useForm<FormType>({
    defaultValues: {
      kelasId: "",
      title: "",
      description: "",
      graduate: 0,
      questions: [
        {
          questionText: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "A",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (data: FormType) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      await axios.post("/api/admin/exam/create", data);
      toast.success("Berhasil menambahkan exam");
      router.push("/admin-dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gagal submit");
      } else {
        toast.error("Gagal submit");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Tambah Ujian</h1>

      {isLoading ? (
        <p className="mb-4 text-gray-500">Loading daftar kelas...</p>
      ) : (
        <select {...register("kelasId")} className="w-full p-2 mb-4 border rounded">
          <option value="">Pilih Kelas</option>
          {kelas?.map((k: { id: string; title: string }) => (
            <option key={k.id} value={k.id}>
              {k.title}
            </option>
          ))}
        </select>
      )}

      <input type="text" placeholder="Judul Ujian" {...register("title")} className="w-full p-2 mb-4 border rounded" />
      <textarea placeholder="Deskripsi" {...register("description")} className="w-full p-2 mb-6 border rounded" />
      <input type="number" placeholder="Jumlah soal benar untuk lulus" {...register("graduate", { valueAsNumber: true })} className="w-full p-2 mb-4 border rounded" />

      <h2 className="text-lg font-semibold mb-2">Soal-soal</h2>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-6 p-4 border rounded bg-gray-50 relative">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium">Soal {index + 1}</p>

            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)} className="text-red-500 hover:underline">
                <Delete />
              </button>
            )}
          </div>
          <div className="mb-2 py-5">
            <div className="flex items-center gap-5">
              <input type="text" placeholder="Pertanyaan" {...register(`questions.${index}.questionText` as const)} className="w-full p-2 border rounded" />

              <input
                type="file"
                accept="image/png, image/jpeg"
                // onChange={
                //   // (e) => setFile(e.target.files?.[0] ?? null)
                // }
                className="w-full border border-gray-300 rounded bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer file:cursor-pointer"
              />
            </div>

            <p className="text-xs text-red-500 font-bold">*Upload gambar jika diperlukan (Tidak harus Menggunakan gambar)</p>
          </div>

          {/* {["A", "B", "C", "D"].map((opt) => (
            <input key={opt} type="text" placeholder={`Pilihan ${opt}`} {...register(`questions.${index}[option${opt}]` as const)} className="w-full mb-2 p-2 border rounded" />
          ))} */}

          {["A", "B", "C", "D"].map((opt, index) => (
            <input
              key={opt}
              type="text"
              placeholder={`Pilihan ${opt}`}
              {...(opt === "A"
                ? register(`questions.${index}.optionA` as const)
                : opt === "B"
                ? register(`questions.${index}.optionB` as const)
                : opt === "C"
                ? register(`questions.${index}.optionC` as const)
                : register(`questions.${index}.optionD` as const))}
              className="w-full mb-2 p-2 border rounded"
            />
          ))}

          <select {...register(`questions.${index}.correctAnswer` as const)} className="w-full p-2 border rounded">
            <option value="A">Jawaban Benar: A</option>
            <option value="B">Jawaban Benar: B</option>
            <option value="C">Jawaban Benar: C</option>
            <option value="D">Jawaban Benar: D</option>
          </select>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          append({
            questionText: "",
            optionA: "",
            optionB: "",
            optionC: "",
            optionD: "",
            correctAnswer: "A",
          })
        }
        className="text-blue-600 hover:underline mb-6"
      >
        + Tambah Soal
      </button>

      <div className="flex justify-between">
        <button type="button" onClick={() => router.back()} className="w-fit py-2 px-5 text-blue-800 border border-blue-700 hover:bg-blue-700/20 rounded-md">
          <NavigateBefore />
          Kembali
        </button>
        <button type="submit" className="w-fit py-2 px-5 text-green-800 border border-green-700 hover:bg-green-700/20 rounded-md">
          Simpan Ujian
        </button>
      </div>
      {isSubmitting && <GradientCircularProgress />}
    </form>
  );
}

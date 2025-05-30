"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAllKelas } from "@/lib/hooks/useAllKelas";
import toast from "react-hot-toast";
import { Delete } from "@mui/icons-material";
import { GradientCircularProgress } from "@/components/GradientCircularProgress";

type QuestionType = {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
};

type ExamFormType = {
  id: string;
  kelasId: string;
  title: string;
  description: string;
  graduate: number;
  questions: QuestionType[];
};

export default function EditExamForm() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { kelas, isLoading: loadingKelas } = useAllKelas();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<ExamFormType>({
    defaultValues: {
      id: "",
      kelasId: "",
      title: "",
      description: "",
      graduate: 0,
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (id) getInitialData();
  }, [id]);

  const getInitialData = async () => {
    try {
      const res = await axios.get(`/api/${id}/details/exam`);
      reset(res.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Gagal mengambil data");
    }
  };

  const onSubmit = async (data: ExamFormType) => {
    setIsSubmitting(true);
    try {
      await axios.patch(`/api/${data.id}/edit/exam`, data);
      toast.success("Berhasil mengedit exam");
      router.push("/admin-dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal menyimpan perubahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Ujian</h1>

      {loadingKelas ? (
        <p className="mb-4 text-gray-500">Loading daftar kelas...</p>
      ) : (
        <select {...register("kelasId")} className="w-full p-2 mb-4 border rounded">
          <option value="">Pilih Kelas</option>
          {kelas?.map((k) => (
            <option key={k.id} value={k.id}>
              {k.title}
            </option>
          ))}
        </select>
      )}

      <input type="text" {...register("title")} placeholder="Judul Ujian" className="w-full p-2 mb-4 border rounded" />
      <textarea {...register("description")} placeholder="Deskripsi" className="w-full p-2 mb-4 border rounded" />
      <input type="number" {...register("graduate")} placeholder="Jumlah soal benar untuk lulus" className="w-full p-2 mb-6 border rounded" />

      <h2 className="text-lg font-semibold mb-2">Soal-soal</h2>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-6 p-4 border rounded bg-gray-50 relative">
          <div className="flex items-center justify-between py-5">
            <p>{index + 1}</p>
            <button type="button" onClick={() => remove(index)} className="text-red-500 hover:underline">
              <Delete />
            </button>
          </div>

          <input type="text" placeholder="Pertanyaan" {...register(`questions.${index}.questionText` as const)} className="w-full mb-2 p-2 border rounded" />

          {["A", "B", "C", "D"].map((opt) => (
            <input key={opt} type="text" placeholder={`Pilihan ${opt}`} {...register(`questions.${index}[option${opt}]` as const)} className="w-full mb-2 p-2 border rounded" />
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

      <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
        {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
      </button>

      <button type="button" onClick={() => router.back()} className="w-full py-2 mt-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
        Kembali
      </button>

      {isSubmitting && <GradientCircularProgress />}
    </form>
  );
}

"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useKelasWithoutExam } from "@/lib/hooks/useKelasWithoutExam";
import { Delete, NavigateBefore } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Tipe data soal
type QuestionType = {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  questionImage?: string | null;
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
  const [questionImages, setQuestionImages] = useState<(File | null)[]>([]);
  const { data: session } = useSession();

  const supabase = createClientComponentClient();

  const { register, handleSubmit, control } = useForm<FormType>({
    defaultValues: {
      kelasId: "",
      title: "",
      description: "",
      graduate: 0,
      questions: [
        {
          questionText: "",
          questionImage: null,
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

  const handleFileChange = (file: File | null, index: number) => {
    const updated = [...questionImages];
    updated[index] = file;
    setQuestionImages(updated);
  };

  useEffect(() => {
    const syncSupabaseSession = async () => {
      if (session?.access_token) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: session.id_token as string,
        });
        if (error) {
          toast.error(`Gagal sinkronisasi session Supabase: ${error.message}`);
        }
      }
    };
    syncSupabaseSession();
  }, [session?.access_token]);

  const onSubmit = async (data: FormType) => {
    setIsSubmitting(true);
    try {
      const {
        data: { session: supabaseSession },
        error,
      } = await supabase.auth.getSession();

      if (error || !supabaseSession) {
        toast.error("Tidak terautentikasi dengan Supabase");
        setIsSubmitting(false);
        return;
      }

      const updatedQuestions = await Promise.all(
        data.questions.map(async (q, idx) => {
          const file = questionImages[idx];
          let questionImage = "";

          if (file && file.size > 0) {
            const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
            const filename = `${Date.now()}_${safeName}`;
            const path = `exam/image/${filename}`;

            const { error } = await supabase.storage.from("file").upload(path, file);
            if (error) throw new Error(`Gagal upload gambar: ${error.message}`);

            questionImage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/file/${path}`;
          }

          return { ...q, questionImage };
        })
      );

      await axios.post("/api/admin/exam/create", {
        ...data,
        questions: updatedQuestions,
      });

      console.log(data, updatedQuestions);

      toast.success("Berhasil menambahkan ujian");
      router.push("/admin-dashboard");
    } catch (err) {
      console.log(err);
      toast.error("Gagal submit ujian");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-6">Tambah Ujian</h1>

      {isLoading ? (
        <p>Loading daftar kelas...</p>
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

      <input type="text" placeholder="Judul Ujian" {...register("title")} className="w-full p-2 mb-4 border rounded" />
      <textarea placeholder="Deskripsi" {...register("description")} className="w-full p-2 mb-4 border rounded" />
      <input type="number" placeholder="Jumlah benar untuk lulus" {...register("graduate", { valueAsNumber: true })} className="w-full p-2 mb-4 border rounded" />

      <h2 className="text-lg font-semibold mb-4">Soal</h2>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-6 border p-4 rounded bg-gray-50">
          <div className="flex justify-between mb-2">
            <p className="font-medium">Soal {index + 1}</p>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)} className="text-red-500">
                <Delete />
              </button>
            )}
          </div>
          <input type="text" placeholder="Pertanyaan" {...register(`questions.${index}.questionText` as const)} className="w-full p-2 mb-2 border rounded" />
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files?.[0] || null, index)} className="mb-2" />
          <input type="text" placeholder="Opsi A" {...register(`questions.${index}.optionA` as const)} className="w-full p-2 mb-2 border rounded" />
          <input type="text" placeholder="Opsi B" {...register(`questions.${index}.optionB` as const)} className="w-full p-2 mb-2 border rounded" />
          <input type="text" placeholder="Opsi C" {...register(`questions.${index}.optionC` as const)} className="w-full p-2 mb-2 border rounded" />
          <input type="text" placeholder="Opsi D" {...register(`questions.${index}.optionD` as const)} className="w-full p-2 mb-2 border rounded" />
          <select {...register(`questions.${index}.correctAnswer` as const)} className="w-full p-2 mb-2 border rounded">
            <option value="A">Jawaban Benar : A</option>
            <option value="B">Jawaban Benar : B</option>
            <option value="C">Jawaban Benar : C</option>
            <option value="D">Jawaban Benar : D</option>
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
            questionImage: null,
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
    </form>
  );
}

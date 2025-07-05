"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useKelasWithoutExam } from "@/lib/hooks/useKelasWithoutExam";
import { Delete, NavigateBefore, Image as ImageIcon, RemoveCircleOutline } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useState, useCallback } from "react";
import axios from "axios";
// import { useSession } from "next-auth/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GradientCircularProgress } from "../GradientCircularProgress";
import Image from "next/image"; // Import Next/Image

// Tipe data soal (tidak berubah)
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
  // State baru untuk URL pratinjau gambar
  const [questionImagePreviews, setQuestionImagePreviews] = useState<(string | null)[]>([]);
  // const { data: session } = useSession();

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

  // Fungsi menangani perubahan file, sekarang dengan pratinjau
  const handleFileChange = useCallback(
    (file: File | null, index: number) => {
      const updatedFiles = [...questionImages];
      updatedFiles[index] = file;
      setQuestionImages(updatedFiles);

      const updatedPreviews = [...questionImagePreviews];
      // Hapus pratinjau lama jika ada
      if (questionImagePreviews[index]) {
        URL.revokeObjectURL(questionImagePreviews[index] as string);
      }
      // Buat URL pratinjau baru jika ada file
      updatedPreviews[index] = file ? URL.createObjectURL(file) : null;
      setQuestionImagePreviews(updatedPreviews);
    },
    [questionImages, questionImagePreviews]
  );

  // Fungsi untuk menghapus gambar yang dipilih
  const handleRemoveImage = useCallback(
    (index: number) => {
      // Hapus dari state file
      const updatedFiles = [...questionImages];
      updatedFiles[index] = null;
      setQuestionImages(updatedFiles);

      // Hapus dari state pratinjau
      const updatedPreviews = [...questionImagePreviews];
      if (updatedPreviews[index]) {
        URL.revokeObjectURL(updatedPreviews[index] as string);
        updatedPreviews[index] = null;
        setQuestionImagePreviews(updatedPreviews);
      }
    },
    [questionImages, questionImagePreviews]
  );

  const handleRemoveQuestion = (index: number) => {
    // Hapus juga file dan pratinjau yang terkait saat soal dihapus
    handleRemoveImage(index);
    // Hapus soal dari form
    remove(index);
  };

  const handleAddQuestion = () => {
    append({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      questionImage: null,
      correctAnswer: "A",
    });
    // Tambahkan slot kosong untuk file dan pratinjau
    setQuestionImages((prev) => [...prev, null]);
    setQuestionImagePreviews((prev) => [...prev, null]);
  };

  // Logika onSubmit tetap sama
  const onSubmit = async (data: FormType) => {
    setIsSubmitting(true);
    try {
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
    // Styling form utama diperbarui
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      {isSubmitting && <GradientCircularProgress />}
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
        // Styling container soal diperbarui
        <div key={field.id} className="mb-6 p-4 border rounded bg-gray-50 relative">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium">Soal {index + 1}</p>
            {fields.length > 1 && (
              <button type="button" onClick={() => handleRemoveQuestion(index)} className="text-red-500 hover:underline">
                <Delete />
              </button>
            )}
          </div>
          <div className="mb-2 py-5">
            <div className="flex flex-col gap-5">
              <input type="text" placeholder="Pertanyaan" {...register(`questions.${index}.questionText` as const)} className="w-full p-2 border rounded" />
              <div className="flex gap-5 items-center">
                {/* Logika untuk menampilkan pratinjau gambar atau placeholder */}
                {questionImagePreviews[index] ? (
                  <div className="flex flex-col items-center gap-2 ">
                    <p className="text-sm text-gray-600">Pratinjau Gambar:</p>
                    <div className="relative">
                      <Image src={questionImagePreviews[index] as string} alt={`Pratinjau Soal ${index + 1}`} width={150} height={100} className="max-w-[150px] max-h-[100px] object-contain border rounded" />
                      <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-600 text-sm flex items-center absolute -top-1 -right-3 hover:text-red-800">
                        <RemoveCircleOutline className="mr-1" fontSize="small" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm flex items-center">
                    <ImageIcon fontSize="small" className="mr-1" /> Belum ada gambar
                  </div>
                )}
                {/* Styling input file diperbarui */}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null, index)}
                  className="w-full border border-gray-300 rounded bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>
            </div>

            <p className="text-xs text-red-500 font-bold mt-5">*Pilih gambar jika diperlukan</p>
          </div>

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

      <button type="button" onClick={handleAddQuestion} className="text-blue-600 hover:underline mb-6">
        + Tambah Soal
      </button>

      <div className="flex justify-between">
        <button type="button" onClick={() => router.back()} className="w-fit py-2 px-5 text-blue-800 border border-blue-700 hover:bg-blue-700/20 rounded-md">
          <NavigateBefore />
          Kembali
        </button>
        <button type="submit" disabled={isSubmitting} className="w-fit py-2 px-5 text-green-800 border border-green-700 hover:bg-green-700/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
          {/* Teks tombol dinamis */}
          {isSubmitting ? "Menyimpan..." : "Simpan Ujian"}
        </button>
      </div>
    </form>
  );
}

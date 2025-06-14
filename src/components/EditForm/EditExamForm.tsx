"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Delete, NavigateBefore, Image as ImageIcon, RemoveCircleOutline } from "@mui/icons-material"; // Import RemoveCircleOutline
import toast from "react-hot-toast";
import { GradientCircularProgress } from "../GradientCircularProgress";
import { useState, useEffect, useCallback } from "react"; // Import useCallback
import axios from "axios";
import { useSession } from "next-auth/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useKelasDetailById } from "@/lib/hooks/useKelasDetail";

// --- Tipe Data (Sedikit Modifikasi) ---
// questionImage bisa berupa string (URL) atau null/undefined
type QuestionType = {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  questionImage?: string | null; // URL gambar yang sudah ada
  // Tambahkan id jika soal memiliki id sendiri di database
  id?: string;
};

type FormType = {
  id: string; // ID Ujian
  kelasId: string;
  title: string;
  description: string;
  graduate: number;
  questions: QuestionType[];
};

export default function EditExamForm({ examId }: { examId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentExamData, setCurrentExamData] = useState<FormType | null>(null);
  const [isExamLoading, setIsExamLoading] = useState(true);
  const [newQuestionFiles, setNewQuestionFiles] = useState<(File | null)[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const { data: session } = useSession();
  console.log({ session: session });
  const supabase = createClientComponentClient();
  const { kelas, isLoading: isLoadingKelas } = useKelasDetailById(currentExamData?.kelasId as string);
  const { register, handleSubmit, control, reset } = useForm<FormType>({
    defaultValues: {
      id: examId, // Pastikan ID ujian ada di defaultValues
      kelasId: "",
      title: "",
      description: "",
      graduate: 0,
      questions: [], // Awalnya kosong, akan diisi setelah data dimuat
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  // --- Effect untuk sinkronisasi sesi Supabase (sama seperti AddExamForm) ---
  useEffect(() => {
    const syncSupabaseSession = async () => {
      if (session?.id_token !== undefined) {
        console.log(session.id_token);
        // Menggunakan id_token
        try {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google", // Pastikan ini sesuai dengan provider NextAuth Anda
            token: session.id_token as string,
          });
          if (error) {
            toast.error(`Gagal sinkronisasi sesi Supabase: ${error.message}`);
          }
        } catch (err) {
          console.error("Error during Supabase session sync:", err);
        }
      }
    };
    syncSupabaseSession();
  }, [session?.id_token, supabase]); // Tambahkan supabase sebagai dependensi

  // --- Effect untuk memuat data ujian yang sudah ada ---
  useEffect(() => {
    const fetchExamData = async () => {
      setIsExamLoading(true);
      try {
        const response = await axios.get(`/api/${examId}/details/exam`);
        const examData = response.data;
        console.log(examData);
        reset(examData);
        setCurrentExamData(examData);

        setNewQuestionFiles(new Array(examData.questions.length).fill(null));
      } catch (err) {
        console.error("Gagal memuat data ujian:", err);
        toast.error("Gagal memuat data ujian.");
        router.push("/admin-dashboard");
      } finally {
        setIsExamLoading(false);
      }
    };

    if (examId) {
      fetchExamData();
    }
  }, [examId, reset, router]);

  // --- Fungsi untuk menangani perubahan file gambar ---
  const handleFileChange = useCallback(
    (file: File | null, index: number) => {
      const updatedFiles = [...newQuestionFiles];
      updatedFiles[index] = file;
      setNewQuestionFiles(updatedFiles);

      // Jika ada gambar lama dan file baru diunggah, tandai gambar lama untuk dihapus
      // Pastikan currentExamData tersedia dan soal memiliki questionImage lama
      if (file && currentExamData?.questions[index]?.questionImage) {
        setImagesToDelete((prev) => [...prev, currentExamData.questions[index].questionImage as string]);
      }
    },
    [newQuestionFiles, currentExamData]
  );

  // --- Fungsi untuk menghapus gambar yang sudah ada (tanpa upload baru) ---
  const handleRemoveExistingImage = useCallback(
    (index: number) => {
      // Dapatkan URL gambar yang akan dihapus
      const imageUrl = fields[index].questionImage;
      if (imageUrl) {
        setImagesToDelete((prev) => [...prev, imageUrl as string]);
      }

      // Perbarui nilai form agar questionImage menjadi null/undefined
      const currentQuestions = control._formValues.questions; // Akses langsung nilai form
      const updatedQuestions = [...currentQuestions];
      updatedQuestions[index] = { ...updatedQuestions[index], questionImage: null };
      reset({ ...control._formValues, questions: updatedQuestions }); // Reset form dengan nilai baru

      // Pastikan tidak ada file baru yang menunggu untuk diunggah untuk slot ini
      const updatedNewFiles = [...newQuestionFiles];
      updatedNewFiles[index] = null;
      setNewQuestionFiles(updatedNewFiles);
    },
    [fields, control, reset, newQuestionFiles]
  );

  // --- Fungsi onSubmit (Update) ---
  const onSubmit = async (data: FormType) => {
    setIsSubmitting(true);
    try {
      const {
        data: { session: supabaseSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      console.log("DEBUG onSubmit: Supabase session status:", supabaseSession ? "Authenticated" : "Not Authenticated", "Error:", sessionError);
      if (supabaseSession) {
        console.log("DEBUG onSubmit: Supabase access_token:", supabaseSession.access_token?.substring(0, 30) + "...");
        console.log("DEBUG onSubmit: Supabase user ID:", supabaseSession.user.id);
      }

      if (sessionError || !supabaseSession) {
        toast.error("Tidak terautentikasi dengan Supabase");
        setIsSubmitting(false);
        return;
      }

      if (sessionError || !supabaseSession) {
        toast.error("Tidak terautentikasi dengan Supabase");
        setIsSubmitting(false);
        return;
      }
      console.log("DEBUG: Supabase session found before upload. Token prefix:", supabaseSession.access_token?.substring(0, 10)); // <-- TAMBAHKAN INI
      console.log("DEBUG: Supabase user ID:", supabaseSession.user.id); // <-- TAMBAHKAN INI

      // --- Hapus Gambar yang Ditandai untuk Dihapus ---
      if (imagesToDelete.length > 0) {
        const pathsToDelete = imagesToDelete.map((url) => {
          // Asumsi URL gambar Supabase memiliki format:
          // https://<project-ref>.supabase.co/storage/v1/object/public/file/<path_di_supabase>
          const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/file/`;
          if (url.startsWith(baseUrl)) {
            return url.substring(baseUrl.length);
          }
          return url; // Jika format tidak cocok, kembalikan saja URL (bisa jadi error jika bukan URL Supabase)
        });

        // Hapus dari Supabase Storage
        const { error: deleteError } = await supabase.storage.from("file").remove(pathsToDelete);
        if (deleteError) {
          console.error("Gagal menghapus gambar:", deleteError);
          // Mungkin tidak perlu throw error di sini jika hanya ingin melanjutkan update data utama
          toast.error(`Gagal menghapus beberapa gambar lama: ${deleteError.message}`);
        } else {
          toast.success("Gambar lama berhasil dihapus.");
        }
        setImagesToDelete([]); // Reset array setelah penghapusan
      }

      // --- Upload Gambar Baru dan Perbarui Data Soal ---
      const updatedQuestions = await Promise.all(
        data.questions.map(async (q, idx) => {
          const file = newQuestionFiles[idx]; // Ambil file baru dari state
          let questionImage = q.questionImage; // Mulai dengan gambar yang sudah ada di form (bisa null jika dihapus)

          if (file && file.size > 0) {
            const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
            const filename = `${Date.now()}_${safeName}`;
            const path = `exam/image/${filename}`;
            console.log("DEBUG: Attempting upload for path:", path);

            const { error: uploadError } = await supabase.storage.from("file").upload(path, file);
            if (uploadError) {
              console.error("DEBUG: Supabase upload error (line 107):", uploadError); // <-- TAMBAHKAN INI
              throw new Error(`Gagal upload gambar baru: ${uploadError.message}`);
            }

            questionImage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/file/${path}`;
          }

          return { ...q, questionImage };
        })
      );

      // --- Kirim Data Ujian yang Diperbarui ke API Anda ---
      await axios.patch(`/api/${examId}/edit/exam`, {
        // Ganti ke metode PUT atau PATCH
        ...data,
        id: examId, // Pastikan ID ujian dikirim untuk update
        questions: updatedQuestions,
      });

      toast.success("Berhasil memperbarui ujian");
      router.push("/admin-dashboard");
    } catch (err) {
      console.error("DEBUG: onSubmit catch error:", err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gagal memperbarui ujian");
      } else {
        toast.error((err as Error).message || "Terjadi kesalahan saat memperbarui ujian.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Tampilkan loading state jika data ujian sedang dimuat ---
  if (isExamLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GradientCircularProgress />
        <p className="ml-4 text-lg">Memuat data ujian...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Ujian</h1>

      {isLoadingKelas ? <p className="mb-4 text-gray-500">Loading daftar kelas...</p> : <input type="text" value={kelas?.title} className="w-full p-2 mb-4 border rounded" readOnly />}

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
            <div className="flex flex-col gap-5">
              <input type="text" placeholder="Pertanyaan" {...register(`questions.${index}.questionText` as const)} className="w-full p-2 border rounded" />
              <div className="flex gap-5 items-center">
                {/* --- Tampilan Gambar yang Ada dan Opsi Hapus/Ganti --- */}
                {field.questionImage && typeof field.questionImage === "string" ? (
                  <div className="flex flex-col items-center gap-2 ">
                    <p className="text-sm text-gray-600">Gambar Terpasang:</p>
                    <div className="relative">
                      <img src={field.questionImage} alt={`Soal ${index + 1}`} className="max-w-[150px] max-h-[100px] object-contain border rounded" />
                      <button type="button" onClick={() => handleRemoveExistingImage(index)} className="text-red-600 text-sm flex items-center absolute -top-1 -right-3 hover:text-red-800">
                        <RemoveCircleOutline className="mr-1" fontSize="small" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">Atau pilih file baru untuk mengganti.</p>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm flex items-center">
                    <ImageIcon fontSize="small" className="mr-1" /> Belum ada gambar
                  </div>
                )}

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

          {["A", "B", "C", "D"].map((opt) => (
            <input key={opt} type="text" placeholder={`Pilihan ${opt}`} {...register(`questions.${index}[option${opt}]` as const)} className="w-full mb-2 p-2 border rounded" />
          ))}

          <select {...register(`questions.${index}.correctAnswer` as const)} className="w-full p-2 border rounded">
            <option value="A">Jawaban Benar: A</option>
            <option value="B">Jawaban Benar: B</option>
            <option value="C">Jawaban Value: C</option>
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
            questionImage: null, // Default untuk soal baru
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
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      {isSubmitting && <GradientCircularProgress />}
    </form>
  );
}

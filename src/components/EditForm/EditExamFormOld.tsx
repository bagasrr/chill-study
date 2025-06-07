"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Delete } from "@mui/icons-material";
import { Supabase } from "@/lib/supabaseClient";
import { useAllKelas } from "@/lib/hooks/useAllKelas";
import BackSubmitButton from "@/components/BackSubmitButton";
import { GradientCircularProgress } from "@/components/GradientCircularProgress";

type Question = {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  questionImage?: string;
};

type FormData = {
  id: string;
  kelasId: string;
  title: string;
  description: string;
  graduate: number;
  questions: Question[];
};

export default function EditExamFormOld() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { kelas } = useAllKelas();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionImages, setQuestionImages] = useState<Record<string, File | null>>({});
  const [deletedPaths, setDeletedPaths] = useState<string[]>([]);
  const supabase = Supabase();

  const { register, handleSubmit, control, reset, setValue, getValues } = useForm<FormData>({
    defaultValues: {
      id: "",
      kelasId: "",
      title: "",
      description: "",
      graduate: 0,
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "questions", keyName: "reactId" });

  useEffect(() => {
    if (id) fetchExamData();
  }, [id]);

  const fetchExamData = async () => {
    try {
      const res = await axios.get(`/api/${id}/details/exam`);
      reset(res.data);

      const fileMap: Record<string, File | null> = {};
      res.data.questions.forEach((_: any, idx: number) => {
        const fieldId = res.data.questions[idx].id || `tmp-${idx}`;
        fileMap[fieldId] = null;
      });
      setQuestionImages(fileMap);
    } catch (err) {
      toast.error("Gagal mengambil data");
    }
  };

  const handleFileChange = (file: File | null, fieldId: string, oldImageUrl?: string) => {
    setQuestionImages((prev) => ({ ...prev, [fieldId]: file }));
    if (oldImageUrl) {
      const path = oldImageUrl.replace(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/file/`, "");
      setDeletedPaths((prev) => [...prev, path]);
    }
  };

  const handleDeleteImage = (fieldId: string, imageUrl: string) => {
    const path = imageUrl.replace(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/file/`, "");
    setDeletedPaths((prev) => [...prev, path]);

    const updated = getValues("questions").map((q, i) => (fields[i].id === fieldId ? { ...q, questionImage: "" } : q));
    setValue("questions", updated);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const updatedQuestions = await Promise.all(
        data.questions.map(async (q, idx) => {
          const fieldId = fields[idx].id;
          const file = questionImages[fieldId];
          let questionImage = q.questionImage || "";

          if (file) {
            const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
            const filename = `${Date.now()}_${safeName}`;
            const path = `exam/image/${filename}`;

            const { error } = await supabase.storage.from("file").upload(path, file);
            if (error) throw new Error(`Upload gagal: ${error.message}`);

            questionImage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/file/${path}`;
          }

          return { ...q, questionImage };
        })
      );

      await axios.patch(`/api/${data.id}/edit/exam`, {
        ...data,
        questions: updatedQuestions,
      });

      if (deletedPaths.length > 0) {
        const { error } = await supabase.storage.from("file").remove(deletedPaths);
        if (error) console.warn("Gagal hapus gambar:", error.message);
      }

      toast.success("Berhasil menyimpan perubahan");
      router.push("/admin-dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Ujian</h1>

      <select {...register("kelasId")} className="w-full p-2 mb-4 border rounded">
        <option value="">Pilih Kelas</option>
        {kelas?.map((k) => (
          <option key={k.id} value={k.id}>
            {k.title}
          </option>
        ))}
      </select>

      <input type="text" {...register("title")} placeholder="Judul Ujian" className="w-full p-2 mb-4 border rounded" />
      <textarea {...register("description")} placeholder="Deskripsi" className="w-full p-2 mb-4 border rounded" />
      <input type="number" {...register("graduate")} placeholder="Jumlah soal benar untuk lulus" className="w-full p-2 mb-6 border rounded" />

      {fields.map((field, index) => (
        <div key={field.reactId} className="mb-6 p-4 border rounded bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Soal {index + 1}</p>
            <button type="button" onClick={() => remove(index)} className="text-red-500">
              <Delete />
            </button>
          </div>

          <input type="text" {...register(`questions.${index}.questionText`)} placeholder="Pertanyaan" className="w-full mb-2 p-2 border rounded" />

          <div className="flex gap-5 items-center my-6">
            {field.questionImage && (
              <div className="relative  mb-2">
                <img src={field.questionImage} className="max-h-[100px] border rounded" />
                <button type="button" className="absolute -right-2 -top-3  text-red-600 hover:text-red-800" onClick={() => handleDeleteImage(field.id, field.questionImage!)}>
                  <Delete />
                </button>
              </div>
            )}

            <input type="file" onChange={(e) => handleFileChange(e.target.files?.[0] || null, field.id, field.questionImage)} className="w-full p-2 mb-2 border rounded" accept="image/png, image/jpeg" />
          </div>

          {["A", "B", "C", "D"].map((opt) => (
            <input key={opt} type="text" {...register(`questions.${index}[option${opt}]`)} placeholder={`Pilihan ${opt}`} className="w-full mb-2 p-2 border rounded" />
          ))}

          <select {...register(`questions.${index}.correctAnswer`)} className="w-full p-2 border rounded">
            {["A", "B", "C", "D"].map((val) => (
              <option key={val} value={val}>{`Jawaban Benar: ${val}`}</option>
            ))}
          </select>
        </div>
      ))}

      <button
        type="button"
        className="text-blue-600 mb-6"
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
      >
        + Tambah Soal
      </button>

      <BackSubmitButton submit={isSubmitting ? "Menyimpan..." : "Simpan Perubahan"} disable={isSubmitting} />
      {isSubmitting && <GradientCircularProgress />}
    </form>
  );
}

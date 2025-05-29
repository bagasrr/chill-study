"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAllKelas } from "@/lib/hooks/useAllKelas";
import toast from "react-hot-toast";
import { Delete } from "@mui/icons-material";

export default function EditExamForm() {
  const router = useRouter();
  const { kelas, isLoading } = useAllKelas();

  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    id: "",
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
  });

  useEffect(() => {
    getInitialData();
  }, [id]);
  console.log("ID : ", id);
  const getInitialData = async () => {
    try {
      const res = await axios.get(`/api/${id}/details/exam`);
      setForm(res.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to fetch data");
    }
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "A",
        },
      ],
    }));
  };

  const handleDeleteQuestion = (index: number) => {
    setForm((prev) => {
      const updated = [...prev.questions];
      updated.splice(index, 1); // hapus dari array
      return { ...prev, questions: updated };
    });
  };

  const handleChange = (e: any, index?: number, field?: string) => {
    const { name, value } = e.target;
    if (typeof index === "number" && field) {
      const updated = [...form.questions];
      updated[index][field] = value;
      setForm({ ...form, questions: updated });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.patch(`/api/${form.id}/edit/exam/`, form);
      alert("Berhasil mengedit exam");
      router.push("/admin-dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menyimpan perubahan");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Ujian</h1>

      {isLoading ? (
        <p className="mb-4 text-gray-500">Loading daftar kelas...</p>
      ) : (
        <select name="kelasId" value={form.kelasId} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
          <option value="">Pilih Kelas</option>
          {kelas?.map((k: any) => (
            <option key={k.id} value={k.id}>
              {k.title}
            </option>
          ))}
        </select>
      )}

      <input type="text" name="title" placeholder="Judul Ujian" value={form.title} onChange={handleChange} className="w-full p-2 mb-4 border rounded" />

      <textarea name="description" placeholder="Deskripsi" value={form.description} onChange={handleChange} className="w-full p-2 mb-4 border rounded" />
      <input type="number" name="graduate" placeholder="Jumlah soal benar untuk lulus" value={form.graduate} onChange={handleChange} className="w-full p-2 mb-6 border rounded" />

      <h2 className="text-lg font-semibold mb-2">Soal-soal</h2>
      {form.questions.map((q, index) => (
        <div key={index} className="mb-6 p-4 border rounded bg-gray-50 relative">
          {/* Tombol hapus */}
          <div className="flex items-center justify-between py-5">
            <p>{index + 1}</p>
            <button type="button" onClick={() => handleDeleteQuestion(index)} className="rigt-0 text-red-500 hover:underline">
              <Delete />
            </button>
          </div>

          <input type="text" placeholder="Pertanyaan" value={q.questionText} onChange={(e) => handleChange(e, index, "questionText")} className="w-full mb-2 p-2 border rounded" />
          {["A", "B", "C", "D"].map((opt) => (
            <input key={opt} type="text" placeholder={`Pilihan ${opt}`} value={q[`option${opt}` as keyof typeof q]} onChange={(e) => handleChange(e, index, `option${opt}`)} className="w-full mb-2 p-2 border rounded" />
          ))}
          <select value={q.correctAnswer} onChange={(e) => handleChange(e, index, "correctAnswer")} className="w-full p-2 border rounded">
            <option value="A">Jawaban Benar: A</option>
            <option value="B">Jawaban Benar: B</option>
            <option value="C">Jawaban Benar: C</option>
            <option value="D">Jawaban Benar: D</option>
          </select>
        </div>
      ))}

      <button onClick={addQuestion} className="text-blue-600 hover:underline mb-6">
        + Tambah Soal
      </button>

      <button onClick={handleSubmit} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Simpan Perubahan
      </button>
    </div>
  );
}

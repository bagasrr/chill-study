"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAllKelas } from "@/lib/hooks/useAllKelas";

export default function AddExamForm() {
  const router = useRouter();
  const { kelas, isLoading } = useAllKelas();

  const [form, setForm] = useState({
    kelasId: "",
    title: "",
    description: "",
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
      const res = await axios.post("/api/admin/exam/create", form);
      alert("Berhasil menambahkan exam");
      router.push("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal submit");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Tambah Ujian</h1>

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

      <textarea name="description" placeholder="Deskripsi" value={form.description} onChange={handleChange} className="w-full p-2 mb-6 border rounded" />
      <input type="number" name="graduate" placeholder="Jumlah soal benar untuk lulus" value={form.graduate} onChange={handleChange} className="w-full p-2 mb-4 border rounded" />

      <h2 className="text-lg font-semibold mb-2">Soal-soal</h2>
      {form.questions.map((q, index) => (
        <div key={index} className="mb-6 p-4 border rounded bg-gray-50">
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

      <button onClick={handleSubmit} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Simpan Ujian
      </button>
    </div>
  );
}

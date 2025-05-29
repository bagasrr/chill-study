// ExamPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

type Question = {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
};

type Exam = {
  title: string;
  description?: string;
  graduate: number;
  questions: Question[];
};

export default function ExamPage() {
  const { kelasId } = useParams();
  const { data: session } = useSession();

  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lulus, setLulus] = useState<boolean>(false);

  useEffect(() => {
    if (!kelasId) return;

    const fetchExam = async () => {
      try {
        const progressRes = await axios.get(`/api/materi/${kelasId}/progress`);
        const progress = progressRes.data;
        if (progress.progressPercent < 100) {
          setError("Anda belum menyelesaikan semua materi.");
          return;
        }

        const examRes = await axios.get(`/api/kelas/${kelasId}/exam`);
        setExam(examRes.data);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [kelasId]);

  const handleChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    try {
      const payload = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const res = await axios.post(`/api/kelas/${kelasId}/exam/submit`, {
        answers: payload,
      });

      const { score: skor, passed } = res.data;
      setScore(skor);
      setLulus(passed);

      if (passed) {
        await axios.post("/api/certificate", { kelasId });
      }
    } catch (err: any) {
      toast.error(err?.response?.data || err.message);
    }
  };

  if (loading) return <p className="text-center py-4">Loading soal...</p>;
  if (error)
    return (
      <div className="text-center text-red-600 py-4">
        ⚠️ {error}
        <br />
        <a href={`/dashboard/kelas/${kelasId}/materi`} className="text-blue-600 underline">
          Kembali ke Materi
        </a>
      </div>
    );

  if (score !== null)
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-12 text-center border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Hasil Ujian</h1>

        <p className="text-lg text-gray-700 mb-2">
          Skor Anda: <span className="font-bold text-blue-600 text-xl">{score}</span>
        </p>

        <p className={`text-md mt-2 font-medium ${lulus ? "text-green-600" : "text-red-600"}`}>{lulus ? "✅ Selamat! Anda lulus dan sertifikat telah diterbitkan." : "❌ Maaf, Anda belum lulus. Coba lagi nanti."}</p>

        {lulus && (
          <Link href={`/dashboard/certificate/${kelasId}`} className="inline-block mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 transition duration-200">
            🎓 Lihat Sertifikat
          </Link>
        )}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-10 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">{exam?.title}</h1>
      <p className="text-center mb-6 text-gray-600">{exam?.description}</p>

      {exam?.questions.map((q, index) => (
        <div key={q.id} className="mb-6">
          <p className="font-semibold mb-2">
            {index + 1}. {q.questionText}
          </p>
          <div className="ml-4 space-y-1">
            {(["A", "B", "C", "D"] as const).map((opt) => {
              const label = q[`option${opt}` as keyof Question];
              return (
                <label key={opt} className="block">
                  <input type="radio" name={`question-${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => handleChange(q.id, opt)} className="mr-2" />
                  {opt}. {label}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <button onClick={handleSubmit} className="w-full mt-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit Jawaban
      </button>
    </div>
  );
}

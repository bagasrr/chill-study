"use client";

import { useState } from "react";
import { GradientCircularProgress } from "../GradientCircularProgress";
import toast from "react-hot-toast";

export default function AddOfficialForm() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !name || !position) {
      toast.error("Isi semua field dan pilih file terlebih dahulu!");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("position", position);
      form.append("file", file);

      const res = await fetch("/api/official", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        toast.success("TTD Pejabat berhasil diupload!");
        setName("");
        setPosition("");
        setFile(null);
      } else {
        toast.error("Gagal menyimpan ke database");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat upload");
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="bg-slate-100 min-h-screen pt-20">
      <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-md relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Official</h2>

        <div className="space-y-4">
          <input type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Jabatan" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full p-2 border border-gray-300 rounded bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        <button onClick={handleUpload} disabled={loading} className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Mengupload..." : "Submit"}
        </button>

        {loading && <GradientCircularProgress />}
      </div>
    </div>
  );
}

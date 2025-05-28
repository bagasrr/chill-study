"use client";

import { useState } from "react";

export default function AdminUploadTTD() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !name || !position) return alert("Isi semua field!");

    setLoading(true);

    const form = new FormData();
    form.append("name", name);
    form.append("position", position);
    form.append("file", file);

    const res = await fetch("/api/official", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      alert("Official berhasil ditambahkan!");
      setName("");
      setPosition("");
      setFile(null);
    } else {
      alert("Gagal simpan ke database");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md p-4">
      <h2 className="text-lg font-semibold mb-4">Upload TTD Pejabat</h2>

      <input type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-2 p-2 border" />
      <input type="text" placeholder="Jabatan" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full mb-2 p-2 border" />
      <input type="file" accept="image/png, image/jpeg" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full mb-4" />
      <button onClick={handleUpload} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Uploading..." : "Submit"}
      </button>
    </div>
  );
}

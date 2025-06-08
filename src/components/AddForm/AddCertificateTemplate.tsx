"use client";

import { useState } from "react";
import { GradientCircularProgress } from "../GradientCircularProgress";
import toast from "react-hot-toast";
import axios from "axios";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AddOfficialNewForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleUpload = async () => {
    console.log({ name }, { file });

    setLoading(true);

    try {
      if (file && file.size > 0) {
        const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
        const filename = `${Date.now()}_${safeName}`;
        const path = `certificate/template/${filename}`;

        const { error } = await supabase.storage.from("file").upload(path, file);
        if (error) throw new Error(`Gagal upload gambar: ${error.message}`);

        const certifTemplate = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/file/${path}`;
        await axios.post("/api/certificate/template", {
          name,
          certifTemplate,
        });
      }

      toast.success("Berhasil menambahkan Certificate Template");
      router.push("/admin-dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gagal submit");
      }
      toast.error("Terjadi kesalahan saat upload");
    }

    setLoading(false);
  };

  return (
    <div className="bg-slate-100 min-h-screen pt-20">
      <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-md relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Certificate Template</h2>

        <div className="space-y-4">
          <input type="text" placeholder="Nama Template Certificate" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

          {/* Pilih file */}
          <label className="block font-medium">Certificate Image</label>
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

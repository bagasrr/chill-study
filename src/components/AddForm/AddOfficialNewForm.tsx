"use client";

import { useRef, useState } from "react";
import { GradientCircularProgress } from "../GradientCircularProgress";
import toast from "react-hot-toast";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { useRouter } from "next/navigation";

// declare module "react-signature-canvas";

export default function AddOfficialNewForm() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // old
  // const sigCanvasRef = useRef<SignatureCanvas>(null);
  const sigCanvasRef = useRef<InstanceType<typeof SignatureCanvas>>(null);

  const handleUpload = async () => {
    const signatureDrawn = sigCanvasRef.current && !sigCanvasRef.current.isEmpty();
    if (!name || !position || (!file && !signatureDrawn)) {
      toast.error("Isi semua field dan pilih file atau gambar tanda tangan!");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("position", position);

      if (file) {
        form.append("file", file);
      } else if (signatureDrawn) {
        try {
          const canvas = sigCanvasRef.current?.getTrimmedCanvas?.();
          if (!canvas) {
            throw new Error("Canvas not ready");
          }
          const dataUrl = canvas.toDataURL("image/png");

          const blob = await (await fetch(dataUrl)).blob();
          form.append("file", blob, "signature.png");
        } catch (err) {
          toast.error("Gagal mengambil tanda tangan dari gambar.");
          console.log(err);
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/official", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        toast.success("TTD Pejabat berhasil diupload!");
        router.push("/admin-dashboard#official");
        // setName("");
        // setPosition("");
        // setFile(null);
        // sigCanvasRef.current?.clear();
      } else {
        toast.error("Gagal menyimpan ke database");
      }
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
        <h2 className="text-2xl font-bold mb-6 text-center">Add Official</h2>

        <div className="space-y-4">
          <input type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Jabatan" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

          {/* Pilih file */}
          <label className="block font-medium">Upload TTD (Opsional jika menggambar)</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full p-2 border border-gray-300 rounded bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />

          {/* Gambar TTD */}
          <div>
            <p className="font-medium mt-4 mb-2">Atau Gambar Tanda Tangan:</p>
            <div className="border border-gray-300 bg-gray-50 rounded-md overflow-hidden">
              <SignatureCanvas ref={sigCanvasRef} penColor="black" canvasProps={{ width: 500, height: 200, className: "bg-white" }} />
            </div>
            <button type="button" onClick={() => sigCanvasRef.current?.clear()} className="text-sm text-red-500 mt-2 underline">
              Hapus Gambar
            </button>
          </div>
        </div>

        <button onClick={handleUpload} disabled={loading} className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Mengupload..." : "Submit"}
        </button>

        {loading && <GradientCircularProgress />}
      </div>
    </div>
  );
}

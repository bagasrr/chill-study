import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { FormTextField } from "../FormTextField";

// Interface buat form state
interface KelasForm {
  title: string;
  deskripsi: string;
  thumbnail: string;
}

interface MateriForm {
  title: string;
  content: string;
  videoUrl: string;
  price: string;
}

// Komponen reusable TextField yang udah stylingnya fix

export default function AddKelasForm() {
  const [kelas, setKelas] = useState<KelasForm>({ title: "", deskripsi: "", thumbnail: "" });
  const [materi, setMateri] = useState<MateriForm>({ title: "", content: "", videoUrl: "", price: "" });

  const handleChange = (setter: Function) => (e: ChangeEvent<HTMLInputElement>) => {
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Kelas:", kelas);
    console.log("Materi:", materi);
    // TODO: Kirim ke API / Backend
  };

  return (
    <div className="w-screen mx-auto py-12 px-6 bg-slate-200">
      <div className="p-8 rounded-2xl shadow-lg bg-white">
        <Typography variant="h4" className="font-roboto font-semibold mb-5">
          Tambah Kelas Baru
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4">Informasi Kelas</h2>
            </div>
            <FormTextField label="Judul Kelas" name="title" value={kelas.title} onChange={handleChange(setKelas)} required />
            <FormTextField label="Thumbnail URL" name="thumbnail" value={kelas.thumbnail} onChange={handleChange(setKelas)} />
            <div className="col-span-2">
              <FormTextField label="Deskripsi Kelas" name="deskripsi" value={kelas.deskripsi} onChange={handleChange(setKelas)} multiline rows={4} />
            </div>

            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-emerald-400 mb-4">Informasi Materi Awal</h2>
            </div>
            <FormTextField label="Judul Materi" name="title" value={materi.title} onChange={handleChange(setMateri)} required />
            <FormTextField label="Video URL" name="videoUrl" value={materi.videoUrl} onChange={handleChange(setMateri)} />
            <div className="col-span-2">
              <FormTextField label="Konten Materi" name="content" value={materi.content} onChange={handleChange(setMateri)} multiline rows={4} />
            </div>
            <FormTextField label="Harga Materi (Rp)" name="price" value={materi.price} onChange={handleChange(setMateri)} type="number" required />
          </div>

          <div className="mt-8">
            <Button type="submit" variant="outlined" color="info" size="large" fullWidth sx={{ fontWeight: "bold", borderRadius: 6 }}>
              Simpan Kelas & Materi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

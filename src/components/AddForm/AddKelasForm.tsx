"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button, CircularProgress, Box } from "@mui/material";
import { FormTextField } from "../FormTextField";
import axios from "@/lib/axios";
import { useFormSubmit } from "@/lib/hooks/useSubmitform";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Interface buat form state
interface KelasForm {
  title: string;
  deskripsi: string;
  thumbnail: string;
}

export default function AddKelasForm() {
  const [kelas, setKelas] = useState<KelasForm>({
    title: "",
    deskripsi: "",
    thumbnail: "",
  });

  const { isLoading, submitWrapper } = useFormSubmit();
  const router = useRouter();

  const handleChange = (setter: Function) => (e: ChangeEvent<HTMLInputElement>) => {
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    submitWrapper(async () => {
      try {
        await axios.post("/api/kelas", kelas);
        router.push("/admin-dashboard#kelas");
        toast.success("Kelas berhasil ditambahkan 🎉");
      } catch (error) {
        toast.error("Gagal menambahkan kelas 😢");
        console.error(error);
      }
    });
  };

  return (
    <div className="w-screen mx-auto py-12 px-6 bg-slate-200">
      <div className="p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-3xl font-roboto font-bold mb-5 text-center">Tambah Kelas Baru</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">Informasi Kelas</h2>
            </div>

            <FormTextField label="Judul Kelas" name="title" value={kelas.title} onChange={handleChange(setKelas)} required />
            <FormTextField label="Thumbnail URL" name="thumbnail" value={kelas.thumbnail} onChange={handleChange(setKelas)} />
            <div className="col-span-2">
              <FormTextField label="Deskripsi Kelas" name="deskripsi" value={kelas.deskripsi} onChange={handleChange(setKelas)} multiline rows={4} />
            </div>
          </div>

          <div className="mt-8 relative">
            <Button type="submit" variant="outlined" color="info" size="large" fullWidth disabled={isLoading} sx={{ fontWeight: "bold", borderRadius: 6, position: "relative" }}>
              {isLoading ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <CircularProgress size={24} color="inherit" />
                </Box>
              ) : (
                "Tambahkan Kelas"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

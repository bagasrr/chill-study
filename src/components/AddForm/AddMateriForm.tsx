"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";
import { CurrencyTextField, FormTextField } from "../FormTextField";
import axios from "@/lib/axios";
import { useFormSubmit } from "@/lib/hooks/useSubmitform";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface MateriForm {
  title: string;
  content: string;
  videoUrl: string;
  price: number;
  kelasId: string;
}

export default function AddMateriForm() {
  const [materi, setMateri] = useState<MateriForm>({
    title: "",
    content: "",
    videoUrl: "",
    price: 0,
    kelasId: "",
  });
  const [kelas, setKelas] = useState<{ id: string; title: string }[]>([]);

  const { isLoading, submitWrapper } = useFormSubmit();
  const router = useRouter();

  useEffect(() => {
    getKelas();
  }, []);

  const getKelas = async () => {
    try {
      const res = await axios.get("/api/kelas");
      setKelas(res.data);
      console.log({ res });
    } catch (error) {
      console.error("Gagal mengambil data kelas", error);
    }
  };

  const handleChange = (setter: Function) => (e: ChangeEvent<HTMLInputElement>) => {
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(materi);
    submitWrapper(async () => {
      try {
        await axios.post("/api/materi", materi);
        toast.success("Materi berhasil ditambahkan 🎉");
        setTimeout(() => {
          router.push("/admin-dashboard#materi");
        }, 1500); // delay sedikit biar toast kebaca
      } catch (error) {
        toast.error("Gagal menambahkan materi 😢");
        console.error(error);
      }
    });
  };

  return (
    <div className="w-screen mx-auto py-12 px-6 bg-slate-200">
      <div className="p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-3xl font-roboto font-bold mb-5 text-center">Tambah Materi Baru</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">Informasi Materi</h2>
            </div>

            <FormTextField label="Judul Materi" name="title" value={materi.title} onChange={handleChange(setMateri)} required />
            <FormTextField label="Link Video" name="videoUrl" value={materi.videoUrl} onChange={handleChange(setMateri)} required />

            <div className="col-span-2">
              <FormControl
                fullWidth
                color="info"
                variant="filled"
                className="bg-slate-100 rounded-md"
                sx={{
                  "& .MuiInputBase-input": {
                    color: "#0f172a",
                  },
                }}
              >
                <InputLabel id="kelasId-label" variant="outlined">
                  Pilih Kelas
                </InputLabel>
                <Select
                  labelId="kelasId-label"
                  id="kelasId"
                  value={materi.kelasId}
                  onChange={(e) =>
                    setMateri((prev) => ({
                      ...prev,
                      kelasId: e.target.value,
                    }))
                  }
                  input={<OutlinedInput label="Pilih Kelas" />}
                >
                  {kelas.length === 0 ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    kelas.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.title}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </div>

            <div className="col-span-2">
              <FormTextField label="Deskripsi Materi" name="content" value={materi.content} onChange={handleChange(setMateri)} multiline rows={4} />
            </div>

            <div className="flex items-center gap-2">
              <p className="font-bold">Rp</p>
              <CurrencyTextField
                label="Harga Materi"
                name="price"
                value={materi.price}
                onChange={(name, value) => {
                  setMateri((prev) => ({ ...prev, [name]: value }));
                }}
                required
              />
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
                "Tambahkan Materi"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";
import { CurrencyTextField, FormTextField } from "@/components/FormTextField";
import axios from "@/lib/axios";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

interface MateriForm {
  title: string;
  content: string;
  videoUrl: string;
  price: number;
  kelasId: string;
}

export default function EditMateriForm() {
  const [kelas, setKelas] = useState<{ id: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  // Default form state
  const { register, handleSubmit, control, setValue, reset } = useForm<MateriForm>({
    defaultValues: {
      title: "",
      content: "",
      videoUrl: "",
      price: 0,
      kelasId: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [kelasRes, materiRes] = await Promise.all([axios.get("/api/kelas"), axios.get(`/api/${id}/details/materi`)]);

        const kelasData = kelasRes.data;
        const materiData = materiRes.data;

        console.log("kelasData", kelasData);
        console.log("materiData", materiData);

        setKelas(kelasData);

        reset({
          title: materiData.title,
          content: materiData.content,
          videoUrl: materiData.videoUrl,
          price: materiData.price,
          kelasId: String(materiData.kelas?.id || ""),
        });
      } catch (error) {
        toast.error("Gagal mengambil data");
        console.error(error);
      }
    };

    loadData();
  }, []);

  // 🔥 Update Materi
  const onSubmit = async (data: MateriForm) => {
    setIsLoading(true);
    console.log(data);
    try {
      await axios.patch(`/api/${id}/edit/materi`, data);
      toast.success("Materi berhasil diperbarui 🎉");
      setTimeout(() => {
        router.push("/admin-dashboard#materi");
      }, 1500);
    } catch (error) {
      toast.error("Gagal memperbarui materi 😢");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen mx-auto py-12 px-6 bg-slate-200">
      <div className="p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-3xl font-roboto font-bold mb-5 text-center">Edit Materi</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">Informasi Materi</h2>
            </div>

            {/* Judul */}
            <Controller control={control} name="title" render={({ field }) => <FormTextField label="Judul Materi" name={field.name} value={field.value ?? ""} onChange={field.onChange} required />} />

            {/* Video */}
            <Controller control={control} name="videoUrl" render={({ field }) => <FormTextField label="Link Video" name={field.name} value={field.value ?? ""} onChange={field.onChange} required />} />

            {/* Kelas */}
            <div className="col-span-2">
              <FormControl fullWidth color="info" variant="filled">
                <InputLabel id="kelasId-label">Pilih Kelas</InputLabel>
                <Controller
                  control={control}
                  name="kelasId"
                  render={({ field }) => (
                    <Select {...field} input={<OutlinedInput label="Pilih Kelas" />} value={field.value ?? ""} sx={{ color: "black" }}>
                      {kelas.length === 0 ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        kelas.map((item) => (
                          <MenuItem key={item.id} value={String(item.id)}>
                            {item.title}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </div>

            {/* Deskripsi */}
            <Controller control={control} name="content" render={({ field }) => <FormTextField label="Deskripsi Materi" name={field.name} value={field.value ?? ""} onChange={field.onChange} multiline rows={4} />} />

            {/* Harga */}
            <Controller control={control} name="price" render={({ field }) => <CurrencyTextField label="Harga Materi" name={field.name} value={field.value ?? 0} onChange={(name, value) => setValue(name, value)} required />} />
          </div>

          {/* Tombol Submit */}
          <div className="mt-8 relative w-1/3">
            <Button type="submit" variant="outlined" color="info" size="large" fullWidth disabled={isLoading} sx={{ fontWeight: "bold", borderRadius: 6 }}>
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
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

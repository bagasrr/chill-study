"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, OutlinedInput, List, ListItem, ListItemText, IconButton, LinearProgress } from "@mui/material";
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { CurrencyTextField, FormTextField } from "../FormTextField";
import axios from "@/lib/axios";
import { useFormSubmit } from "@/lib/hooks/useSubmitform";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface MateriForm {
  title: string;
  content: string;
  videoUrl: string;
  price: number;
  kelasId: string;
  attachments: { name: string }[];
}

export default function AddMateriForm() {
  const supabase = createClientComponentClient();

  const [materi, setMateri] = useState<MateriForm>({
    title: "",
    content: "",
    videoUrl: "",
    price: 0,
    kelasId: "",
    attachments: [],
  });
  const [kelas, setKelas] = useState<{ id: string; title: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { isLoading, submitWrapper } = useFormSubmit();
  const router = useRouter();

  useEffect(() => {
    getKelas();
  }, []);

  const getKelas = async () => {
    try {
      const res = await axios.get("/api/kelas");
      setKelas(res.data);
    } catch (error) {
      console.error("Gagal mengambil data kelas", error);
    }
  };

  //old
  // const handleChange = (setter) => (e: ChangeEvent<HTMLInputElement>) => {
  //   setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<MateriForm>>) => (e: ChangeEvent<HTMLInputElement>) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    submitWrapper(async () => {
      let uploadedAttachments: { name: string; link: string }[] = [];

      // --- AWAL PERUBAHAN UTAMA ---
      if (selectedFiles.length > 0) {
        setIsUploading(true);

        // Ubah map menjadi async untuk bisa menggunakan await di dalamnya
        const uploadPromises = selectedFiles.map(async (file) => {
          const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
          const filename = `${Date.now()}_${safeName}`;
          const path = `certificate/template/${filename}`;

          // Lakukan upload
          const { data, error } = await supabase.storage.from("file").upload(path, file);

          // Jika ada error pada upload file ini, lemparkan error agar Promise.all gagal
          if (error) {
            throw new Error(`Gagal mengupload file ${file.name}: ${error.message}`);
          }

          // Kembalikan objek dengan format yang diinginkan
          return {
            name: file.name, // <-- Menggunakan nama file asli
            link: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/file/${data.path}`,
          };
        });

        try {
          // Promise.all sekarang akan menghasilkan array dari objek {name, link}
          uploadedAttachments = await Promise.all(uploadPromises);
        } catch (error: any) {
          toast.error(error.message || "Terjadi kesalahan saat mengupload file.");
          setIsUploading(false);
          return; // Hentikan eksekusi jika ada file yang gagal di-upload
        } finally {
          setIsUploading(false);
        }
      }

      // Kirim data ke API Anda
      try {
        const payload = { ...materi, attachments: uploadedAttachments };
        console.log(payload);
        await axios.post("/api/materi", payload);
        toast.success("Materi berhasil ditambahkan 🎉");
        router.push("/admin-dashboard#materi");
      } catch (error) {
        toast.error("Gagal menambahkan data materi 😢");
        console.error(error);
      }
    });
  };

  const totalLoading = isLoading || isUploading;

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
              <FormControl fullWidth color="info">
                <InputLabel id="kelasId-label">Pilih Kelas</InputLabel>
                <Select
                  labelId="kelasId-label"
                  id="kelasId"
                  value={materi.kelasId}
                  onChange={(e) => setMateri((prev) => ({ ...prev, kelasId: e.target.value }))}
                  input={<OutlinedInput label="Pilih Kelas" />}
                  sx={{ color: "black" }}
                  className="bg-slate-100"
                >
                  {kelas.length === 0 ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    kelas.map((item) => (
                      <MenuItem key={item.id} value={item.id} className="text-black">
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
              <CurrencyTextField label="Harga Materi" name="price" value={materi.price} onChange={(name, value) => setMateri((prev) => ({ ...prev, [name]: value }))} required />
            </div>

            <div className="col-span-2 mt-4 p-4 border rounded-lg">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">Lampiran (Attachments)</h2>
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} disabled={totalLoading}>
                Pilih File
                <input type="file" hidden multiple onChange={handleFileChange} />
              </Button>
              {isUploading && <LinearProgress color="info" sx={{ mt: 2 }} />}
              <List>
                {selectedFiles.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(index)} disabled={totalLoading}>
                        <DeleteIcon className="text-red-500" />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                  </ListItem>
                ))}
              </List>
            </div>
          </div>

          <div className="mt-8 relative">
            <Button type="submit" variant="outlined" color="info" size="large" fullWidth disabled={totalLoading} sx={{ fontWeight: "bold", borderRadius: 6, position: "relative" }}>
              {totalLoading ? <CircularProgress size={24} color="inherit" /> : "Tambahkan Materi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

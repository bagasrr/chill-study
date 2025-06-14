"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, List, ListItem, ListItemText, IconButton, LinearProgress, TextField, Typography } from "@mui/material";
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, Link as LinkIcon } from "@mui/icons-material";
import { CurrencyTextField } from "@/components/FormTextField";
import axios from "@/lib/axios";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import BackSubmitButton from "@/components/BackSubmitButton";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Interface untuk data lampiran yang sudah ada
interface ExistingAttachment {
  id: string;
  name: string; // Dianggap sebagai path dari DB
  link: string; // Link untuk akses
}

// Interface untuk payload lampiran baru yang akan dikirim
interface NewAttachmentPayload {
  name: string; // Nama file asli
  link: string; // Link publik setelah diupload
}

interface MateriForm {
  title: string;
  content: string;
  videoUrl: string;
  price: number;
  kelasId: string;
}

const inputStyle = {
  "& .MuiInputBase-input": { color: "#000" },
  "& .MuiOutlinedInput-root": { backgroundColor: "#f0f7ff" },
};

export default function EditMateriForm() {
  const supabase = createClientComponentClient();
  const [kelas, setKelas] = useState<{ id: string; title: string }[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [existingAttachments, setExistingAttachments] = useState<ExistingAttachment[]>([]);
  const [newlyAddedFiles, setNewlyAddedFiles] = useState<File[]>([]);
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm<MateriForm>({
    defaultValues: { title: "", content: "", videoUrl: "", price: 0, kelasId: "" },
  });

  useEffect(() => {
    const loadData = async () => {
      setIsDataLoading(true);
      try {
        const [kelasRes, materiRes] = await Promise.all([axios.get("/api/kelas"), axios.get(`/api/${id}/details/materi`)]);
        const materiData = materiRes.data;
        setKelas(kelasRes.data);
        reset({ ...materiData, kelasId: String(materiData.kelas?.id || materiData.kelasId || "") });
        setExistingAttachments(materiData.attachments || []);
      } catch (error) {
        toast.error("Gagal mengambil data materi");
        console.error(error);
      } finally {
        setIsDataLoading(false);
      }
    };
    loadData();
  }, [id, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setNewlyAddedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleRemoveNewFile = (index: number) => {
    setNewlyAddedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = (attachmentId: string) => {
    setRemovedAttachmentIds((prev) => [...prev, attachmentId]);
    setExistingAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  // Fungsi getPublicUrl sekarang mengambil path sebagai argumen
  const getPublicUrl = (path: string) => {
    return supabase.storage.from("file").getPublicUrl(path).data.publicUrl;
  };

  // --- FUNGSI ON SUBMIT DIMODIFIKASI ---
  const onSubmit = async (data: MateriForm) => {
    setIsLoading(true);
    let uploadedNewAttachments: NewAttachmentPayload[] = [];

    if (newlyAddedFiles.length > 0) {
      setIsUploading(true);

      // Mengubah map menjadi async untuk menggunakan await di dalamnya
      const uploadPromises = newlyAddedFiles.map(async (file) => {
        // Membersihkan nama file untuk keamanan dan upload yang lebih andal
        const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
        const filePath = `attachments/materi/${Date.now()}_${safeName}`;

        const { data: uploadData, error } = await supabase.storage.from("file").upload(filePath, file);

        if (error) {
          throw new Error(`Gagal mengupload ${file.name}: ${error.message}`);
        }

        // Mengembalikan objek dengan format yang diinginkan: nama asli dan link publik
        return {
          name: file.name, // Menggunakan nama file asli
          link: getPublicUrl(uploadData.path), // Mendapatkan link publiknya
        };
      });

      try {
        // Promise.all akan menghasilkan array dari objek { name, link }
        uploadedNewAttachments = await Promise.all(uploadPromises);
      } catch (error: any) {
        toast.error(error.message || "Terjadi kesalahan saat mengupload file baru.");
        setIsLoading(false);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const payload = {
      ...data,
      newAttachments: uploadedNewAttachments,
      removedAttachmentIds,
    };

    try {
      await axios.patch(`/api/${id}/edit/materi`, payload);
      toast.success("Materi berhasil diperbarui 🎉");
      router.push("/admin-dashboard#materi");
    } catch (error) {
      toast.error("Gagal memperbarui materi 😢");
      console.error("Payload yang gagal:", payload);
    } finally {
      setIsLoading(false);
    }
  };

  const totalLoading = isLoading || isUploading || isDataLoading;

  if (isDataLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="w-screen mx-auto py-12 px-6 bg-slate-200">
      <div className="p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-3xl font-roboto font-bold mb-5 text-center">Edit Materi</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller name="title" control={control} render={({ field }) => <TextField {...field} label="Judul Materi" fullWidth required color="info" sx={inputStyle} InputLabelProps={{ shrink: true }} />} />
            <Controller name="videoUrl" control={control} render={({ field }) => <TextField {...field} label="Link Video" fullWidth required color="info" sx={inputStyle} InputLabelProps={{ shrink: true }} />} />

            <div className="col-span-2">
              <FormControl fullWidth color="info" sx={inputStyle}>
                <InputLabel id="kelasId-label" shrink>
                  Pilih Kelas
                </InputLabel>
                <Controller
                  name="kelasId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} value={field.value || ""} labelId="kelasId-label" label="Pilih Kelas">
                      {kelas.map((item) => (
                        <MenuItem key={item.id} value={String(item.id)}>
                          {item.title}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>

            <div className="col-span-2">
              <Controller name="content" control={control} render={({ field }) => <TextField {...field} label="Deskripsi Materi" fullWidth multiline rows={4} color="info" sx={inputStyle} InputLabelProps={{ shrink: true }} />} />
            </div>

            <Controller
              name="price"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="flex items-center gap-2">
                  <p className="font-bold">Rp</p>
                  <CurrencyTextField label="Harga Materi" value={value} onChange={(_, val) => onChange(val)} required sx={inputStyle} />
                </div>
              )}
            />
          </div>
          <div className="col-span-2 mt-6 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold text-sky-400 mb-4">Lampiran (Attachments)</h2>
            {existingAttachments.length === 0 && newlyAddedFiles.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                Belum ada lampiran.
              </Typography>
            ) : (
              <List dense>
                {existingAttachments.map((att) => (
                  <ListItem
                    key={att.id}
                    secondaryAction={
                      <>
                        <IconButton edge="end" aria-label="view" onClick={() => window.open(att.link, "_blank")}>
                          <LinkIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveExistingFile(att.id)} disabled={totalLoading}>
                          <DeleteIcon className="text-red-500" />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText primary={att.name.split("/").pop()} />
                  </ListItem>
                ))}
                {newlyAddedFiles.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete new file" onClick={() => handleRemoveNewFile(index)} disabled={totalLoading}>
                        <DeleteIcon className="text-red-500" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={file.name}
                      secondary={
                        <Typography variant="caption" color="info.main">
                          Baru
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
            {isUploading && <LinearProgress color="info" sx={{ my: 1 }} />}
            <Button component="label" variant="contained" color="info" startIcon={<CloudUploadIcon />} disabled={totalLoading} sx={{ mt: 2 }}>
              Tambah File Baru
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>
          </div>

          <div className="mt-5">
            <BackSubmitButton submit={totalLoading ? "Menyimpan..." : "Simpan Perubahan"} disable={totalLoading} />
          </div>
        </form>
      </div>
    </div>
  );
}

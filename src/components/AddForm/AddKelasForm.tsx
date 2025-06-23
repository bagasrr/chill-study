"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Select, { StylesConfig } from "react-select";
import axios from "@/lib/axios";
import { useFormSubmit } from "@/lib/hooks/useSubmitform";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { Box, Button, Typography, Paper, TextField, CircularProgress } from "@mui/material";
import { CloudUpload as CloudUploadIcon, Add as AddIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { isAxiosError } from "axios";

// Interface untuk data form
interface KelasForm {
  title: string;
  deskripsi: string;
  thumbnail: string;
  CompanyCode: string;
  certifTemplateId: string;
}

// Interface untuk opsi react-select
interface CertificateOption {
  value: string;
  label: string;
  image: string;
}

export default function AddKelasForm() {
  // State untuk data form
  const [kelas, setKelas] = useState<KelasForm>({
    title: "",
    deskripsi: "",
    thumbnail: "",
    CompanyCode: "",
    certifTemplateId: "",
  });

  // State untuk file dan preview
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Hooks
  const { isLoading, submitWrapper } = useFormSubmit();
  const router = useRouter();
  const { data: certifTemplate } = useFetchData("/api/certificate/template");
  const supabase = createClientComponentClient();

  // Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setKelas((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCertifChange = (selectedOption: CertificateOption | null) => {
    setKelas((prev) => ({ ...prev, certifTemplateId: selectedOption?.value || "" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!thumbnailFile) {
      toast.error("Silakan unggah gambar thumbnail.");
      return;
    }
    if (!kelas.certifTemplateId) {
      toast.error("Silakan pilih template sertifikat.");
      return;
    }

    submitWrapper(async () => {
      let thumbnailUrl = "";

      try {
        const file = thumbnailFile;
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
        const filePath = `kelas/cover/${Date.now()}_${safeName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from("file").upload(filePath, file);

        if (uploadError) throw new Error(`Gagal upload thumbnail: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage.from("file").getPublicUrl(uploadData.path);

        thumbnailUrl = publicUrlData.publicUrl;
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.message || "Terjadi kesalahan saat mengunggah file.");
        }
        return;
      }

      const finalPayload = {
        ...kelas,
        thumbnail: thumbnailUrl,
      };

      try {
        await axios.post("/api/kelas", finalPayload);
        toast.success("Kelas berhasil ditambahkan 🎉");
        router.push("/admin-dashboard#kelas");
      } catch (error) {
        toast.error("Gagal menambahkan data kelas 😢");
        console.error(error);
      }
    });
  };

  // Persiapan data untuk react-select
  const certificateOptions: CertificateOption[] = Array.isArray(certifTemplate)
    ? certifTemplate.map((template) => ({
        value: template.id,
        label: template.name,
        image: template.certifTemplate,
      }))
    : [];

  const formatOptionLabel = ({ label, image }: CertificateOption) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Image src={image} alt={label} style={{ width: 50, height: "auto", borderRadius: "4px" }} />
      <span>{label}</span>
    </div>
  );

  // Kostumisasi style untuk react-select agar selalu terang
  const selectStyles: StylesConfig<CertificateOption, false> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#f8fafc", // slate-50
      padding: "8px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    singleValue: (base) => ({
      // Teks item yang terpilih
      ...base,
      color: "#1f2937", // gray-800
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280", // gray-500
    }),
    input: (base) => ({
      ...base,
      color: "#1f2937",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#dbeafe" : "white",
      color: state.isSelected ? "white" : "#1f2937",
      "&:active": {
        backgroundColor: "#60a5fa",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      borderRadius: "8px",
      overflow: "hidden",
    }),
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex items-center justify-center">
      {/* ✅ Paksa background Paper menjadi putih */}
      <Paper elevation={3} sx={{ maxWidth: "800px", width: "100%", p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: "white" }}>
        {/* ✅ Paksa warna teks menjadi gelap */}
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: "#1f2937" }}>
          Tambah Kelas Baru
        </h1>
        <p className="text-center mb-6" style={{ color: "#6b7280" }}>
          Isi detail di bawah ini untuk membuat kelas baru.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ✅ Paksa style input field menjadi terang */}
          <TextField
            label="Judul Kelas"
            name="title"
            color="info"
            value={kelas.title}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            InputProps={{ sx: { bgcolor: "#f8fafc", color: "#1f2937" } }}
            InputLabelProps={{ sx: { color: "#4b5563" } }}
          />
          <TextField
            label="Kode Kelas (Unik)"
            name="CompanyCode"
            color="info"
            value={kelas.CompanyCode}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            InputProps={{ sx: { bgcolor: "#f8fafc", color: "#1f2937" } }}
            InputLabelProps={{ sx: { color: "#4b5563" } }}
          />

          <div>
            <Typography variant="subtitle1" gutterBottom className="font-semibold" sx={{ color: "#374151" }}>
              Thumbnail Kelas
            </Typography>
            <Paper
              variant="outlined"
              color="info"
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                bgcolor: "#f0f9ff",
                border: "2px dashed #93c5fd",
                borderRadius: 2,
              }}
            >
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}>
                Pilih Gambar
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
              {previewUrl && (
                <Box sx={{ mt: 2, border: "1px solid #e5e7eb", p: 1, borderRadius: 2 }}>
                  <Image src={previewUrl} alt="Preview Thumbnail" style={{ width: "200px", height: "auto", objectFit: "cover", borderRadius: "4px" }} />
                </Box>
              )}
              {thumbnailFile && (
                <Typography variant="body2" sx={{ color: "#374151" }}>
                  {thumbnailFile.name}
                </Typography>
              )}
            </Paper>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
              Template Sertifikat
            </label>
            <Select
              instanceId="certifTemplate-select"
              options={certificateOptions}
              formatOptionLabel={formatOptionLabel}
              onChange={handleCertifChange}
              placeholder="Pilih Template Sertifikat..."
              noOptionsMessage={() => "Template tidak ditemukan"}
              styles={selectStyles}
            />
          </div>

          <TextField
            label="Deskripsi Kelas"
            name="deskripsi"
            color="info"
            value={kelas.deskripsi}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            InputProps={{ sx: { bgcolor: "#f8fafc", color: "#1f2937" } }}
            InputLabelProps={{ sx: { color: "#4b5563" } }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: "#374151", borderColor: "#d1d5db" }}>
              Kembali
            </Button>
            <Button type="submit" variant="contained" startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />} disabled={isLoading} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}>
              {isLoading ? "Menambahkan..." : "Tambah Kelas"}
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
}

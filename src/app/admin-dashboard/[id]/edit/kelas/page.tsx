"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import axios, { isAxiosError } from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Select, { StylesConfig } from "react-select";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Import komponen & ikon dari Material-UI
import { Box, Button, Typography, Paper, TextField, CircularProgress, IconButton } from "@mui/material";
import { Update as UpdateIcon, ArrowBack as ArrowBackIcon, CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { GradientCircularProgress } from "@/components/GradientCircularProgress";

// Tipe data untuk Form & Opsi Sertifikat
type FormValues = {
  title: string;
  thumbnail: string;
  deskripsi: string;
  CompanyCode: string;
  certifTemplateId: string;
};

interface CertificateOption {
  value: string;
  label: string;
  image: string;
}

const formatOptionLabel = ({ label, image }: CertificateOption) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <Image src={image} alt={label} width={50} height={50} style={{ width: 50, height: "auto", borderRadius: "4px" }} />
    <span>{label}</span>
  </div>
);

export default function EditKelas() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClientComponentClient();

  // State untuk manajemen file thumbnail
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: certifTemplate } = useFetchData("/api/certificate/template") as { data: { id: string; name: string; certifTemplate: string }[] };
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>();
  console.log("isSubmitting:", { isSubmitting });

  const thumbnailFromDB = watch("thumbnail");
  const displayUrl = previewUrl || thumbnailFromDB;

  // const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchKelas = async () => {
        try {
          const res = await axios.get(`/api/${id}/details/kelas`);
          reset(res.data);
        } catch (err) {
          toast.error("Gagal mengambil data kelas.");
          console.error("Failed to fetch data:", err);
        }
      };
      fetchKelas();
    }
  }, [id, reset]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
    }
  };

  const handleRemoveImage = () => {
    setThumbnailFile(null);
    setPreviewUrl(null);
    setValue("thumbnail", "", { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    const submissionData = { ...data };
    try {
      if (thumbnailFile) {
        const file = thumbnailFile;
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
        const filePath = `kelas/cover/${Date.now()}_${safeName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from("file").upload(filePath, file);
        if (uploadError) throw new Error(`Gagal upload thumbnail: ${uploadError.message}`);
        const { data: publicUrlData } = supabase.storage.from("file").getPublicUrl(uploadData.path);
        submissionData.thumbnail = publicUrlData.publicUrl;
      }
      await axios.patch(`/api/${id}/edit/kelas`, submissionData);
      toast.success("Kelas berhasil diperbarui 🎉");
      router.push("/admin-dashboard#kelas");
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Gagal memperbarui kelas.");
      } else if (err instanceof Error) {
        toast.error(err.message);
      }
      console.error(err);
    }
  };

  const certificateOptions: CertificateOption[] =
    certifTemplate?.map((template) => ({
      value: template.id,
      label: template.name,
      image: template.certifTemplate,
    })) || [];

  const selectStyles: StylesConfig<CertificateOption, false> = {
    control: (base) => ({ ...base, backgroundColor: "#f8fafc", padding: "8px", borderRadius: "8px", borderColor: "#e5e7eb", "&:hover": { borderColor: "#9ca3af" } }),
    menu: (base) => ({ ...base, zIndex: 9999, borderRadius: "8px", overflow: "hidden" }),
    singleValue: (base) => ({ ...base, color: "#1f2937" }),
    placeholder: (base) => ({ ...base, color: "#6b7280" }),
    input: (base) => ({ ...base, color: "#1f2937" }),
    option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#dbeafe" : "white", color: state.isSelected ? "white" : "#1f2937", "&:active": { backgroundColor: "#60a5fa" } }),
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex items-center justify-center">
      <Paper elevation={3} sx={{ maxWidth: "800px", width: "100%", p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: "white" }}>
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Edit Kelas</h1>
        <p className="text-center mb-6 text-gray-500">Perbarui detail kelas di bawah ini.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* ✅ SOLUSI FINAL: Menggunakan `slotProps` dengan `input` dan `inputLabel` */}
          <TextField
            label="Judul Kelas"
            fullWidth
            variant="outlined"
            {...register("title", { required: "Judul tidak boleh kosong" })}
            error={!!errors.title}
            helperText={errors.title?.message}
            color="info"
            slotProps={{
              input: { sx: { bgcolor: "#f8fafc", color: "#1f2937" } },
              inputLabel: { shrink: true, sx: { color: "#4b5563" } },
            }}
          />
          <TextField
            label="Kode Kelas"
            fullWidth
            variant="outlined"
            {...register("CompanyCode", { required: "Kode kelas tidak boleh kosong" })}
            error={!!errors.CompanyCode}
            helperText={errors.CompanyCode?.message}
            color="info"
            slotProps={{
              input: { sx: { bgcolor: "#f8fafc", color: "#1f2937" } },
              inputLabel: { shrink: true, sx: { color: "#4b5563" } },
            }}
          />

          <Paper variant="outlined" sx={{ p: 3, bgcolor: "#f0f9ff", border: "2px dashed #93c5fd", borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Typography variant="subtitle1" className="font-semibold" sx={{ color: "#374151" }}>
              Thumbnail Kelas
            </Typography>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}>
              Pilih Gambar Baru
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {thumbnailFile && (
              <Typography variant="body2" sx={{ color: "#374151", fontStyle: "italic" }}>
                File baru: {thumbnailFile.name}
              </Typography>
            )}
            {displayUrl && (
              <Box sx={{ position: "relative", mt: 1, border: "1px solid #e5e7eb", p: 1, borderRadius: 2, alignSelf: "center" }}>
                <Image src={displayUrl} alt="Preview Thumbnail" width={200} height={200} style={{ width: "200px", height: "auto", objectFit: "cover", borderRadius: "4px" }} />
                <IconButton aria-label="delete" onClick={handleRemoveImage} sx={{ position: "absolute", top: 0, right: 0, backgroundColor: "rgba(255, 255, 255, 0.7)", "&:hover": { backgroundColor: "white" } }}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            )}
          </Paper>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Template Sertifikat</label>
            <Controller
              name="certifTemplateId"
              control={control}
              rules={{ required: "Template sertifikat wajib dipilih" }}
              render={({ field }) => (
                <Select
                  {...field}
                  instanceId="certifTemplate-select-edit"
                  options={certificateOptions}
                  formatOptionLabel={formatOptionLabel}
                  placeholder="Pilih Template Sertifikat..."
                  value={certificateOptions.find((c) => c.value === field.value) || null}
                  onChange={(option) => field.onChange(option?.value)}
                  styles={selectStyles}
                />
              )}
            />
            {errors.certifTemplateId && <p className="text-xs text-red-600 mt-1">{errors.certifTemplateId.message}</p>}
          </div>

          <TextField
            label="Deskripsi Kelas"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            color="info"
            {...register("deskripsi")}
            slotProps={{
              input: { sx: { bgcolor: "#f8fafc", color: "#1f2937" } },
              inputLabel: { shrink: true, sx: { color: "#4b5563" } },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: "#374151", borderColor: "#d1d5db" }}>
              Kembali
            </Button>
            <Button type="submit" variant="contained" startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <UpdateIcon />} disabled={isSubmitting} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}>
              {isSubmitting ? "Memperbarui..." : "Update Kelas"}
            </Button>
          </Box>
        </form>
      </Paper>
      {isSubmitting && <GradientCircularProgress />}
    </div>
  );
}

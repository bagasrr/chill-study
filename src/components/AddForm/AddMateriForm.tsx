"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, IconButton, LinearProgress, Box, Typography, Paper } from "@mui/material";
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, AddCircleOutline as AddIcon, Videocam as VideoIcon, PictureAsPdf as PdfIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { CurrencyTextField } from "../FormTextField"; // Asumsi FormTextField sudah ada
import axios, { isAxiosError } from "axios"; // Import isAxiosError dari axios
import { useFormSubmit } from "@/lib/hooks/useSubmitform"; // Pastikan path dan hooks ini ada
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GradientCircularProgress } from "../GradientCircularProgress";

// Interface state
interface MateriContentItem {
  tempId: number;
  type: "VIDEO" | "PDF";
  title: string;
  weight: number;
  url: string;
  file?: File; // File ini opsional
}

interface MateriInfo {
  title: string;
  content: string;
  price: number;
  kelasId: string;
}

export default function AddMateriForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { isLoading, submitWrapper } = useFormSubmit(); // Pastikan isLoading dan submitWrapper ada

  const [materiInfo, setMateriInfo] = useState<MateriInfo>({ title: "", content: "", price: 0, kelasId: "" });
  const [contentItems, setContentItems] = useState<MateriContentItem[]>([]);
  const [kelas, setKelas] = useState<{ id: string; title: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const getKelas = async () => {
      try {
        const res = await axios.get("/api/kelas");
        // Asumsi res.data adalah array of { id: string; title: string; }
        setKelas(res.data);
      } catch (error) {
        // Tangani error secara lebih spesifik jika perlu
        if (isAxiosError(error)) {
          console.error("Gagal mengambil data kelas:", error.response?.data || error.message);
        } else {
          console.error("Gagal mengambil data kelas:", error);
        }
        toast.error("Gagal memuat daftar kelas.");
      }
    };
    getKelas();
  }, []);

  const handleInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMateriInfo((prev) => ({ ...prev, [name]: value }));
  };

  // --- PERBAIKAN UTAMA DI SINI ---
  // Menggunakan generic untuk keyof MateriContentItem dan memastikan tipe value sesuai
  const handleContentItemChange = <K extends keyof MateriContentItem>(
    index: number,
    field: K, // Field sekarang adalah K, yang merupakan salah satu kunci dari MateriContentItem
    value: MateriContentItem[K] // Value sekarang adalah tipe yang sesuai untuk field tersebut
  ) => {
    setContentItems((prevItems) => {
      const newItems = [...prevItems];
      // Membuat salinan objek item yang akan diubah agar tidak memutasi state langsung
      const updatedItem = { ...newItems[index], [field]: value };
      newItems[index] = updatedItem;
      return newItems;
    });
  };
  // --- AKHIR PERBAIKAN UTAMA ---

  const addContentItem = (type: "VIDEO" | "PDF") => {
    setContentItems([...contentItems, { tempId: Date.now(), type, title: "", weight: 0, url: "" }]);
  };

  const removeContentItem = (index: number) => {
    setContentItems(contentItems.filter((_, i) => i !== index));
  };

  const handleFileChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContentItems((prevItems) => {
        const newItems = [...prevItems];
        const file = e.target.files![0]; // ! untuk memastikan file ada
        // Membuat salinan objek item dan memperbarui file dan title
        const updatedItem = {
          ...newItems[index],
          file: file,
          title: newItems[index].title || file.name, // Set judul jika belum ada
        };
        newItems[index] = updatedItem;
        return newItems;
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (contentItems.length === 0) {
      toast.error("Silakan tambahkan minimal satu item konten (video/PDF).");
      return;
    }
    const totalWeight = contentItems.reduce((sum, item) => sum + Number(item.weight || 0), 0);
    if (totalWeight !== 100) {
      toast.error(`Total bobot harus 100%, saat ini ${totalWeight}%.`);
      return;
    }

    submitWrapper(async () => {
      setIsUploading(true);
      try {
        const processedContents = await Promise.all(
          contentItems.map(async (item) => {
            if (item.type === "PDF" && item.file) {
              const file = item.file;
              // Pastikan nama file aman untuk URL atau path penyimpanan
              const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
              const path = `materi/attachments/${Date.now()}_${safeName}`;
              const { data, error } = await supabase.storage.from("file").upload(path, file);
              if (error) {
                console.error(`Supabase upload error for ${file.name}:`, error);
                throw new Error(`Gagal upload ${file.name}: ${error.message}`);
              }
              const { data: publicUrlData } = supabase.storage.from("file").getPublicUrl(data.path);
              return { type: "PDF", title: item.title, weight: Number(item.weight), url: publicUrlData.publicUrl };
            }
            if (item.type === "VIDEO") {
              // Pastikan URL tidak kosong untuk video
              if (!item.url) {
                throw new Error(`URL video untuk item "${item.title || "tanpa judul"}" tidak boleh kosong.`);
              }
              return { type: "VIDEO", title: item.title, weight: Number(item.weight), url: item.url };
            }
            return null; // Handle kasus di mana item tidak valid
          })
        );

        setIsUploading(false);
        const finalContents = processedContents.filter(Boolean) as Omit<MateriContentItem, "tempId" | "file">[]; // Cast agar TypeScript tahu ini valid
        if (finalContents.length !== contentItems.length) {
          throw new Error("Beberapa konten gagal diproses atau tidak valid. Silakan periksa kembali.");
        }

        const payload = { ...materiInfo, price: Number(materiInfo.price), contents: finalContents };

        console.log("Final Payload to be sent:", payload);

        await axios.post("/api/materi", payload);
        toast.success("Materi berhasil ditambahkan 🎉");
        router.push("/admin-dashboard#materi");
      } catch (error) {
        setIsUploading(false);
        if (isAxiosError(error)) {
          console.error("Axios Error:", error.response?.data || error.message);
          toast.error(error.response?.data.message || "Gagal menambahkan data materi 😢");
        } else if (error instanceof Error) {
          console.error("General Error:", error.message);
          toast.error(error.message); // Tampilkan pesan error yang lebih spesifik dari throw new Error
        } else {
          console.error("Unknown Error:", error);
          toast.error("Terjadi kesalahan yang tidak diketahui saat menambahkan materi.");
        }
      }
    });
  };

  const totalLoading = isLoading || isUploading;
  const totalWeight = contentItems.reduce((sum, item) => sum + Number(item.weight || 0), 0);

  // Style untuk text field dengan warna teks input hitam
  const textFieldStyles = {
    "& .MuiInputBase-input": {
      color: "#0f172a",
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f8fafc",
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0288d1", // Warna border info
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0288d1", // Warna label info
    },
  };

  const standardTextFieldStyles = {
    "& .MuiInput-input": {
      color: "#000", // Warna teks input hitam
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#0288d1", // Warna garis bawah info
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0288d1",
    },
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex items-center justify-center">
      <Paper elevation={3} sx={{ maxWidth: "800px", width: "100%", p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: "white" }}>
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Tambah Materi Baru</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <Box className="p-4 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">Informasi Materi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Judul Materi" name="title" value={materiInfo.title} onChange={handleInfoChange} required fullWidth variant="outlined" sx={textFieldStyles} />
              <FormControl fullWidth variant="outlined" sx={textFieldStyles}>
                <InputLabel id="kelasId-label">Pilih Kelas</InputLabel>
                <Select labelId="kelasId-label" name="kelasId" value={materiInfo.kelasId} label="Pilih Kelas" onChange={(e) => setMateriInfo((p) => ({ ...p, kelasId: e.target.value as string }))} required>
                  {kelas.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="col-span-2">
                <TextField label="Deskripsi Materi" name="content" value={materiInfo.content} onChange={handleInfoChange} multiline rows={3} fullWidth variant="outlined" sx={textFieldStyles} />
              </div>
              <div className="col-span-2 md:col-span-1">
                <CurrencyTextField label="Harga Materi (0 jika gratis)" name="price" value={materiInfo.price} onChange={(name, value) => setMateriInfo((p) => ({ ...p, [name]: value }))} required sx={textFieldStyles} />
              </div>
            </div>
          </Box>

          <Box className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-500">Item Konten</h2>
              <Box className="flex gap-2">
                <Button variant="outlined" size="small" color="info" startIcon={<VideoIcon />} onClick={() => addContentItem("VIDEO")}>
                  Tambah Video
                </Button>
                <Button variant="outlined" size="small" color="success" startIcon={<PdfIcon />} onClick={() => addContentItem("PDF")}>
                  Tambah PDF
                </Button>
              </Box>
            </div>
            <div className="flex flex-col gap-4">
              {contentItems.map((item, index) => (
                <Paper key={item.tempId} variant="outlined" className="p-4 relative" sx={{ bgcolor: "#f8fafc" }}>
                  <IconButton size="small" onClick={() => removeContentItem(index)} sx={{ position: "absolute", top: 8, right: 8 }}>
                    <DeleteIcon color="error" className="z-20" />
                  </IconButton>
                  <div className="flex items-start gap-4">
                    <Typography className="mt-4">{item.type === "VIDEO" ? <VideoIcon color="info" /> : <PdfIcon color="secondary" />}</Typography>
                    <div className="flex-grow grid grid-cols-3 gap-x-4">
                      <TextField label="Judul Item" value={item.title} onChange={(e) => handleContentItemChange(index, "title", e.target.value)} variant="standard" required className="col-span-2" sx={standardTextFieldStyles} />
                      <TextField label="Bobot (%)" type="number" value={item.weight} onChange={(e) => handleContentItemChange(index, "weight", Number(e.target.value))} variant="standard" required sx={standardTextFieldStyles} />
                    </div>
                  </div>
                  {item.type === "VIDEO" && (
                    <TextField label="URL Video (YouTube ID)" value={item.url} onChange={(e) => handleContentItemChange(index, "url", e.target.value)} fullWidth variant="standard" sx={{ mt: 2, ...standardTextFieldStyles }} required />
                  )}
                  {item.type === "PDF" && (
                    <div className="mt-4">
                      <Button component="label" variant="text" size="small" startIcon={<CloudUploadIcon />} color="info">
                        {item.file ? item.file.name : "Pilih File PDF"}
                        <input type="file" accept=".pdf" hidden onChange={(e) => handleFileChange(index, e)} />
                      </Button>
                    </div>
                  )}
                </Paper>
              ))}
            </div>
            {contentItems.length > 0 && (
              <Box sx={{ width: "100%", mt: 3 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Total Bobot: {totalWeight}%
                </Typography>
                <LinearProgress variant="determinate" value={Math.min(totalWeight, 100)} color={totalWeight !== 100 ? "error" : "success"} />
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: "#374151", borderColor: "#d1d5db" }}>
              Kembali
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={totalLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
              disabled={totalLoading}
              sx={{ bgcolor: "#3b82f6", color: "white", "&:hover": { bgcolor: "#2563eb", color: "#e5e7eb" } }}
            >
              {totalLoading ? "Menambahkan..." : "Tambahkan Materi"}
            </Button>
          </Box>
        </form>
      </Paper>

      {totalLoading && <GradientCircularProgress />}
    </div>
  );
}

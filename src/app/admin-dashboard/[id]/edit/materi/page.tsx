// file: components/EditMateriForm.tsx
"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Button, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, TextField, Typography, Paper, IconButton, LinearProgress } from "@mui/material";
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, AddCircleOutline as AddIcon, Videocam as VideoIcon, PictureAsPdf as PdfIcon, Link as LinkIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material"; // Tambahkan ArrowBackIcon
import { CurrencyTextField } from "@/components/FormTextField"; // Asumsi path ini benar
import axios, { isAxiosError } from "axios"; // Import isAxiosError dari axios
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GradientCircularProgress } from "@/components/GradientCircularProgress";

// Interface untuk data MateriContent dari DB (untuk yang sudah ada)
interface MateriContentFromDB {
  id: string; // ID dari database
  type: "VIDEO" | "PDF";
  title: string;
  weight: number;
  url: string;
}

// Interface untuk state di frontend (bisa ada 'file' untuk upload baru)
interface MateriContentItem extends MateriContentFromDB {
  tempId: string; // ID sementara untuk item baru atau identifikasi unik di frontend (bisa sama dengan id jika dari DB)
  file?: File; // Untuk file baru yang akan diupload
  isNew?: boolean; // Flag untuk menandai item baru
  isRemoved?: boolean; // Flag untuk menandai item yang dihapus secara logis di frontend
}

interface MateriInfo {
  title: string;
  content: string;
  price: number;
  kelasId: string;
}

export default function EditMateriForm() {
  const { id: materiId } = useParams<{ id: string }>();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [materiInfo, setMateriInfo] = useState<MateriInfo>({ title: "", content: "", price: 0, kelasId: "" });
  const [contentItems, setContentItems] = useState<MateriContentItem[]>([]);
  const [removedContentIds, setRemovedContentIds] = useState<string[]>([]); // Ini akan melacak ID yang dihapus dari DB
  const [kelas, setKelas] = useState<{ id: string; title: string }[]>([]);
  // console.log({ materiInfo, contentItems, kelas }); // Hapus console.log di sini jika tidak diperlukan lagi

  const [isLoading, setIsLoading] = useState(false); // Untuk submit form (submitWrapper di AddMateriForm)
  const [isDataLoading, setIsDataLoading] = useState(true); // Untuk loading data awal
  const [isUploadingFiles, setIsUploadingFiles] = useState(false); // Untuk proses upload file PDF

  useEffect(() => {
    const loadData = async () => {
      setIsDataLoading(true);
      try {
        const [kelasRes, materiRes] = await Promise.all([
          axios.get("/api/kelas"),
          axios.get(`/api/${materiId}/details/materi`), // Pastikan endpoint ini benar dan mengembalikan detail materi + contents-nya
        ]);
        const materiData = materiRes.data;
        // console.log({ materiRes }); // Hapus console.log di sini

        setKelas(kelasRes.data);
        setMateriInfo({
          title: materiData.title,
          content: materiData.content,
          price: materiData.price,
          kelasId: materiData.kelasId,
        });
        // Pastikan setiap item konten yang dimuat dari DB memiliki tempId dan isNew: false
        setContentItems(
          (materiData.contents || []).map((item: MateriContentFromDB) => ({
            ...item,
            tempId: item.id, // Gunakan ID asli sebagai tempId untuk item yang sudah ada
            isNew: false, // Item yang dimuat dari DB bukan item baru
            isRemoved: false, // Default tidak dihapus
          }))
        );
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Gagal mengambil data materi");
        } else {
          toast.error("Gagal mengambil data materi.");
        }
        console.error("Error loading materi data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };
    if (materiId) {
      loadData();
    }
  }, [materiId]);

  // --- PERBAIKAN handleInfoChange ---
  const handleInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMateriInfo((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value, // Konversi 'price' ke number
    }));
  };
  // --- AKHIR PERBAIKAN handleInfoChange ---

  // --- PERBAIKAN handleContentItemChange ---
  const handleContentItemChange = <K extends keyof MateriContentItem>(
    index: number,
    field: K,
    value: MateriContentItem[K] // Value akan memiliki tipe yang tepat
  ) => {
    setContentItems((prevItems) => {
      const newItems = [...prevItems];
      // Jika field adalah 'weight' atau properti number lainnya, pastikan nilainya adalah number
      const parsedValue = field === "weight" && typeof value === "string" ? Number(value) : value;

      const updatedItem = {
        ...newItems[index],
        [field]: parsedValue, // Gunakan parsedValue
      };
      newItems[index] = updatedItem;
      return newItems;
    });
  };
  // --- AKHIR PERBAIKAN handleContentItemChange ---

  const addContentItem = (type: "VIDEO" | "PDF") => {
    setContentItems([
      ...contentItems,
      {
        tempId: `new_${Date.now()}`, // ID sementara unik untuk item baru di frontend
        id: "", // ID kosong karena ini item baru, belum di DB
        type,
        title: "",
        weight: 0,
        url: "",
        isNew: true, // Flag item baru
        isRemoved: false,
      },
    ]);
  };

  const removeContentItem = (tempIdToRemove: string) => {
    setContentItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        if (item.tempId === tempIdToRemove) {
          // Tandai item sebagai dihapus jika bukan item baru
          if (item.id && !item.isNew) {
            setRemovedContentIds((prevRemovedIds) => [...prevRemovedIds, item.id]);
          }
          return { ...item, isRemoved: true }; // Tandai isRemoved true
        }
        return item;
      });
      // Hanya tampilkan item yang tidak ditandai isRemoved
      return newItems.filter((item) => !item.isRemoved);
    });
  };

  // Fungsi untuk mendapatkan item yang masih terlihat (tidak dihapus secara logis)
  const getVisibleContentItems = () => contentItems.filter((item) => !item.isRemoved);

  const handleFileChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContentItems((prevItems) => {
        const newItems = [...prevItems];
        const file = e.target.files![0]; // ! untuk memastikan file ada
        const updatedItem = {
          ...newItems[index],
          file: file,
          title: newItems[index].title || file.name.split(".").slice(0, -1).join("."), // Ambil nama file tanpa ekstensi
        };
        newItems[index] = updatedItem;
        return newItems;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const currentVisibleContents = getVisibleContentItems();
    if (currentVisibleContents.length === 0) {
      toast.error("Harus ada minimal satu item konten (video/PDF).");
      return;
    }

    const totalWeight = currentVisibleContents.reduce((sum, item) => sum + Number(item.weight || 0), 0);
    if (totalWeight !== 100) {
      toast.error(`Total bobot harus 100%, saat ini ${totalWeight}%.`);
      return;
    }

    setIsLoading(true);
    setIsUploadingFiles(true); // Mulai indikator upload file

    try {
      const finalContentsPayload: {
        id?: string; // ID bisa opsional untuk item baru
        type: "VIDEO" | "PDF";
        title: string;
        url: string;
        weight: number;
      }[] = [];

      await Promise.all(
        currentVisibleContents.map(async (item) => {
          if (item.isNew && item.type === "PDF" && item.file) {
            const file = item.file;
            const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
            const path = `materi/attachments/${Date.now()}_${safeName}`;
            const { data, error } = await supabase.storage.from("file").upload(path, file);
            if (error) {
              console.error(`Gagal upload ${file.name}:`, error);
              throw new Error(`Gagal upload file: ${error.message}`);
            }
            const { data: publicUrlData } = supabase.storage.from("file").getPublicUrl(data.path);
            finalContentsPayload.push({
              type: "PDF",
              title: item.title,
              weight: Number(item.weight),
              url: publicUrlData.publicUrl,
            });
          } else if (item.type === "VIDEO" || (item.type === "PDF" && !item.isNew)) {
            // Video atau PDF yang sudah ada (tidak perlu upload ulang)
            if (!item.url) {
              throw new Error(`URL untuk ${item.title || "item ini"} tidak boleh kosong.`);
            }
            finalContentsPayload.push({
              id: item.id, // Kirim ID jika ini item yang sudah ada
              type: item.type,
              title: item.title,
              weight: Number(item.weight),
              url: item.url,
            });
          } else {
            console.warn("Item konten tidak lengkap atau tidak valid (sebelum submit):", item);
            throw new Error("Beberapa item konten tidak lengkap atau tidak valid.");
          }
        })
      );

      setIsUploadingFiles(false); // Selesai upload file

      const payload = {
        ...materiInfo,
        price: Number(materiInfo.price),
        contents: finalContentsPayload,
        removedContentIds: removedContentIds, // Pastikan ini dikirim
      };

      console.log("Final Payload to be sent:", payload);

      await axios.patch(`/api/${materiId}/edit/materi`, payload); // Asumsi endpoint ini
      toast.success("Materi berhasil diperbarui 🎉");
      router.push("/admin-dashboard#materi");
    } catch (error) {
      setIsUploadingFiles(false); // Pastikan ini di-set false bahkan jika ada error
      setIsLoading(false); // Pastikan ini di-set false bahkan jika ada error

      if (isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Gagal memperbarui materi 😢");
      } else if (error instanceof Error) {
        console.error("General Error:", error.message);
        toast.error(error.message);
      } else {
        console.error("Unknown Error:", error);
        toast.error("Terjadi kesalahan yang tidak diketahui saat memperbarui materi.");
      }
    } finally {
      // Pastikan loading berakhir di sini untuk semua skenario
      // Ini bisa dihapus jika setIsLoading sudah ada di tiap branch catch
      setIsLoading(false);
    }
  };

  const totalWeight = getVisibleContentItems().reduce((sum, item) => sum + Number(item.weight || 0), 0);
  const isTotalLoading = isLoading || isUploadingFiles; // Gabungkan loading submit dan upload file

  // --- Styles tetap sama ---
  const textFieldStyles = {
    "& .MuiInputBase-input": {
      color: "#000",
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f8fafc",
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0288d1",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0288d1",
    },
  };

  const standardTextFieldStyles = {
    "& .MuiInput-input": {
      color: "#000",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#0288d1",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0288d1",
    },
  };

  if (isDataLoading)
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex items-center justify-center">
      <Paper elevation={3} sx={{ maxWidth: "800px", width: "100%", p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: "white" }}>
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Materi</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Form fields untuk materiInfo */}
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
                <CurrencyTextField label="Harga Materi (0 jika gratis)" name="price" value={materiInfo.price} onChange={(name: string, value: number) => setMateriInfo((p) => ({ ...p, [name]: value }))} required sx={textFieldStyles} />
              </div>
            </div>
          </Box>

          {/* Bagian Item Konten Dinamis */}
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
              {contentItems.map(
                (
                  item,
                  index // Render semua item, penanganan isRemoved di getVisibleContentItems() untuk payload
                ) => (
                  <Paper key={item.tempId} variant="outlined" className={`p-4 relative ${item.isRemoved ? "opacity-50 line-through" : ""}`} sx={{ bgcolor: "#f8fafc" }}>
                    <IconButton size="small" onClick={() => removeContentItem(item.tempId)} sx={{ position: "absolute", top: 8, right: 8 }} className="z-20">
                      <DeleteIcon color="error" className="hover:bg-blue-500" />
                    </IconButton>
                    <div className="flex items-start gap-4">
                      <Typography className="mt-4">{item.type === "VIDEO" ? <VideoIcon color="info" /> : <PdfIcon color="secondary" />}</Typography>
                      <div className="flex-grow grid grid-cols-3 gap-x-4">
                        <TextField label="Judul Item" value={item.title} onChange={(e) => handleContentItemChange(index, "title", e.target.value)} variant="standard" required className="col-span-2" sx={standardTextFieldStyles} />
                        {/* Pastikan `Number()` digunakan di sini untuk `weight` */}
                        <TextField label="Bobot (%)" type="number" value={item.weight} onChange={(e) => handleContentItemChange(index, "weight", Number(e.target.value))} variant="standard" required sx={standardTextFieldStyles} />
                      </div>
                    </div>
                    {item.type === "VIDEO" && (
                      <TextField label="URL Video" value={item.url} onChange={(e) => handleContentItemChange(index, "url", e.target.value)} fullWidth variant="standard" sx={{ mt: 2, ...standardTextFieldStyles }} required />
                    )}
                    {item.type === "PDF" &&
                      item.isNew && ( // Hanya tampilkan input file untuk PDF baru
                        <div className="mt-4">
                          <Button component="label" variant="text" size="small" startIcon={<CloudUploadIcon />} color="info">
                            {item.file ? item.file.name : "Pilih File PDF Baru"}
                            <input type="file" accept=".pdf" hidden onChange={(e) => handleFileChange(index, e)} />
                          </Button>
                        </div>
                      )}
                    {item.type === "PDF" &&
                      !item.isNew &&
                      item.url && ( // Tampilkan link PDF yang sudah ada
                        <div className="mt-4">
                          <Button variant="text" size="small" startIcon={<LinkIcon />} color="info" onClick={() => window.open(item.url, "_blank")}>
                            Lihat PDF Existing
                          </Button>
                        </div>
                      )}
                    {item.type === "PDF" &&
                      !item.isNew &&
                      !item.url && ( // Jika PDF lama tapi URL kosong
                        <div className="mt-4 text-red-600">URL PDF tidak ditemukan. Harap unggah ulang atau perbarui.</div>
                      )}
                  </Paper>
                )
              )}
            </div>

            {getVisibleContentItems().length > 0 && (
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
            <Button type="submit" variant="contained" startIcon={isTotalLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />} disabled={isTotalLoading} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}>
              {isTotalLoading ? "Menyimpan..." : "Simpan Perubahan Materi"}
            </Button>
          </Box>
        </form>
      </Paper>
      {isTotalLoading && <GradientCircularProgress />}
    </div>
  );
}

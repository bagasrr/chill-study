"use client";

// Impor yang dibutuhkan
import { ColumnDefinition, SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { lightTheme } from "@/lib/theme";
import { formatCurrency, formattedDate } from "@/lib/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { Button, ThemeProvider } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react"; // Import useState
import DeleteConfirmModalBox from "@/components/DeleteConfirmModalBox"; // Import komponen modal Anda

// Interface untuk data Anda
interface Materi {
  id: string;
  title: string;
  content: string;
  // Perhatikan: Tanggal dari API seringkali string, pastikan formatnya bisa di-parse oleh new Date()
  createdAt: string; // Ubah ke string jika dari API
  LastUpdateDate: string; // Ubah ke string jika dari API
  LastUpdatedBy: string;
  price: number;
  kelas: {
    id: string; // Tambahkan ID kelas jika ada
    title: string;
  };
  Status: number;
  CompanyCode: string;
}

const MateriTable = () => {
  // Dapatkan refreshData dari useFetchData (pastikan useFetchData sudah dimodifikasi)
  const { data: materi, loading, refreshData } = useFetchData<Materi[]>("/api/materi");
  const dataMateri = materi || [];

  // State untuk mengontrol modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // State untuk menyimpan ID materi yang akan dihapus
  const [materiToDeleteId, setMateriToDeleteId] = useState<string | null>(null);
  // State untuk menyimpan judul materi yang akan dihapus (untuk tampilan modal)
  const [materiToDeleteTitle, setMateriToDeleteTitle] = useState<string | null>(null);
  // State untuk menyimpan nama kelas yang terkait dengan materi (untuk tampilan modal)

  // Fungsi untuk membuka modal dan menyimpan info materi yang akan dihapus
  const handleOpenDeleteModal = (id: string, title: string) => {
    setMateriToDeleteId(id);
    setMateriToDeleteTitle(title);
    setIsDeleteModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMateriToDeleteId(null); // Reset ID
    setMateriToDeleteTitle(null); // Reset Title
  };

  // Fungsi yang dipanggil saat konfirmasi hapus dari modal
  const handleConfirmDelete = async () => {
    if (!materiToDeleteId) return; // Pastikan ada ID yang akan dihapus

    try {
      // Mengirim DELETE request untuk menghapus materi
      // Sesuaikan endpoint API Anda jika berbeda
      await axios.patch(`/api/${materiToDeleteId}/delete/materi`); // Contoh endpoint: /api/materi/{id}/delete
      toast.success("Materi berhasil dihapus!");
      refreshData(); // Muat ulang data setelah penghapusan berhasil
      handleCloseDeleteModal(); // Tutup modal setelah berhasil dihapus
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Gagal menghapus materi. Kode: ${error.response?.status} - ${error.response?.statusText || error.response?.data?.message}`);
      } else {
        toast.error("Terjadi kesalahan tak terduga saat menghapus materi.");
      }
      console.error("Error deleting materi:", error);
    }
  };

  // --- SOLUSI TERBAIK: DEFINISIKAN TIPE KOLOM SECARA EKSPLISIT ---
  const columns: ColumnDefinition<Materi>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "content", label: "Konten", sortable: true, render: (value) => <p className="text-sm max-h-[70px] w-[500px] overflow-auto">{value}</p> },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      // Konversi string ke Date sebelum diformat
      render: (value) => <p>{formattedDate(new Date(value))}</p>,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value) => <p>{formatCurrency(value)}</p>,
    },
    {
      key: "kelas",
      label: "Kelas Nama",
      render: (value) => <p>{value.title}</p>,
    },
    {
      key: "LastUpdateDate",
      label: "Last Update At",
      sortable: true,
      // Konversi string ke Date sebelum diformat
      render: (value) => (value ? <p>{formattedDate(new Date(value))}</p> : <p>-</p>),
    },
    { key: "LastUpdatedBy", label: "Last Update By", sortable: true },
    { key: "Status", label: "Status" },
    { key: "CompanyCode", label: "Company Code" },
  ];

  return (
    <ThemeProvider theme={lightTheme}>
      <SortableTable
        idSection="materi"
        tableTitle="Materi"
        addLink="/admin-dashboard/add-new/materi"
        data={dataMateri}
        columns={columns} // Gunakan variabel yang sudah diberi tipe
        isLoading={loading}
        renderAction={(data) => (
          <div className="flex items-center space-x-2">
            {" "}
            {/* Tambahkan space-x-2 untuk jarak antar ikon */}
            <Link href={`/admin-dashboard/${data.id}/edit/materi`}>
              <EditSquareIcon color="info" />
            </Link>
            {/* Memanggil handleOpenDeleteModal saat tombol delete diklik */}
            <Button onClick={() => handleOpenDeleteModal(data.id, data.title)}>
              <DeleteIcon color="error" />
            </Button>
          </div>
        )}
      />

      {/* Komponen DeleteConfirmModalBox */}
      <DeleteConfirmModalBox
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        // itemName digunakan sebagai fallback jika children tidak disediakan
        itemName={materiToDeleteTitle || "materi ini"}
      >
        {/* Konten kustom yang dilewatkan sebagai children, disesuaikan dengan layout gambar */}
        <p className="text-gray-700 text-lg mb-2">Yakin Ingin menghapus</p>
        <p className="font-bold text-xl text-gray-900 mb-4">{materiToDeleteTitle || "Materi ini"}</p>
      </DeleteConfirmModalBox>
    </ThemeProvider>
  );
};

export default MateriTable;

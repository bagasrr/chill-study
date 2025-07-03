"use client";

// Impor yang dibutuhkan
import { ColumnDefinition, SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formattedDate } from "@/lib/utils";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import Link from "next/link";
import { useState } from "react"; // Import useState
import axios from "axios"; // Import axios
import toast from "react-hot-toast"; // Import react-hot-toast
import DeleteConfirmModalBox from "@/components/DeleteConfirmModalBox"; // Import komponen modal Anda

// Interface untuk data Anda
interface Exam {
  id: string;
  title: string;
  description: string;
  // Perhatikan: Tanggal dari API seringkali string, pastikan formatnya bisa di-parse oleh new Date()
  createdAt: string; // Ubah ke string jika dari API
  LastUpdateDate: string; // Ubah ke string jika dari API
}

const ExamTable = () => {
  // Dapatkan refreshData dari useFetchData (pastikan useFetchData sudah dimodifikasi)
  const { data: exam, loading, refreshData } = useFetchData<Exam[]>("/api/exam");
  const dataExam = exam || [];

  // State untuk mengontrol modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // State untuk menyimpan ID exam yang akan dihapus
  const [examToDeleteId, setExamToDeleteId] = useState<string | null>(null);
  // State untuk menyimpan judul exam yang akan dihapus (untuk tampilan modal)
  const [examToDeleteTitle, setExamToDeleteTitle] = useState<string | null>(null);

  // Fungsi untuk membuka modal dan menyimpan info exam yang akan dihapus
  const handleOpenDeleteModal = (id: string, title: string) => {
    setExamToDeleteId(id);
    setExamToDeleteTitle(title);
    setIsDeleteModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setExamToDeleteId(null); // Reset ID
    setExamToDeleteTitle(null); // Reset Title
  };

  // Fungsi yang dipanggil saat konfirmasi hapus dari modal
  const handleConfirmDelete = async () => {
    if (!examToDeleteId) return; // Pastikan ada ID yang akan dihapus

    try {
      // Mengirim PATCH request untuk menghapus exam
      // Sesuaikan endpoint API Anda jika berbeda, misal /api/exams/${examToDeleteId}/delete
      await axios.patch(`/api/${examToDeleteId}/delete/exam`);
      toast.success("Exam berhasil dihapus!");
      refreshData(); // Muat ulang data setelah penghapusan berhasil
      handleCloseDeleteModal(); // Tutup modal setelah berhasil dihapus
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Gagal menghapus exam. Kode: ${error.response?.status} - ${error.response?.statusText}`);
      } else {
        toast.error("Terjadi kesalahan tak terduga saat menghapus exam.");
      }
      console.error("Error deleting exam:", error);
    }
  };

  // Definisikan kolom dengan tipe yang eksplisit
  const columns: ColumnDefinition<Exam>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "description", label: "Deskripsi", sortable: true },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      // Konversi string ke Date sebelum diformat
      render: (value) => <p>{formattedDate(new Date(value))}</p>,
    },
    {
      key: "LastUpdateDate",
      label: "Updated At",
      sortable: true,
      // Konversi string ke Date sebelum diformat
      render: (value) => (value ? <p>{formattedDate(new Date(value))}</p> : <p>NA</p>),
    },
  ];

  return (
    <>
      <SortableTable
        idSection="exam"
        tableTitle="Exam"
        addLink="/admin-dashboard/add-new/exam"
        data={dataExam}
        columns={columns} // Gunakan variabel yang sudah diberi tipe
        isLoading={loading}
        // Menggunakan renderAction sesuai permintaan Anda
        renderAction={(data) => (
          <div className="flex items-center space-x-2">
            {" "}
            {/* Tambahkan space-x-2 untuk jarak antar ikon */}
            <Link href={`/admin-dashboard/${data.id}/edit/exam`}>
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
        itemName={examToDeleteTitle || "exam ini"}
      >
        {/* Konten kustom yang dilewatkan sebagai children, disesuaikan dengan layout gambar */}
        <p className="text-gray-700 text-lg mb-2">Yakin ingin menghapus Exam</p>
        <p className="font-bold text-xl text-gray-900 mb-4">{examToDeleteTitle || "Exam ini"}</p>
      </DeleteConfirmModalBox>
    </>
  );
};

export default ExamTable;

"use client";

import { ColumnDefinition, SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formattedDate } from "@/lib/utils";
import { Button } from "@mui/material";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteConfirmModalBox from "@/components/DeleteConfirmModalBox"; // Pastikan path ini benar
import { useState } from "react";

interface Kelas {
  id: string;
  title: string;
  deskripsi: string;
  thumbnail: string;
  createdAt: string; // <-- Tipe ini adalah string
  LastUpdateDate: string; // <-- Tipe ini adalah string
  LastUpdatedBy: string;
  CompanyCode: string;
  Status: number;
}

const KelasTable = () => {
  const { data: kelas, loading, refreshData } = useFetchData<Kelas[]>("/api/kelas"); // Tambahkan refreshData
  const dataKelas = kelas || [];

  // State untuk mengontrol modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // State untuk menyimpan ID item yang akan dihapus
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  // State untuk menyimpan nama item yang akan dihapus (opsional, untuk tampilan modal)
  const [itemToDeleteName, setItemToDeleteName] = useState<string | null>(null);

  // Fungsi untuk membuka modal dan menyimpan info item yang akan dihapus
  const handleOpenDeleteModal = (id: string, name: string) => {
    setItemToDeleteId(id);
    setItemToDeleteName(name);
    setIsDeleteModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDeleteId(null); // Reset ID setelah modal ditutup
    setItemToDeleteName(null); // Reset nama setelah modal ditutup
  };

  // Fungsi yang dipanggil saat konfirmasi hapus dari modal
  const handleConfirmDelete = async () => {
    // alert(itemToDeleteId);
    if (!itemToDeleteId) return; // Pastikan ada ID yang akan dihapus

    try {
      // Mengirim PATCH request untuk menghapus kelas
      await axios.patch(`/api/${itemToDeleteId}/delete/kelas`); // Sesuaikan endpoint jika perlu, biasanya ada nama resource
      toast.success("Kelas berhasil dihapus!");
      refreshData(); // Muat ulang data setelah penghapusan berhasil
      handleCloseDeleteModal(); // Tutup modal setelah berhasil dihapus
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Gagal menghapus kelas. Kode: ${error.response?.status} - ${error.response?.statusText}`);
      } else {
        toast.error("Terjadi kesalahan tak terduga saat menghapus kelas.");
      }
      console.error("Error deleting kelas:", error);
    }
  };

  const columns: ColumnDefinition<Kelas>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "deskripsi", label: "Deskripsi", sortable: true },
    { key: "thumbnail", label: "Thumbnail", sortable: false, render: (value) => <Image src={value} width={80} height={80} alt="Thumbnail" className="w-20 h-20 object-cover rounded" /> },
    { key: "createdAt", label: "Created At", sortable: true, render: (value) => <p>{formattedDate(new Date(value))}</p> },
    { key: "LastUpdateDate", label: "Last Update At", sortable: true, render: (value) => (value ? <p>{formattedDate(new Date(value))}</p> : "-") },
    { key: "LastUpdatedBy", label: "Last Update By", sortable: true },
    { key: "Status", label: "Status" },
    { key: "CompanyCode", label: "Company Code" },
  ];

  return (
    <>
      <SortableTable
        idSection="kelas"
        tableTitle="Kelas"
        addLink="/admin-dashboard/add-new/kelas"
        data={dataKelas}
        columns={columns}
        isLoading={loading}
        renderAction={(data) => (
          <div className="flex items-center space-x-2">
            {" "}
            {/* Tambahkan space-x-2 untuk jarak */}
            <Link href={`/admin-dashboard/${data.id}/edit/kelas`}>
              <EditSquareIcon color="info" />
            </Link>
            {/* Panggil handleOpenDeleteModal saat tombol delete diklik */}
            <Button onClick={() => handleOpenDeleteModal(data.id, data.title)}>
              <DeleteIcon color="error" />
            </Button>
          </div>
        )}
      />

      <DeleteConfirmModalBox
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete} // Panggil fungsi tanpa argumen, karena ID sudah disimpan di state
        itemName={itemToDeleteName || "item ini"} // Menampilkan nama item di modal
      >
        {/* Konten kustom yang dilewatkan sebagai children */}
        <p>
          Yakin Ingin menghapus <div className="font-bold">{itemToDeleteName || "item ini"}</div>
          <div className="text-red-500 font-semibold">Materi didalamnya akan ikut terhapus juga</div>
        </p>
      </DeleteConfirmModalBox>
    </>
  );
};

export default KelasTable;

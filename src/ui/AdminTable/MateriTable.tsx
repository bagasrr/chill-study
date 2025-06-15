"use client";

// Impor ColumnDefinition dari lokasi komponen Anda
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

// Interface untuk data Anda
interface Materi {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  LastUpdateDate: Date;
  LastUpdatedBy: string; // Annnggap ini string, sesuaikan jika perlu
  price: number;
  kelas: {
    title: string;
  };
  Status: number;
  CompanyCode: string;
}

const MateriTable = () => {
  const { data: materi, loading } = useFetchData<Materi[]>("/api/materi");
  const dataMateri = materi || [];

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/${id}/delete/materi`);
      toast.success("Materi berhasil dihapus");

      // TODO: Panggil fungsi untuk refresh data setelah delete
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Gagal menghapus materi.");
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui.");
      }
      console.error(error);
    }
  };

  // --- SOLUSI TERBAIK: DEFINISIKAN TIPE KOLOM SECARA EKSPLISIT ---
  const columns: ColumnDefinition<Materi>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "content", label: "Konten", sortable: true },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (value: Date) => <p>{formattedDate(value)}</p>,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value: number) => <p>{formatCurrency(value)}</p>,
    },
    // --- INI PERBAIKAN UTAMANYA ---
    {
      key: "kelas",
      label: "Kelas Nama",
      sortable: true,
      render: (value: { title: string }) => <p>{value.title}</p>, // Ambil properti .title dari objek
    },
    {
      key: "LastUpdateDate",
      label: "Last Update At",
      sortable: true,
      render: (value: Date) => (value ? <p>{formattedDate(value)}</p> : <p>-</p>),
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
          <div className="flex items-center">
            <Link href={`/admin-dashboard/${data.id}/edit/materi`}>
              <EditSquareIcon color="info" />
            </Link>
            <Button onClick={() => handleDelete(data.id)}>
              <DeleteIcon color="error" />
            </Button>
          </div>
        )}
      />
    </ThemeProvider>
  );
};

export default MateriTable;

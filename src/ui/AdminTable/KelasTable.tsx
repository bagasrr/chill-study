"use client";

import { ColumnDefinition, SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formattedDate } from "@/lib/utils";
import { Button } from "@mui/material";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import Link from "next/link";

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
  const { data: kelas, loading } = useFetchData<Kelas[]>("/api/kelas");
  const dataKelas = kelas || [];

  const columns: ColumnDefinition<Kelas>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "deskripsi", label: "Deskripsi", sortable: true },
    { key: "thumbnail", label: "Thumbnail", sortable: false, render: (value) => <Image src={value} width={80} height={80} alt="Thumbnail" className="w-20 h-20 object-cover rounded" /> },
    // PERHATIKAN: Kita ubah `value` (string) menjadi Date sebelum diformat
    { key: "createdAt", label: "Created At", sortable: true, render: (value) => <p>{formattedDate(new Date(value))}</p> },
    { key: "LastUpdateDate", label: "Last Update At", sortable: true, render: (value) => (value ? <p>{formattedDate(new Date(value))}</p> : "-") },
    { key: "LastUpdatedBy", label: "Last Update By", sortable: true },
    { key: "Status", label: "Status" },
    { key: "CompanyCode", label: "Company Code" },
  ];

  return (
    <SortableTable
      idSection="kelas"
      tableTitle="Kelas"
      addLink="/admin-dashboard/add-new/kelas"
      data={dataKelas}
      columns={columns}
      isLoading={loading}
      renderAction={(data) => (
        <div className="flex items-center">
          <Link href={`/admin-dashboard/${data.id}/edit/kelas`}>
            <EditSquareIcon color="info" />
          </Link>
          <Button onClick={() => alert("ID : " + data.id)}>
            <DeleteIcon color="error" />
          </Button>
        </div>
      )}
    />
  );
};

export default KelasTable;

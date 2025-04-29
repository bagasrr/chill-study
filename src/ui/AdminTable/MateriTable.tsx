"use client";

import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formatCurrency, formattedDate } from "@/lib/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { Button } from "@mui/material";
import Link from "next/link";

const MateriTable = () => {
  const { data: materi, loading } = useFetchData<[]>("/api/materi");
  const dataMateri = materi || [];
  return (
    <SortableTable
      idSection="materi"
      tableTitle="Materi"
      addLink="/admin-dashboard/add-new/materi"
      data={dataMateri}
      columns={[
        { key: "title", label: "Title", sortable: true },
        { key: "content", label: "Konten", sortable: true },
        { key: "createdAt", label: "Created At", sortable: true, render: (value) => <p>{formattedDate(value)}</p> },

        {
          key: "price",
          label: "Price",
          sortable: true,
          render: (value) => <p>{formatCurrency(value)}</p>,
        },
        { key: "kelas", label: "Kelas Nama", sortable: true },
      ]}
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

export default MateriTable;

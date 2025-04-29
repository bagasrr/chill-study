"use client";

import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formattedDate } from "@/lib/utils";
import { Button } from "@mui/material";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { useRouter } from "next/navigation";
import Link from "next/link";

const KelasTable = () => {
  const { data: kelas, loading } = useFetchData<[]>("/api/kelas");
  const dataKelas = kelas || [];
  const router = useRouter();
  return (
    <SortableTable
      idSection="kelas"
      tableTitle="Kelas"
      addLink="/admin-dashboard/add-new/kelas"
      data={dataKelas}
      columns={[
        { key: "title", label: "Title", sortable: true },
        { key: "deskripsi", label: "Deskripsi", sortable: true },
        { key: "thumbnail", label: "Thumbnail", sortable: false, render: (value) => <Image src={value} width={20} height={20} alt="Thumbnail" className="w-20 h-20 object-cover rounded" /> },
        { key: "createdAt", label: "Created At", sortable: true, render: (value) => <p>{formattedDate(value)}</p> },
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

export default KelasTable;

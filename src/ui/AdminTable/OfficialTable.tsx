"use client";

import { ColumnDefinition, SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formattedDate } from "@/lib/utils";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import Link from "next/link";
import Image from "next/image";

interface Official {
  id: string;
  name: string;
  position: string;
  isActive: boolean;
  createdAt: Date; // <-- Tipe ini adalah Date
  signatureUrl: string;
}

const OfficialTable = () => {
  const { data: official, loading } = useFetchData<Official[]>("/api/official");
  const dataOfficial = official || [];

  const columns: ColumnDefinition<Official>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "position", label: "Position", sortable: true },
    { key: "isActive", label: "Status", sortable: true, render: (value) => <p>{value === true ? "Active" : "Not Active"}</p> },
    {
      key: "signatureUrl",
      label: "Signature",
      sortable: false,
      render: (value) => <Image src={value} width={80} height={80} alt="Signature" className="w-20 h-20 object-cover rounded" />,
    },
    { key: "createdAt", label: "Created At", sortable: true, render: (value) => <p>{formattedDate(value)}</p> },
  ];

  return (
    <SortableTable
      idSection="official"
      tableTitle="Official"
      addLink="/admin-dashboard/add-new/official"
      data={dataOfficial}
      columns={columns}
      isLoading={loading}
      renderAction={(data) => (
        <div className="flex items-center">
          <Link href={`/admin-dashboard/${data.id}/edit/official`}>
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

export default OfficialTable;

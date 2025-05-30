"use client";

import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formattedDate } from "@/lib/utils";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import Link from "next/link";

interface Official {
  id: string;
  name: string;
  position: string;
  isActive: boolean;
  createdAt: Date;
}

const OfficialTable = () => {
  const { data: official, loading } = useFetchData<Official[]>("/api/official");
  const dataOfficial = official || [];

  return (
    <SortableTable
      idSection="official"
      tableTitle="Official"
      addLink="/admin-dashboard/add-new/official"
      data={dataOfficial}
      columns={[
        { key: "name", label: "Name", sortable: true },
        { key: "position", label: "Position", sortable: true },
        { key: "isActive", label: "Status", sortable: true, render: (value) => <p>{value === true ? "Active" : "Not Active"}</p> },
        { key: "createdAt", label: "Created At", sortable: true, render: (value) => <p>{formattedDate(value)}</p> },
      ]}
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

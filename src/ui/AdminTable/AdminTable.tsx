"use client";

import { ColumnDefinition, SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formattedDate } from "@/lib/utils";
import { Button } from "@mui/material";
import { User } from "@prisma/client";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";

const AdminTable = () => {
  const { data: admins, loading } = useFetchData<User[]>("/api/users/admins");
  const dataAdmin = admins || [];

  const columns: ColumnDefinition<User>[] = [
    { key: "name", label: "User Name", sortable: true },
    { key: "email", label: "User Email", sortable: true },
    { key: "deviceToken", label: "Device Token", render: (value) => <p>{value ? "Active" : "None"}</p> },
    { key: "role", label: "Role", sortable: true },
    { key: "createdAt", label: "Joined At", sortable: true, render: (value) => <p>{formattedDate(value)}</p> },
    { key: "CreatedBy", label: "Created By", sortable: true },
    { key: "LastUpdateDate", label: "Last Update At", sortable: true, render: (value) => (value ? <p>{formattedDate(value)}</p> : "-") },
    { key: "LastUpdatedBy", label: "Last Update By", sortable: true },
    { key: "CompanyCode", label: "Company Code" },
    { key: "Status", label: "Status" },
  ];

  return (
    <SortableTable
      idSection="admins"
      tableTitle="Admin Account"
      addLink={null}
      data={dataAdmin}
      columns={columns}
      isLoading={loading}
      renderAction={(data) => (
        <div className="flex items-center">
          <Link href={`/admin-dashboard/${data.id}/edit/user`}>
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

export default AdminTable;

"use client";

import { ColumnDefinition, SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formattedDate } from "@/lib/utils";
import { User } from "@prisma/client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { Button } from "@mui/material";
import Link from "next/link";

const StudentTable = () => {
  const { data: students, loading } = useFetchData<User[]>("/api/users/students");
  const dataStudent = students || [];

  const columns: ColumnDefinition<User>[] = [
    { key: "name", label: "User Name", sortable: true },
    { key: "email", label: "User Email", sortable: true },
    { key: "deviceToken", label: "Device Token", render: (value) => <p>{value ? "Active" : "None"}</p> },
    { key: "role", label: "Role", sortable: true },
    { key: "createdAt", label: "Joined At", sortable: true, render: (value) => <p>{formattedDate(value)}</p> },
    { key: "emailVerified", label: "Verified", sortable: false, render: (value) => (value ? "Verified" : "Not Verified") },
    { key: "CreatedBy", label: "Created By", sortable: true },
    { key: "LastUpdateDate", label: "Last Update At", sortable: true, render: (value) => (value ? <p>{formattedDate(value)}</p> : "-") },
    { key: "LastUpdatedBy", label: "Last Update By", sortable: true },
    { key: "CompanyCode", label: "Company Code" },
    { key: "Status", label: "Status" },
  ];

  return (
    <SortableTable
      idSection="students"
      tableTitle="Students Account"
      addLink={null}
      data={dataStudent}
      columns={columns}
      isLoading={loading}
      renderAction={(data) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin-dashboard/${data.id}/edit/user`}>
            <EditSquareIcon color="info" />
          </Link>
          <Button onClick={() => alert("ID : " + data.id)} className="hover:bg-red-100">
            <DeleteIcon color="error" />
          </Button>
        </div>
      )}
    />
  );
};

export default StudentTable;

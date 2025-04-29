"use client";

import { SortableTable } from "@/components/DataTable";
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
  return (
    <SortableTable
      idSection="accounts"
      tableTitle="Students Account"
      // addLink="/admin-dashboard/add-new/admin"
      data={dataStudent}
      columns={[
        { key: "name", label: "User Name", sortable: true },
        { key: "email", label: "User Email", sortable: true },
        { key: "deviceToken", label: "Device Token", render: (value) => <p>{value ? "True" : "False"}</p> },
        { key: "role", label: "Role", sortable: true },
        { key: "createdAt", label: "Joined At", sortable: true, render: (value) => <p>{formattedDate(value)}</p> },
        { key: "emailVerified", label: "Verified", sortable: false },
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

export default StudentTable;

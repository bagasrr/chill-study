"use client";
import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formattedDate } from "@/lib/utils";
import { Button } from "@mui/material";
import { User } from "@prisma/client";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";

const TeacherTable = () => {
  const { data: admins, loading } = useFetchData<User[]>("/api/users/admins");
  const dataAdmin = admins || [];

  return (
    <SortableTable
      idSection="accounts"
      tableTitle="Teacher Account"
      // addLink="/admin-dashboard/add-new/admin"
      data={dataAdmin}
      columns={[
        { key: "name", label: "User Name", sortable: true },
        { key: "email", label: "User Email", sortable: true },
        { key: "deviceToken", label: "Device Token", render: (value) => <p>{value ? "True" : "False"}</p> },
        { key: "role", label: "Role", sortable: true },
        { key: "createdAt", label: "Joined At", sortable: true, render: (value) => <p>{formattedDate(value)}</p> },
      ]}
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

export default TeacherTable;

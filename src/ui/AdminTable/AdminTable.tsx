"use client";
import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { User } from "@prisma/client";

const AdminTable = () => {
  const { data: admins, loading } = useFetchData<User[]>("/api/users/admins");
  const dataAdmin = admins || [];

  return (
    <SortableTable
      idSection="accounts"
      tableTitle="Admin Account"
      addLink="/admin-dashboard/add-new/admin"
      data={dataAdmin}
      columns={[
        { key: "name", label: "User Name", sortable: true },
        { key: "email", label: "User Email", sortable: true },
        { key: "deviceToken", label: "Device Token" },
        { key: "role", label: "Role", sortable: true },
        { key: "createdAt", label: "Joined At", sortable: true },
      ]}
      isLoading={loading}
      renderAction={(user) => <button onClick={() => alert(user.name)}>Edit</button>}
    />
  );
};

export default AdminTable;

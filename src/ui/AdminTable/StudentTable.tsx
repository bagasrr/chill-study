"use client";

import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { User } from "@prisma/client";
import React from "react";

const StudentTable = () => {
  const { data: students, loading } = useFetchData<User[]>("/api/users/students");
  const dataStudent = students || [];
  return (
    <SortableTable
      idSection="accounts"
      tableTitle="Students Account"
      addLink="/admin-dashboard/add-new/admin"
      data={dataStudent}
      columns={[
        { key: "name", label: "User Name", sortable: true },
        { key: "email", label: "User Email", sortable: true },
        { key: "deviceToken", label: "Device Token" },
        { key: "role", label: "Role", sortable: true },
        { key: "createdAt", label: "Joined At", sortable: true },
        { key: "emailVerified", label: "Verified", sortable: false },
      ]}
      isLoading={loading}
      renderAction={(user) => <button onClick={() => alert(user.name)}>Edit</button>}
    />
  );
};

export default StudentTable;

"use client";

import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { User } from "@prisma/client";
import React from "react";

const MateriTable = () => {
  const { data: materi, loading } = useFetchData<User[]>("/api/users/admins");
  const dataMateri = materi || [];
  return (
    <SortableTable
      idSection="materi"
      tableTitle="Materi"
      data={dataMateri}
      columns={[
        { key: "name", label: "Title", sortable: true },
        { key: "createdAt", label: "Created At", sortable: true },
      ]}
      isLoading={loading}
      renderAction={(user) => <button onClick={() => alert(user.name)}>Edit</button>}
    />
  );
};

export default MateriTable;

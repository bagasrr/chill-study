"use client";

import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { User } from "@prisma/client";
import React from "react";

const MateriTable = () => {
  const { data: materi, loading } = useFetchData<User[]>("/api/materi");
  const dataMateri = materi || [];
  return (
    <SortableTable
      idSection="materi"
      tableTitle="Materi"
      addLink="/admin-dashboard/add-new/materi"
      data={dataMateri}
      columns={[
        { key: "title", label: "Title", sortable: true },
        { key: "content", label: "Konten", sortable: true },
        { key: "createdAt", label: "Created At", sortable: true },
        { key: "price", label: "Price", sortable: true },
        { key: "kelas", label: "Kelas Nama", sortable: true },
      ]}
      isLoading={loading}
      renderAction={(user) => <button onClick={() => alert(user.name)}>Edit</button>}
    />
  );
};

export default MateriTable;

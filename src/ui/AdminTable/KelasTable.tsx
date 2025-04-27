"use client";

import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";

const KelasTable = () => {
  const { data: kelas, loading } = useFetchData<[]>("/api/kelas");
  const dataKelas = kelas || [];
  return (
    <SortableTable
      idSection="kelas"
      tableTitle="Kelas"
      addLink="/admin-dashboard/add-new/kelas"
      data={dataKelas}
      columns={[
        { key: "title", label: "Title", sortable: true },
        { key: "deskripsi", label: "Deskripsi", sortable: true },
        { key: "thumbnail", label: "Thumbnail", sortable: true },
      ]}
      isLoading={loading}
      renderAction={(user) => <button onClick={() => alert(user.name)}>Edit</button>}
    />
  );
};

export default KelasTable;

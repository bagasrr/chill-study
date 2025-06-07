"use client";

import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { formattedDate } from "@/lib/utils";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import Link from "next/link";

interface Exam {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  LastUpdateDate: Date;
}

const ExamTable = () => {
  const { data: exam, loading } = useFetchData<Exam[]>("/api/exam");
  const dataExam = exam || [];
  console.log(dataExam);
  return (
    <SortableTable
      idSection="exam"
      tableTitle="Exam"
      addLink="/admin-dashboard/add-new/exam"
      data={dataExam}
      columns={[
        { key: "title", label: "Title", sortable: true },
        { key: "description", label: "Deskripsi", sortable: true },
        { key: "createdAt", label: "Created At", sortable: true, render: (value) => <p>{formattedDate(value)}</p> },
        { key: "LastUpdateDate", label: "Updated At", sortable: true, render: (value) => (value ? <p>{formattedDate(value)}</p> : <p>NA</p>) },
      ]}
      isLoading={loading}
      renderAction={(data) => (
        <div className="flex items-center">
          <Link href={`/admin-dashboard/${data.id}/edit/exam`}>
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

export default ExamTable;

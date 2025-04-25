"use client";

import { SortableTable } from "@/components/DataTable";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { Typography } from "@mui/material";
import { Materi, User } from "@prisma/client";
import React, { useEffect, useState } from "react";

const Tables = () => {
  // const [admins, setAdmins] = useState<User[]>([]);
  // const [students, setStudents] = useState<User[]>([]);
  // const [materi, setMateri] = useState<Materi[]>([]);
  // const [loading, setLoading] = useState(true);

  const { data: admins, loading } = useFetchData<User[]>("/api/admins");
  console.log(admins);
  useEffect(() => {
    // fetchAdmins();
    // fetchStudents();
    // fetchMateri();
  }, []);

  // const fetchAdmins = () => {
  //   fetch("/api/users/admins")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setAdmins(data);
  //       setLoading(false);
  //     });
  // };
  // const fetchStudents = () => {
  //   fetch("/api/users/students")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setStudents(data);
  //       setLoading(false);
  //     });
  // };

  // const fetchMateri = () => {
  //   fetch("/api/materi")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setMateri(data);
  //       setLoading(false);
  //     });
  // };

  return (
    <div className="flex flex-col gap-5">
      <Typography variant="h4">Admin Account</Typography>

      <SortableTable
        idSection="accounts"
        tableTitle="Admin Account"
        data={admins}
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

      {/* <SortableTable
        idSection="accounts"
        tableTitle="Students Account"
        data={students}
        columns={[
          { key: "name", label: "User Name", sortable: true },
          { key: "email", label: "User Email", sortable: true },
          { key: "deviceToken", label: "Device Token" },
          { key: "role", label: "Role", sortable: true },
          { key: "createdAt", label: "Joined At", sortable: true },
          { key: "emailVerified", label: "Verified", sortable: false },
        ]}
        renderAction={(user) => <button onClick={() => alert(user.name)}>Edit</button>}
      />

      <SortableTable
        idSection="materi"
        tableTitle="Materi"
        data={materi}
        columns={[
          { key: "title", label: "Title", sortable: true },
          { key: "createdAt", label: "Created At", sortable: true },
        ]}
        renderAction={(user) => <button onClick={() => alert(user.name)}>Edit</button>}
      /> */}
    </div>
  );
};

export default Tables;

"use client";

import { SortableTable } from "@/components/DataTable";
import { Typography } from "@mui/material";
import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";

const Tables = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    fetchAdmins();
    fetchStudents();
  }, []);

  const fetchAdmins = () => {
    fetch("/api/users/admins")
      .then((res) => res.json())
      .then((data) => setAdmins(data));
  };
  const fetchStudents = () => {
    fetch("/api/users/students")
      .then((res) => res.json())
      .then((data) => setStudents(data));
  };

  console.log("Data Admin : ", admins);
  return (
    <div className="flex flex-col gap-5">
      <Typography variant="h4">Admin Account</Typography>

      <SortableTable
        data={admins}
        columns={[
          { key: "name", label: "User Name", sortable: true },
          { key: "email", label: "User Email", sortable: true },
          { key: "deviceToken", label: "Device Token" },
          { key: "role", label: "Role", sortable: true },
          { key: "createdAt", label: "Created At", sortable: true },
        ]}
        renderAction={(user) => <button onClick={() => alert(user.name)}>Edit</button>}
      />

      <Typography variant="h4">Students Account</Typography>
      <SortableTable
        data={students}
        columns={[
          { key: "name", label: "User Name", sortable: true },
          { key: "email", label: "User Email", sortable: true },
          { key: "deviceToken", label: "Device Token" },
          { key: "role", label: "Role", sortable: true },
          { key: "createdAt", label: "Created At", sortable: true },
        ]}
        renderAction={(user) => <button onClick={() => alert(user.name)}>Edit</button>}
      />
    </div>
  );
};

export default Tables;

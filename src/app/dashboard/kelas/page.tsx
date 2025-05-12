"use client";
import ProgramCard from "@/components/ProgramCard";
import { Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

type item = {
  id: string;
  thumbnail: string;
  title: string;
  deskripsi: string;
  CompanyCode: string;
};
const Page = () => {
  const [kelas, setKelas] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await axios.get("/api/kelas");
    setKelas(res.data);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-black p-5">
      <Typography variant="h4">Kelas Yang Tersedia</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7 ">
        {kelas.map((item: item) => (
          <ProgramCard key={item.id} {...item} buttonText="Lihat Kelas" link={`/dashboard/kelas/${item.CompanyCode}/materi`} />
        ))}
      </div>
    </div>
  );
};

export default Page;

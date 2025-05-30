import { Typography } from "@mui/material";
import React from "react";
import ProgramCard from "./ProgramCard";
import { ProgramCardType } from "@/lib/type";

const ListKelas = ({ kelas }: { kelas: ProgramCardType[] }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-black px-10 py-6">
      <div className="max-w-6xl mx-auto">
        <Typography variant="h4">Kelas Yang Tersedia</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7 ">
          {kelas?.map((item: ProgramCardType) => (
            <ProgramCard key={item?.id} {...item} buttonText="Lihat Kelas" link={`/dashboard/kelas/${item?.CompanyCode}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListKelas;

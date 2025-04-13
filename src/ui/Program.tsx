"use client";
import ProgramSlider from "@/components/ProgramSlider";
import { Typography } from "@mui/material";

const Program = () => {
  return (
    <div className="mt-12 py-20 flex flex-col md:flex-row items-center  md:justify-around gap-5 bg-slate-300 px-[5%]">
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <Typography variant="h4" className="font-roboto font-semibold">
          Belajar Seru, Skill Nambah, Siap Terjun ke Dunia Kerja!
        </Typography>
        <Typography variant="subtitle1" className="font-roboto">
          Gak cuma teori, kita hadirkan kelas dan pelatihan yang langsung nyambung sama jurusan kamu: TKJ, TKR, dan lainnya. Belajar dari mentor berpengalaman dan praktikum yang bikin kamu makin siap jadi ahli!
        </Typography>
      </div>
      <ProgramSlider />
    </div>
  );
};

export default Program;

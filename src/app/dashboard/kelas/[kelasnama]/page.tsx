"use client";
import { PricingCard } from "@/components/PricingCard";
import { Typography } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [materiKelas, setMateriKelas] = useState([]);
  const [kelas, setKelas] = useState([]);
  const { kelasnama } = useParams<{ kelasnama: string }>();
  console.log(materiKelas);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const res = await axios.get(`/api/kelas/${kelasnama}`);
      setKelas(res.data);
      setMateriKelas(res.data.materi);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col pb-10">
      <div className="w-screen h-[50dvh] relative ">
        <Image src={kelas.thumbnail} alt="Hero" width={768} height={512} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-10">
          <Typography variant="h4" className="text-white">
            {kelas.title}
          </Typography>
        </div>
      </div>

      <div className="mt-10 px-[5%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {materiKelas.map((materi: any) => (
          <PricingCard key={materi.id} {...materi} />
        ))}
      </div>
    </div>
  );
};

export default Page;

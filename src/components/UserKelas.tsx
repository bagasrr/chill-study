"use client";

import { useAllKelas } from "@/lib/hooks/useAllKelas";
import ListKelas from "./ListKelas";
import ProgramCard from "./ProgramCard";
import ProgramCardSkeleton from "./Skeleton/ProgramCardSkeleton";
import { useKelasUser } from "@/lib/hooks/useKelasUser";
import { useSession } from "next-auth/react";
import { Skeleton, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

const KelasSaya = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { kelasUser = [], isLoading, error, mutate } = useKelasUser(userId as string);

  const { kelas = [], isLoading: kelasLoading, error: kelasError } = useAllKelas();

  if (isLoading) {
    return (
      <div className="py-10 px-8">
        <div className="mb-8">
          <Skeleton variant="rounded" width={200} height={50} animation="wave" sx={{ mt: 2, background: "gray" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {[...Array(3)].map((_, i) => (
            <ProgramCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!kelasUser || kelasUser.length === 0) {
    return (
      <div>
        <div className="mb-8 p-6">
          <Typography variant="h4" className="font-semibold border-b pb-2 border-slate-300">
            🎓 Kelas Saya
          </Typography>
          <p className="text-lg my-4 ">Anda belum mengambil kelas. Silakan ambil kelas terlebih dahulu.</p>
        </div>
        <ListKelas kelas={kelas} />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen py-10 px-6 md:px-12 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Typography variant="h4" className="font-semibold border-b pb-2 border-slate-300">
            🎓 Kelas Saya
          </Typography>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {kelasUser.map((item: any) => (
            <ProgramCard key={item?.id} {...item.kelas} buttonText="Lihat Kelas" link={`/dashboard/kelas/${item.kelas?.CompanyCode}`} />
          ))}
        </div>

        <div className="mt-10">
          <Link href="/dashboard/kelas" className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all text-sm font-semibold">
            Lihat Kelas Lain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KelasSaya;

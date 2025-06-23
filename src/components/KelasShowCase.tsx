// file: components/KelasShowCase.tsx
"use client";
import React from "react";
import { PricingCard, PricingCardSkeleton } from "./PricingCard";
import { useKelasDetail } from "@/lib/hooks/useKelasDetail";
// import { useMateriList } from "@/lib/hooks/useMateriList"; // Hapus import ini
import Link from "next/link";
import { Skeleton } from "@mui/material";
import { PricingCardProps } from "@/lib/type";
import { useSession } from "next-auth/react";

const KelasShowCase = ({ kelasnama }: { kelasnama: string }) => {
  const { kelas, isLoading, mutate } = useKelasDetail(kelasnama);
  const { data: session } = useSession();

  // const { materiList, isLoading: loadingMateri } = useMateriList(kelas?.id); // Hapus baris ini

  console.log("Kelas Detail : ", kelas);
  // console.log("Materi List : ", materiList); // Hapus baris ini jika tidak lagi diperlukan

  // Ubah kondisi isLoading, tidak perlu loadingMateri lagi
  if (isLoading) {
    // Hapus || loadingMateri
    return (
      <div className="grid grid-cols-1 gap-4 my-10">
        <Skeleton variant="text" width="40%" height={40} sx={{ bgcolor: "#cccccc" }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <PricingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Pastikan kelas dan kelas.materi ada sebelum mencoba mengaksesnya
  if (!kelas || !kelas.materi) {
    return null; // Atau tampilkan pesan "Kelas tidak ditemukan"
  }

  return (
    <div className="grid grid-cols-1 gap-4 my-10">
      {session ? (
        <Link href={`/dashboard/kelas/${kelasnama}`} className="text-2xl font-bold hover:text-sky-500">
          {kelasnama + " - " + kelas?.title}
        </Link>
      ) : (
        <Link href={`/login`} className="text-2xl font-bold hover:text-sky-500">
          {kelasnama + " - " + kelas?.title}
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-clip">
        {/* Gunakan kelas.materi secara langsung */}
        {kelas.materi?.slice(0, 3).map(
          (
            materi: PricingCardProps // Pastikan tipe PricingCardProps sesuai dengan materi dari kelas-detail
          ) => (
            <PricingCard
              key={materi.id}
              id={materi.id}
              title={materi.title}
              price={materi.price}
              link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`}
              canAccess={materi.canAccess} // Ini akan diisi oleh API kelas-detail
              onRefresh={mutate}
              content={materi.content}
              hasProgress={materi.hasProgress} // Ini juga akan diisi oleh API kelas-detail
              CompanyCode={kelas?.CompanyCode}
              kelas={kelas}
            />
          )
        )}
      </div>
    </div>
  );
};

export default KelasShowCase;

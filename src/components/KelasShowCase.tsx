"use client";
import React from "react";
import { PricingCard, PricingCardSkeleton } from "./PricingCard";
import { useKelasDetail } from "@/lib/hooks/useKelasDetail";
import { useMateriList } from "@/lib/hooks/useMateriList";
import Link from "next/link";
import { Skeleton } from "@mui/material";

const KelasShowCase = ({ kelasnama }: { kelasnama: string }) => {
  const { kelas, isLoading, error, mutate } = useKelasDetail(kelasnama);
  const { materiList, isLoading: loadingMateri } = useMateriList(kelas?.id);

  if (isLoading || loadingMateri) {
    return (
      <div className="grid grid-cols-1 gap-4 my-10">
        <Skeleton variant="text" width="40%" height={40} sx={{ bgcolor: "#cccccc" }} />

        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <PricingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 my-10">
      <Link href={`/dashboard/kelas/${kelasnama}/materi`} className="text-2xl font-bold hover:text-sky-500">
        {kelasnama + " - " + kelas?.title}{" "}
      </Link>
      <div className="grid grid-cols-3 gap-4 overflow-clip">
        {materiList?.slice(0, 3).map((materi: any) => (
          <PricingCard
            key={materi.id}
            id={materi.id}
            title={materi.title}
            price={materi.price}
            link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`}
            canAccess={materi.canAccess}
            onRefresh={mutate}
            content={materi.content}
            hasProgress={materi.hasProgress}
            CompanyCode={kelas?.CompanyCode}
            kelas={kelas}
          />
        ))}
      </div>
    </div>
  );
};

export default KelasShowCase;

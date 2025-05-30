// app/dashboard/kelas/[kelasnama]/materi/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { PricingCard } from "@/components/PricingCard";
import CardSkeleton from "@/components/Skeleton/CardSkeleton";
import { PricingCardProps } from "@/lib/type";
import Breadcrumb from "@/components/Breadcrump";
import { Button } from "@mui/material";
import { NavigateBefore } from "@mui/icons-material";

export default function MateriLayout({ children }: { children: React.ReactNode }) {
  const { kelasnama } = useParams<{ kelasnama: string }>();
  const [materiInClass, setMateriInClass] = useState<PricingCardProps[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const res = await axios.get(`/api/kelas/kelas-detail/${kelasnama}`);
        const kelasId = res.data.id;
        const materiRes = await axios.get(`/api/materi/${kelasId}/materi-user`);
        setMateriInClass(materiRes.data);
      } catch (err) {
        console.error("Gagal fetch materi:", err);
      }
    };

    fetchMateri();
  }, [kelasnama]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 px-[5%] py-5">
      <div className="mb-4 w-fit">
        <Button variant="outlined" color="info" onClick={() => router.back()}>
          <NavigateBefore />
          Back
        </Button>
      </div>

      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Kelas", href: "/dashboard/kelas" },
          { label: kelasnama, href: `/dashboard/kelas/${kelasnama}` },
        ]}
      />
      <div className="flex gap-6 h-full">
        {/* Video Detail as children */}
        <div className="w-full md:w-2/3">{children}</div>
        {/* Sidebar Card */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 px-4 py-2">
          <div className="grid grid-cols-1 gap-4 w-full">
            {materiInClass
              ? materiInClass.map((materi) => (
                  <PricingCard
                    key={materi.id}
                    {...materi}
                    link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`}
                    canAccess={materi.canAccess}
                    hasProgress={materi.hasProgress}
                    onRefresh={() => {}} // optional
                  />
                ))
              : [...Array(3)].map((_, idx) => <CardSkeleton key={idx} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

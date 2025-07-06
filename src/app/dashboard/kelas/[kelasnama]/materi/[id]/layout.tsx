"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { NavigateBefore } from "@mui/icons-material";

// Komponen UI
import { PricingCard } from "@/components/PricingCard";
import CardSkeleton from "@/components/Skeleton/CardSkeleton";
import Breadcrumb from "@/components/Breadcrump";
import { PricingCardProps } from "@/lib/type";

// 1. Impor hook yang sudah kita perbaiki
import { useKelasDetail } from "@/lib/hooks/useKelasDetail";

export default function MateriLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { kelasnama } = useParams<{ kelasnama: string }>();
  const { id } = useParams<{ id: string }>();
  const { kelas, isLoading } = useKelasDetail(kelasnama);

  const materiInClass = kelas?.materi;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 px-4 md:px-[5%] py-5">
      {/* Tombol kembali dan Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <Button variant="outlined" color="info" onClick={() => router.back()} className="self-start">
          <NavigateBefore />
          Kembali ke Daftar Materi
        </Button>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Kelas", href: "/dashboard/kelas" },
            { label: kelasnama, href: `/dashboard/kelas/${kelasnama}` },
            { label: "Materi", href: `/dashboard/kelas/${kelasnama}` }, // Sesuaikan jika perlu
          ]}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
        {/* Konten Utama (Halaman detail video/pdf) */}
        <main className="w-full lg:w-2/3">{children}</main>

        {/* Sidebar Daftar Materi */}
        <aside className="w-full lg:w-1/3  lg:sticky lg:top-24">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold border-b pb-2">Daftar Materi di Kelas Ini</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 w-full ">
              {isLoading ? (
                [...Array(3)].map((_, idx) => <CardSkeleton key={idx} />)
              ) : materiInClass && materiInClass.length > 0 ? (
                materiInClass.map((materi: PricingCardProps) => (
                  <PricingCard
                    key={materi.id}
                    {...materi}
                    link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`}
                    canAccess={materi.canAccess}
                    hasProgress={materi.hasProgress}
                    onRefresh={() => {}}
                    isActive={id === materi.id ? true : false}
                  />
                ))
              ) : (
                <p className="text-gray-500">Tidak ada materi lain di kelas ini.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

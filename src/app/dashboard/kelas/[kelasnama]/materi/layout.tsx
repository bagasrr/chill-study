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

  // 2. Gunakan hook untuk mengambil semua data dalam satu panggilan
  // Hook ini sudah menangani state loading, data, dan error.
  const { kelas, isLoading } = useKelasDetail(kelasnama);

  // 3. Data materi diambil langsung dari hasil hook
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

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Konten Utama (Halaman detail video/pdf) */}
        <main className="w-full lg:w-2/3">{children}</main>

        {/* Sidebar Daftar Materi */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-4">
          <h3 className="text-xl font-bold border-b pb-2">Daftar Materi di Kelas Ini</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 w-full">
            {/* 4. Gunakan `isLoading` dari hook untuk menampilkan skeleton */}
            {isLoading ? (
              // Tampilkan skeleton jika sedang loading
              [...Array(3)].map((_, idx) => <CardSkeleton key={idx} />)
            ) : // Jika tidak loading, tampilkan data materi
            materiInClass && materiInClass.length > 0 ? (
              materiInClass.map((materi: PricingCardProps) => (
                <PricingCard
                  key={materi.id}
                  {...materi}
                  link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`}
                  // Properti ini sudah ada di dalam data dari hook
                  canAccess={materi.canAccess}
                  hasProgress={materi.hasProgress}
                  // onRefresh bisa dikosongkan jika tidak ada aksi refresh di sini
                  onRefresh={() => {}}
                />
              ))
            ) : (
              // Tampilkan pesan jika tidak ada materi
              <p className="text-gray-500">Tidak ada materi lain di kelas ini.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

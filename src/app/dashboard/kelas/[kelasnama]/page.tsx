"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// MUI & Icons
import { Skeleton } from "@mui/material";
import { NavigateBefore } from "@mui/icons-material";

// Hooks Kustom (Hanya yang diperlukan)
import { useKelasDetail } from "@/lib/hooks/useKelasDetail";
import { useKelasProgress } from "@/lib/hooks/useKelasProgress";

// Komponen UI
import { KelasProgressInfo } from "@/components/KelasProgressInfo";
import { PricingCard, PricingCardSkeleton } from "@/components/PricingCard";
import Breadcrumb from "@/components/Breadcrump";

// Impor tipe data jika ada di file terpisah, atau definisikan di sini
import { PricingCardProps } from "@/lib/type";
import axios from "axios";
import { useSession } from "next-auth/react";

const KelasDetailPage = () => {
  const router = useRouter();
  const session = useSession();
  const { kelasnama } = useParams<{ kelasnama: string }>();

  // 1. Hanya hook ini yang diperlukan untuk data utama (kelas + materi + akses)
  const { kelas, isLoading: isLoadingKelas, mutate: refreshKelas } = useKelasDetail(kelasnama);
  console.log(kelas);

  // 2. Hook ini tetap untuk mengambil progress persentase kelas
  const { percent, isLoading: isLoadingProgress } = useKelasProgress(kelas?.id);

  // 3. State lokal untuk data sertifikat (tidak berhubungan langsung dengan materi)
  const [sertif, setSertif] = useState<[] | null>(null);
  const [loadingSertif, setLoadingSertif] = useState(true);

  // Effect untuk mengecek status kelulusan/sertifikat
  useEffect(() => {
    // Jangan jalankan jika ID kelas belum tersedia
    if (!kelas?.id) return;

    const checkCertificateStatus = async () => {
      setLoadingSertif(true);
      try {
        const res = await axios.get(`/api/certificate/${kelas.id}`);
        setSertif(res.data);
      } catch (error) {
        // Tidak perlu menampilkan error jika user belum lulus (respons 404)
        console.log("Gagal mengambil data sertifikat atau belum tersedia.", error);
        setSertif(null); // Pastikan state null jika gagal
      } finally {
        setLoadingSertif(false);
      }
    };

    checkCertificateStatus();
  }, [kelas?.id]); // Dijalankan setiap kali data kelas (termasuk ID) berubah

  // Gunakan isLoading dari useKelasDetail sebagai indikator utama untuk daftar materi
  const isLoading = isLoadingKelas;

  return (
    <div className="flex flex-col">
      {/* Bagian Hero Header */}
      <div className="w-screen h-[50dvh] relative">
        {isLoading || !kelas?.thumbnail ? (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        ) : (
          <Image src={kelas.thumbnail} alt={`Thumbnail untuk ${kelas.title}`} fill className="w-full h-full object-cover object-center" priority />
        )}
        <button onClick={() => router.back()} className="absolute py-1 px-3 bottom-5 left-5 z-10 text-white bg-black/30 rounded-md hover:bg-black/50 transition flex items-center justify-start">
          <NavigateBefore />
          Kembali
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-center justify-center p-4">
          <h1 className="text-white text-center font-bold text-3xl md:text-5xl drop-shadow-lg">{isLoading ? <Skeleton width={300} sx={{ bgcolor: "grey.700" }} /> : kelas?.title}</h1>
        </div>

        {kelas?.id && (
          <div className="absolute bottom-5 right-5">
            <KelasProgressInfo percent={percent} isLoading={isLoadingProgress} />
          </div>
        )}
      </div>

      {/* Bagian Konten Utama */}
      <div className="px-4 sm:px-[5%] pt-5 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard/kelas" },
              { label: "Kelas", href: `/dashboard/kelas/` },
              { label: kelasnama, href: `/dashboard/kelas/${kelasnama}` },
            ]}
          />

          {/* Tombol Aksi (Sertifikat/Quiz) */}
          {loadingSertif || isLoadingProgress ? (
            <Skeleton variant="rectangular" width={180} height={40} />
          ) : session.data === null ? null : sertif && sertif.length > 0 ? (
            <Link href={`/dashboard/certificate/${kelas?.id}`} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-md w-full sm:w-auto justify-center">
              🎓 Lihat Sertifikat
            </Link>
          ) : percent === 100 ? (
            <Link href={`/exam/${kelas?.id}`} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md w-full sm:w-auto justify-center">
              🚀 Mulai Ujian Akhir
            </Link>
          ) : (
            <button className="flex items-center gap-2 bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed w-full sm:w-auto justify-center" disabled>
              🚀 Mulai Ujian Akhir
            </button>
          )}
        </div>

        {/* Daftar Materi */}
        <div className="my-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <PricingCardSkeleton key={i} />)
          ) : kelas?.materi?.length > 0 ? (
            // PENTING: Gunakan kelas.materi sebagai sumber data
            kelas.materi.map((materi: PricingCardProps) => (
              <PricingCard
                key={materi.id}
                id={materi.id}
                title={materi.title}
                price={materi.price}
                content={materi.content}
                link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`}
                canAccess={materi.canAccess}
                hasProgress={materi.hasProgress}
                onRefresh={() => refreshKelas()}
                CompanyCode={kelas?.CompanyCode}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 mt-10">
              <h3 className="text-xl font-semibold mb-2">Materi Belum Tersedia</h3>
              <p className="mb-5">Belum ada materi yang ditambahkan untuk kelas ini.</p>
              <Link href="/dashboard/kelas" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 items-center">
                Kembali ke Daftar Kelas
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KelasDetailPage;

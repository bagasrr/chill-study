"use client";

import { useParams } from "next/navigation";
import { useKelasProgress } from "@/lib/hooks/useKelasProgress";
import { CertificatePreview } from "@/components/CertificatePreview";
import { Skeleton } from "@mui/material";
// import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SertifikatPage() {
  const router = useRouter();
  const { kelasId } = useParams();
  const { percent, isLoading } = useKelasProgress(kelasId as string);

  if (isLoading)
    return (
      <div className="h-[90dvh] w-screen p-6 flex gap-5">
        <Skeleton variant="rectangular" width="70%" height="100%" sx={{ bgcolor: "#cccccc" }} />
        <div className="w-[30%] flex flex-col gap-5">
          <Skeleton variant="text" width="100%" height={70} sx={{ bgcolor: "#cccccc" }} />
          <Skeleton variant="rectangular" width="100%" height={150} sx={{ bgcolor: "#cccccc" }} />
        </div>
      </div>
    );
  if (percent < 100) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white border border-red-300 shadow-md rounded-xl p-6 max-w-md text-center space-y-4">
          <p className="text-xl font-semibold text-red-600">Kamu belum menyelesaikan kelas</p>
          <p className="text-gray-600">Selesaikan kelas sekarang untuk mengklaim sertifikat.</p>

          <button onClick={() => router.back()} className="inline-block bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Selesaikan Kelas Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <CertificatePreview kelasId={kelasId as string} />
    </div>
  );
}

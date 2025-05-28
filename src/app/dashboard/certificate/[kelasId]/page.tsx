"use client";

import { useParams } from "next/navigation";
import { useKelasProgress } from "@/lib/hooks/useKelasProgress";
import { CertificatePreview } from "@/components/CertificatePreview";

export default function SertifikatPage() {
  const { kelasId } = useParams();
  const { percent, isLoading } = useKelasProgress(kelasId as string);

  if (isLoading) return <p>Loading...</p>;
  if (percent < 100) return <p className="text-red-500 p-4">Progress belum 100%</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Sertifikat Kamu</h1>
      <CertificatePreview kelasId={kelasId as string} />
    </div>
  );
}

"use client";

import { useKelasDetailById } from "@/lib/hooks/useKelasDetail";
import { Skeleton, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface kelas {
  id: string;
  title: string;
  thumbnail: string;
}

export function CertificatePreview({ kelasId }: { kelasId: string }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { kelas, isLoading, error } = useKelasDetailById(kelasId);

  useEffect(() => {
    const fetchPreview = async () => {
      const url = `/api/certificate/${kelasId}/preview`;
      setPdfUrl(url); // langsung link ke PDF route kita
    };

    fetchPreview();
    // getKelas();
  }, [kelasId]);

  return (
    <div className="flex w-full gap-6 px-[4%]">
      <div className="w-3/4 h-[80vh] border rounded overflow-hidden">{pdfUrl && <iframe src={pdfUrl} className="w-full h-full" title="Preview Sertifikat" />}</div>
      <div className="w-1/4 flex flex-col gap-5">
        {isLoading ? <Skeleton width={300} height={100} sx={{ bgcolor: "#cccccc" }} /> : <Typography variant="h5">{kelas.title}</Typography>}

        <a href={`/api/certificate/${kelasId}/preview`} download={`sertifikat-${kelasId}.pdf`} className="bg-sky-400 hover:bg-sky-800 text-white px-4 py-2 rounded inline-block">
          Download Sertifikat
        </a>
      </div>
    </div>
  );
}

"use client";

import { Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export function CertificatePreview({ kelasId }: { kelasId: string }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [kelas, setKelas] = useState([]);

  console.log({ kelasId, kelas });
  useEffect(() => {
    const fetchPreview = async () => {
      const url = `/api/certificate/preview?kelasId=${kelasId}`;
      setPdfUrl(url); // langsung link ke PDF route kita
    };
    fetchPreview();
    getKelas();
  }, [kelasId]);

  const getKelas = async () => {
    try {
      const res = await axios.get(`/api/${kelasId}/details/kelas`);
      setKelas(res.data);
    } catch (error) {
      console.error("Gagal mengambil data kelas", error);
    }
  };

  return (
    <div className="flex w-full gap-6 px-[4%]">
      <div className="w-3/4 h-[80vh] border rounded overflow-hidden">{pdfUrl && <iframe src={pdfUrl} className="w-full h-full" title="Preview Sertifikat" />}</div>
      <div className="w-1/4 flex flex-col gap-5">
        <Typography variant="h5">{kelas.title}</Typography>
        <a href={`/api/certificate/preview?kelasId=${kelasId}`} download={`sertifikat-${kelasId}.pdf`} className="bg-sky-400 hover:bg-sky-800 text-white px-4 py-2 rounded inline-block">
          Download Sertifikat
        </a>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { ReportPdf } from "@/components/ReportPdf";

export default function AdminLaporanPage() {
  const [data, setData] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/admin/all-progress");
      const json = await res.json();
      console.log(res, json);
      setData(json);
      setReady(true);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Laporan Semua Siswa</h1>

      {ready ? (
        <>
          <PDFViewer style={{ width: "100%", height: "80vh", border: "1px solid #ccc" }}>
            <ReportPdf data={data} />
          </PDFViewer>

          <PDFDownloadLink document={<ReportPdf data={data} />} fileName="laporan-semua-siswa.pdf" className="bg-blue-600 text-white px-4 py-2 rounded inline-block">
            {({ loading }) => (loading ? "Menyiapkan file..." : "Download PDF")}
          </PDFDownloadLink>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

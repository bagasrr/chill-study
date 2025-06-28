// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ReportPdf } from "@/components/ReportPdf";

interface ProgressData {
  namaKelas: string;
  kelasId: string;
  totalMateriContent: number;
  completedMateriContentCount: number;
  progressPercent: number;
}

interface UserData {
  userId: string;
  nama: string | null;
  email: string;
  progress: ProgressData[];
}

interface KelasOverview {
  kelasId: string;
  namaKelas: string;
  averageProgress: number;
  studentsCount: number;
}

interface DashboardData {
  summary: {
    totalStudents: number;
    totalKelasAkses: number;
  };
  studentsData: UserData[];
  kelasProgressOverview: KelasOverview[];
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().toLocaleDateString("id-ID").replaceAll("/", "-");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/dashboard-data");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json: DashboardData = await res.json();
        setDashboardData(json);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-white">
        <p>Memuat data dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 text-center text-white">
        <p>Gagal memuat data dashboard. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  const { summary, studentsData, kelasProgressOverview } = dashboardData;

  return (
    <div className="p-6 space-y-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-black">Dashboard Admin</h1>

      {/* ... (Bagian Ringkasan Data tetap sama) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Siswa Terdaftar</h2>
          <p className="text-4xl font-bold text-blue-400">{summary.totalStudents}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Kelas Diakses</h2>
          <p className="text-4xl font-bold text-green-400">{summary.totalKelasAkses}</p>
        </div>
      </div>

      {/* Chart Progres Rata-rata per Kelas (di halaman dashboard) */}
      <div className="bg-gray-800 p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Progres Rata-rata Siswa per Kelas</h2>
        {kelasProgressOverview && kelasProgressOverview.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kelasProgressOverview} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="namaKelas" stroke="#999" />
              <YAxis stroke="#999" domain={[0, 100]} />
              <Tooltip
                formatter={(value: number) => [`${value}%`, `Rata-rata Progres`]}
                labelFormatter={(label: string) => `Kelas: ${label}`}
                contentStyle={{ backgroundColor: "#333", border: "none", borderRadius: "5px" }}
                itemStyle={{ color: "white" }}
                labelStyle={{ color: "#aaa" }}
              />
              <Legend />
              <Bar dataKey="averageProgress" fill="#8884d8" name="Rata-rata Progres (%)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400">Tidak ada data progres kelas untuk ditampilkan.</p>
        )}
      </div>

      {/* Bagian Laporan PDF */}
      <div className="bg-gray-800 p-5 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Laporan Detail Progres Siswa (PDF)</h2>
        <PDFDownloadLink
          // Meneruskan kedua jenis data ke komponen ReportPdf
          document={<ReportPdf data={studentsData} kelasOverviewData={kelasProgressOverview} />}
          fileName={`laporan-siswa-detail-${currentDate}.pdf`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block text-lg font-medium transition duration-200"
        >
          {({ loading: downloadLoading }) => (downloadLoading ? "Menyiapkan PDF..." : "Download Laporan PDF")}
        </PDFDownloadLink>

        <h3 className="text-lg font-semibold mt-6 mb-2">Pratinjau Laporan</h3>
        <div className="w-full h-[70vh] border border-gray-600 rounded-lg overflow-hidden">
          <PDFViewer style={{ width: "100%", height: "100%" }}>
            {/* Meneruskan kedua jenis data ke komponen ReportPdf */}
            <ReportPdf data={studentsData} kelasOverviewData={kelasProgressOverview} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}

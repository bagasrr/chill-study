"use client";

import { useAllKelas } from "@/lib/hooks/useAllKelas";
import ListKelas from "./ListKelas"; // Pastikan ListKelas menerima prop 'kelas: Kelas[]'
import ProgramCard from "./ProgramCard";
import ProgramCardSkeleton from "./Skeleton/ProgramCardSkeleton";
import { useKelasUser } from "@/lib/hooks/useKelasUser";
import { useSession } from "next-auth/react";
import { Skeleton, Typography } from "@mui/material";
import Link from "next/link";

// --- Definisi Interface Asumsi dari Hooks ---
// Sesuaikan ini jika struktur data yang sebenarnya berbeda
interface Kelas {
  id: string;
  title: string;
  deskripsi: string | null;
  thumbnail: string | null;
  CompanyCode: string | null; // Penting: Pastikan ini ada jika Anda menggunakannya di link
  // Tambahkan bidang lain yang mungkin di-include oleh useAllKelas
}

interface KelasUserType {
  id: string;
  userId: string;
  kelasId: string;
  kelas: Kelas; // Kelas harus disertakan dalam KelasUser
  // Tambahkan bidang lain dari model KelasUser jika diperlukan
}

const KelasSaya = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id; // userId bisa berupa string | undefined

  // useKelasUser mungkin mengembalikan array kosong jika tidak ada data
  // atau undefined/null jika masih loading/error. Kita tangani loading.
  const {
    kelasUser, // kelasUser bisa berupa KelasUserType[] | undefined
    isLoading: isLoadingKelasUser,
    error: kelasUserError, // Tangkap error jika ada dari useKelasUser
  } = useKelasUser(userId as string); // Cast userId as string karena hooks mungkin memerlukannya

  const {
    kelas, // kelas bisa berupa Kelas[] | undefined
    isLoading: isLoadingAllKelas,
    error: allKelasError,
  } = useAllKelas();

  // Gabungkan status loading dari kedua hooks
  const isLoading = isLoadingKelasUser || isLoadingAllKelas;

  // Tangani error secara terpusat
  if (kelasUserError) {
    return <div className="p-6 text-red-500">Error memuat kelas saya: {kelasUserError.message}</div>;
  }
  if (allKelasError) {
    return <div className="p-6 text-red-500">Error memuat semua kelas: {allKelasError.message}</div>;
  }

  // Tampilkan skeleton saat loading
  if (isLoading) {
    return (
      <div className="py-10 px-8">
        <div className="mb-8">
          <Skeleton variant="rounded" width={200} height={50} animation="wave" sx={{ mt: 2, background: "gray" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {[...Array(3)].map((_, i) => (
            <ProgramCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Jika tidak ada kelas yang diambil
  // Pastikan `kelas` tidak undefined sebelum diteruskan ke `ListKelas`
  if (!kelasUser || kelasUser.length === 0) {
    return (
      <div>
        <div className="mb-8 p-6">
          <Typography variant="h4" className="font-semibold border-b pb-2 border-slate-300">
            🎓 Kelas Saya
          </Typography>
          <p className="text-lg my-4 ">Anda belum mengambil kelas. Silakan ambil kelas terlebih dahulu.</p>
        </div>
        {/* Pastikan `kelas` tidak undefined sebelum diteruskan */}
        {kelas && kelas.length > 0 ? <ListKelas kelas={kelas} /> : <p className="p-6">Tidak ada kelas yang tersedia untuk ditampilkan.</p>}
      </div>
    );
  }

  // Render kelas yang diambil
  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen py-10 px-6 md:px-12 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Typography variant="h4" className="font-semibold border-b pb-2 border-slate-300">
            🎓 Kelas Saya
          </Typography>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {kelasUser.map((item: KelasUserType) =>
            // Pastikan item.kelas ada dan CompanyCode tidak null
            item.kelas && item.kelas.CompanyCode ? (
              <ProgramCard
                key={item.id} // Gunakan item.id dari KelasUser sebagai key
                thumbnail={item.kelas.thumbnail || ""} // Berikan string kosong jika null
                title={item.kelas.title}
                deskripsi={item.kelas.deskripsi || ""} // Berikan string kosong jika null
                buttonText="Lihat Kelas"
                link={`/dashboard/kelas/${item.kelas.CompanyCode}`}
              />
            ) : (
              // Opsional: render placeholder atau skip jika data kelas tidak lengkap
              <div key={item.id}>Data kelas tidak lengkap untuk {item.id}</div>
            )
          )}
        </div>

        <div className="mt-10">
          <Link href="/dashboard/kelas" className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all text-sm font-semibold">
            Lihat Kelas Lain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KelasSaya;

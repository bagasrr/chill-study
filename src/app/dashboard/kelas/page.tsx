"use client";
import ListKelas from "@/components/ListKelas";
import ProgramCardSkeleton from "@/components/Skeleton/ProgramCardSkeleton";
import { useAllKelas } from "@/lib/hooks/useAllKelas";
import { Skeleton } from "@mui/material";
import Link from "next/link";

const Page = () => {
  const { kelas, isLoading: loadingKelas } = useAllKelas();

  return (
    <>
      {loadingKelas ? (
        <div className="px-10 py-6">
          <Skeleton variant="rounded" width={200} height={50} animation="wave" sx={{ mt: 2, background: "#cccccc", mb: 5 }} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {[...Array(6)].map((_, i) => (
              <ProgramCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : kelas.length > 0 ? (
        <ListKelas kelas={kelas} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-400 ">
          <p className="text-2xl font-bold">No data here</p>
          <Link href="/" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Kembali ke Home Page
          </Link>
        </div>
      )}
    </>
  );
};

export default Page;

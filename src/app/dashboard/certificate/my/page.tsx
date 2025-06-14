"use client";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { Skeleton } from "@mui/material";
interface Certificate {
  kelas: {
    title: string;
  };
}

const Page = () => {
  const { data: certificate, loading } = useFetchData<Certificate>("/api/certificate/by-id");

  console.log(certificate);
  return (
    <div className="bg-gray-100 min-h-screen pt-5 px-[5%]">
      {loading && <Skeleton width={300} height={100} sx={{ bgcolor: "#cccccc" }} />}
      <p className="text-red-400">{certificate?.kelas.title}</p>
    </div>
  );
};

export default Page;

"use client";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { Skeleton } from "@mui/material";

const Page = () => {
  const { data: certificate, isLoading } = useFetchData("/api/certificate/by-id");

  console.log(certificate);
  return (
    <div className="bg-gray-100 min-h-screen pt-5 px-[5%]">
      {isLoading && <Skeleton width={300} height={100} sx={{ bgcolor: "#cccccc" }} />}
      <p className="text-red-400">{certificate?.kelas.title}</p>
    </div>
  );
};

export default Page;

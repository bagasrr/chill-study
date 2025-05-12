"use client";
import { KelasProgressInfo } from "@/components/KelasProgressInfo";
import { PricingCard, PricingCardSkeleton } from "@/components/PricingCard";
import { NavigateBefore } from "@mui/icons-material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [materiKelas, setMateriKelas] = useState([]);
  const [kelas, setKelas] = useState([]);
  console.log(kelas);
  const [isLoading, setIsLoading] = useState(true); // Tambahin state loading
  const { kelasnama } = useParams<{ kelasnama: string }>();
  const [materiList, setMateriList] = useState([]);

  useEffect(() => {
    getData();
  }, [kelasnama]);

  const getData = async () => {
    try {
      const res = await axios.get(`/api/kelas/${kelasnama}`);
      console.log(res);
      setKelas(res.data);
      setMateriKelas(res.data.materi || []);
      getMateriList(res.data.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Apapun hasilnya, loading selesai
    }
  };

  const getMateriList = async (kelasId: string) => {
    try {
      const res = await axios.get(`/api/materi/${kelasId}/materi-user`);
      console.log(res.data);
      setMateriList(res.data); // berisi materi + canAccess
    } catch (error) {
      console.error("Gagal ambil materi-user:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-screen h-[50dvh] relative">
        <Image src={kelas?.thumbnail} alt="Hero" width={768} height={512} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10 flex items-center justify-center ">
          <p className="text-white text-center font-bold text-5xl">{kelas?.title}</p>
        </div>
        {kelas?.id && (
          <div className="absolute bottom-5 right-5">
            <KelasProgressInfo kelasId={kelas.id} />
          </div>
        )}
      </div>

      <div className="my-5 px-[5%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          // Skeleton kalau masih loading
          Array.from({ length: 3 }).map((_, index) => <PricingCardSkeleton key={index} />)
        ) : materiKelas.length > 0 ? (
          // Data tersedia
          // materiKelas.map((materi: any) => <PricingCard key={materi.id} {...materi} link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`} />)
          materiList.map((materi: any) => <PricingCard key={materi.id} title={materi.title} price={materi.price} link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`} canAccess={materi.canAccess} hasProgress={materi.hasProgress} />)
        ) : (
          // Data kosong
          <div className="col-span-full text-center text-gray-500 mt-5 ">
            <p className="mb-5">No data found</p>

            <Link href={`/dashboard/kelas`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 items-center">
              <NavigateBefore />
              Back to Kelas
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

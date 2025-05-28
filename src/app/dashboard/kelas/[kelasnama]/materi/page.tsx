"use client";
import { KelasProgressInfo } from "@/components/KelasProgressInfo";
import { PricingCard, PricingCardSkeleton } from "@/components/PricingCard";
import { NavigateBefore } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useKelasDetail } from "@/lib/hooks/useKelasDetail";
import { useMateriList } from "@/lib/hooks/useMateriList";
import { PricingCardProps } from "@/lib/type";
import Breadcrumb from "@/components/Breadcrump";
import { useKelasProgress } from "@/lib/hooks/useKelasProgress";

const Page = () => {
  const { kelasnama } = useParams<{ kelasnama: string }>();

  const { kelas, isLoading: loadingKelas } = useKelasDetail(kelasnama);
  const { materiList, isLoading: loadingMateri, mutate: refreshMateri } = useMateriList(kelas?.id);
  const { total, selesai, materiCompleted, percent, isLoading } = useKelasProgress(kelas?.id);

  return (
    <div className="flex flex-col">
      <div className="w-screen h-[50dvh] relative">
        <Image src={kelas?.thumbnail} alt="Hero" width={768} height={512} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10 flex items-center justify-center ">
          <p className="text-white text-center font-bold text-5xl">{kelas?.title}</p>
        </div>

        {kelas?.id && (
          <div className="absolute bottom-5 right-5">
            <KelasProgressInfo percent={percent} isLoading={isLoading} />
          </div>
        )}
      </div>
      <div className="px-[5%] pt-5">
        <div className="flex justify-between ">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard/kelas" },
              { label: "Kelas", href: `/dashboard/kelas/` },
              { label: `${kelasnama}`, href: `/dashboard/kelas/${kelasnama}/materi` },
            ]}
          />
          {/* {percent === 100 ? (
            <Link href={`/dashboard/kelas/${kelasnama}/quiz`} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <NavigateBefore /> Mulai Quiz
            </Link>
          ) : null} */}
          {percent === 100 && (
            <Link href={`/dashboard/certificate/${kelas?.id}`} className={`flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600`}>
              Sertifikat
            </Link>
          )}
        </div>

        <div className="my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loadingKelas || loadingMateri ? (
            Array.from({ length: 3 }).map((_, i) => <PricingCardSkeleton key={i} />)
          ) : materiList.length > 0 ? (
            materiList.map((materi: PricingCardProps) => (
              <PricingCard
                key={materi.id}
                id={materi.id}
                title={materi.title}
                price={materi.price}
                content={materi.content}
                link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`}
                canAccess={materi.canAccess}
                hasProgress={materi.hasProgress}
                onRefresh={() => refreshMateri()}
                CompanyCode={materi?.kelas?.CompanyCode}
                kelas={materi?.kelas}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 mt-5">
              <p className="mb-5">No data found</p>
              <Link href={`/dashboard/kelas`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 items-center">
                <NavigateBefore />
                Back to Kelas
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

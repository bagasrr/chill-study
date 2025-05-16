"use client";
import VideoPlayer from "@/components/MediaPlayer/VideoPlayer";
import { PricingCard } from "@/components/PricingCard";
import CardSkeleton from "@/components/Skeleton/CardSkeleton";
import VideoSkeleton from "@/components/Skeleton/VideoSkeleton";
import { completeProgress, saveProgress } from "@/lib/api/progress";
import { PricingCardProps } from "@/lib/type";
import { Typography } from "@mui/material";
import { Materi } from "@prisma/client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { kelasnama, id } = useParams<{ kelasnama: string; id: string }>();
  const [materiDetail, setMateriDetails] = useState<Materi>();
  const [materiInClass, setMateriInClass] = useState<[]>();

  const getMateriInClass = async () => {
    try {
      const res = await axios.get(`/api/kelas/${kelasnama}`);
      getMateriList(res.data.id);
      // setMateriInClass(res.data.materi || []);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
  const getMateriList = async (kelasId: string) => {
    try {
      const res = await axios.get(`/api/materi/${kelasId}/materi-user`);
      console.log(res.data);
      setMateriInClass(res.data); // berisi materi + canAccess
    } catch (error) {
      console.error("Gagal ambil materi-user:", error);
    }
  };

  const getMateriDetails = async () => {
    try {
      const res = await axios.get(`/api/${id}/details/materi`);
      setMateriDetails(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMateriDetails();
    getMateriInClass();
  }, [kelasnama, id]);

  useEffect(() => {
    const save = async () => {
      try {
        const res = await saveProgress(id);

        if (res?.data?.need_payment) {
          alert(`Materi ini berbayar (${res.data.materiPrice} IDR). Silakan lakukan pembayaran untuk mengakses.`);
          // Optional redirect:
          // router.push(`/payment/kelas/${res.data.kelasId}`);
          return;
        }
      } catch (err) {
        console.error("Gagal simpan progress:", err);
      }
    };

    save();
  }, [id]);

  const onEnd = () => {
    completeProgress(id).catch((err: React.SetStateAction<unknown>) => console.error("Gagal update complete:", err));
  };

  return (
    <div>
      <p>Tes</p>
      <div className="flex flex-col md:flex-row gap-6 py-2 md:px-8 md:py-4 bg-gray-50 min-h-screen text-gray-900">
        {/* Video Section */}

        <div className="w-full md:w-2/3 ">
          {materiDetail ? (
            <>
              <VideoPlayer videoId={materiDetail.videoUrl || ""} onEnd={onEnd} />

              <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: "1rem", mx: "1rem", fontSize: { lg: "1.5rem", xs: "1rem" } }}>
                {materiDetail.title}
              </Typography>
            </>
          ) : (
            <VideoSkeleton />
          )}
        </div>

        {/* Sidebar Section */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 px-4 py-2">
          <div className="grid grid-cols-1 gap-4 w-full">
            {materiInClass
              ? materiInClass.map((materi: PricingCardProps) => (
                  <PricingCard key={materi.id} {...materi} link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`} canAccess={materi.canAccess} hasProgress={materi.hasProgress} onRefresh={getMateriInClass} />
                ))
              : [...Array(3)].map((_, index) => <CardSkeleton key={index} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

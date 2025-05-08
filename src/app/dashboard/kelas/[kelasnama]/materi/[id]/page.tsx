"use client";
import VideoPlayer from "@/components/MediaPlayer/VideoPlayer";
import { PricingCard } from "@/components/PricingCard";
import CardSkeleton from "@/components/Skeleton/CardSkeleton";
import VideoSkeleton from "@/components/Skeleton/VideoSkeleton";
import { Avatar, Typography } from "@mui/material";
import axios from "axios";
import { get } from "http";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { kelasnama, id } = useParams<{ kelasnama: string; id: string }>();
  const [materiDetail, setMateriDetails] = useState();
  const [materiInClass, setKelasDetails] = useState();

  const getMateriInClass = async () => {
    try {
      const res = await axios.get(`/api/kelas/${kelasnama}`);
      setKelasDetails(res.data.materi || []);
    } catch (error) {
      console.error(error);
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

  console.log({ materiInClass });
  return (
    <div className="flex gap-6 px-8 py-4 bg-gray-50 min-h-screen text-gray-900">
      {/* Video Section */}
      <div className="w-2/3">
        {materiDetail ? (
          <>
            <VideoPlayer videoId={materiDetail.videoUrl} />
            <div className="flex gap-5 items-center align-middle mt-5">
              <Avatar alt={materiDetail?.author?.name || ""} src={materiDetail?.author?.image || ""} />
              <Typography variant="h6">{materiDetail.title}</Typography>
            </div>
          </>
        ) : (
          <VideoSkeleton />
        )}
      </div>

      {/* Sidebar Section */}
      <div className="w-1/3 flex flex-col gap-4 px-4 py-2">
        <div className="grid grid-cols-1 gap-4 w-full">
          {materiInClass ? materiInClass.map((materi: any) => <PricingCard key={materi._id} {...materi} link={`/dashboard/kelas/${kelasnama}/materi/${materi.id}`} />) : [...Array(3)].map((_, index) => <CardSkeleton key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default Page;

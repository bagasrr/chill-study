// app/dashboard/kelas/[kelasnama]/materi/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Typography, Skeleton } from "@mui/material";
import VideoPlayer from "@/components/MediaPlayer/VideoPlayer";
import VideoSkeleton from "@/components/Skeleton/VideoSkeleton";
import { completeProgress, saveProgress } from "@/lib/api/progress";
import { Materi } from "@prisma/client";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [materiDetail, setMateriDetails] = useState<Materi>();
  console.log({ materiDetail });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/api/${id}/details/materi`);
        setMateriDetails(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    const save = async () => {
      try {
        const res = await saveProgress(id);
        console.log(res);
        if (res?.data?.need_payment) {
          alert(`Materi ini berbayar (${res.data.materiPrice} IDR). Silakan bayar dulu ya.`);
        }
      } catch (err) {
        console.error("Gagal simpan progress:", err);
      }
    };
    save();
  }, [id]);

  const onEnd = () => completeProgress(id).catch(console.error);

  return (
    <div>
      {materiDetail ? (
        <>
          {materiDetail?.videoUrl ? <VideoPlayer videoId={materiDetail.videoUrl || ""} onEnd={onEnd} /> : <Skeleton variant="rectangular" sx={{ bgcolor: "#cccccc" }} width="100%" height={400} />}

          <Typography variant="h6" className="mt-4 font-bold">
            {materiDetail.title}
          </Typography>
        </>
      ) : (
        <VideoSkeleton />
      )}
    </div>
  );
};

export default Page;

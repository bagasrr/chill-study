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
  const [activeAttachment, setActiveAttachment] = useState<string>("");
  console.log({ materiDetail });
  const MAX_LENGTH = 25;

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
        // ini need
        // if (res?.data?.need_payment) {
        //   alert(`Materi ini berbayar (${res.data.materiPrice} IDR). Silakan bayar dulu ya.`);
        // }
      } catch (err) {
        console.error("Gagal simpan progress:", err);
      }
    };
    save();
  }, [id]);

  const onEnd = () => completeProgress(id).catch(console.error);
  const handleActiveAttachment = (attachment: string) => () => {
    activeAttachment === attachment ? setActiveAttachment("") : setActiveAttachment(attachment);
  };
  return (
    <div>
      {materiDetail ? (
        <div className="flex flex-col gap-5">
          {materiDetail?.videoUrl ? <VideoPlayer videoId={materiDetail.videoUrl || ""} onEnd={onEnd} /> : <Skeleton variant="rectangular" sx={{ bgcolor: "#cccccc" }} width="100%" height={400} />}

          <Typography variant="h6" className="mt-5 font-bold" sx={{ fontWeight: "bold" }}>
            {materiDetail.title}
          </Typography>

          <div className="mt-4">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Attachments
            </Typography>
            <div className="flex gap-3 items-center">
              {materiDetail?.attachments?.map((attachment) => (
                <div
                  key={attachment.id}
                  className={`mt-2 p-5 rounded cursor-pointer bg-green-500 hover:bg-green-800 hover:text-white ${activeAttachment === attachment.link ? "bg-green-800 text-white" : ""}`}
                  onClick={handleActiveAttachment(attachment.link)}
                >
                  <div>{attachment.name.length > MAX_LENGTH ? `${attachment.name.substring(0, MAX_LENGTH)}...` : attachment.name}</div>
                </div>
              ))}
            </div>
            <div className="mt-5">{activeAttachment && <iframe src={activeAttachment} className="w-full h-[80vh] " title="PDF Viewer" />}</div>
          </div>
        </div>
      ) : (
        <VideoSkeleton />
      )}
    </div>
  );
};

export default Page;

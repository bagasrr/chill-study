"use client";
import CardSkeleton from "@/components/Skeleton/CardSkeleton";
import VideoSkeleton from "@/components/Skeleton/VideoSkeleton";
import { Skeleton } from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { kelasnama, id } = useParams<{ kelasnama: string; id: string }>();

  return (
    <div className="flex gap-6 px-8 py-4 bg-gray-50 min-h-screen text-gray-900">
      {/* Video Section */}
      <VideoSkeleton />

      {/* Sidebar Section */}
      <div className="w-1/3 flex flex-col gap-4 px-4 py-2">
        <div className="grid grid-cols-1 gap-4 w-full">
          {[...Array(5)].map((_, index) => (
            // <div key={index} className="p-4 rounded-lg shadow bg-slate-50 flex flex-col gap-3 w-full">
            //   <Skeleton variant="text" width="80%" height={25} sx={{ bgcolor: "#cccccc" }} />
            //   <Skeleton variant="text" width="100%" height={20} sx={{ bgcolor: "#cccccc" }} />
            //   <Skeleton variant="text" width="50%" height={20} sx={{ bgcolor: "#cccccc" }} />
            //   <div className="mt-auto">
            //     <Skeleton variant="rounded" width={120} height={36} sx={{ bgcolor: "#cccccc" }} />
            //   </div>
            // </div>
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;

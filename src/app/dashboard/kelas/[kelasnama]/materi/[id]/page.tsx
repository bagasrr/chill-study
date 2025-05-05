"use client";
import { Skeleton, Avatar } from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { kelasnama, id } = useParams<{ kelasnama: string; id: string }>();
  return (
    <div className="flex gap-6 px-8 py-4 bg-gray-50 min-h-screen text-gray-900">
      {/* Video Section */}
      <div className="flex flex-col w-2/3 gap-4">
        {/* Video Player Skeleton */}
        <Skeleton variant="rectangular" className="rounded-lg" sx={{ bgcolor: "#cccccc" }} width="100%" height={400} />
        {/* Video Title */}
        <Skeleton variant="text" width="80%" height={40} sx={{ bgcolor: "#cccccc" }} />
        {/* Channel Info */}
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" sx={{ bgcolor: "#cccccc" }}>
            <Avatar />
          </Skeleton>
          <div className="flex flex-col gap-1">
            <Skeleton variant="text" width={120} height={20} sx={{ bgcolor: "#cccccc" }} />
            <Skeleton variant="text" width={80} height={15} sx={{ bgcolor: "#cccccc" }} />
          </div>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="w-1/3 flex flex-col gap-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton variant="rectangular" sx={{ bgcolor: "#cccccc" }} width={160} height={90} className="rounded" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton variant="text" width="90%" height={20} sx={{ bgcolor: "#cccccc" }} />
              <Skeleton variant="text" width="70%" height={15} sx={{ bgcolor: "#cccccc" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

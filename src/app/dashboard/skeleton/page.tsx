"use client";
import { Skeleton } from "@mui/material";
import React from "react";

const LearningSkeleton = () => {
  // Misalnya ada 6 skeleton card
  // const skeletonCards = Array(6).fill(0);

  return (
    <div className="px-8 py-4 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* {skeletonCards.map((_, index) => ( */}
        <div className="p-4 rounded-lg shadow bg-white flex flex-col gap-3">
          <Skeleton variant="text" width="80%" height={25} sx={{ bgcolor: "#cccccc" }} />
          <Skeleton variant="text" width="100%" height={20} sx={{ bgcolor: "#cccccc" }} />
          <Skeleton variant="text" width="50%" height={20} sx={{ bgcolor: "#cccccc" }} />
          <div className="mt-auto">
            <Skeleton variant="rounded" width={120} height={36} sx={{ bgcolor: "#cccccc" }} />
          </div>
        </div>
        {/* ))} */}
      </div>
    </div>
  );
};

export default LearningSkeleton;

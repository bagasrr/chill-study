"use client";
import { Skeleton } from "@mui/material";
import React from "react";

const CardSkeleton = () => {
  return (
    <div className="p-4 rounded-lg shadow bg-slate-50 flex flex-col gap-3 w-full">
      <Skeleton variant="text" width="80%" height={25} sx={{ bgcolor: "#cccccc" }} />
      <Skeleton variant="text" width="100%" height={20} sx={{ bgcolor: "#cccccc" }} />
      <Skeleton variant="text" width="50%" height={20} sx={{ bgcolor: "#cccccc" }} />
      <div className="mt-auto">
        <Skeleton variant="rounded" width={120} height={36} sx={{ bgcolor: "#cccccc" }} />
      </div>
    </div>
  );
};

export default CardSkeleton;

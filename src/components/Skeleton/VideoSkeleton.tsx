import { Avatar, Skeleton } from "@mui/material";
import React from "react";

const VideoSkeleton = () => {
  return (
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
  );
};

export default VideoSkeleton;

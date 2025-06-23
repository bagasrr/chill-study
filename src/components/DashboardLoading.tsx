// src/app/dashboard/loading.tsx
"use client"; // Pastikan ini client component karena pakai Skeleton dari Material UI

import { Skeleton, Box } from "@mui/material"; // Impor Skeleton di sini

export default function DashboardLoading() {
  return (
    <Box className="bg-slate-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="border rounded-xl p-4 shadow-md bg-white flex flex-col justify-around w-[400px]">
        <Skeleton variant="rounded" width="100%" height={200} animation="wave" sx={{ mt: 2, background: "gray" }} />
        <Skeleton variant="text" animation="wave" sx={{ mt: 2, background: "gray" }} />
        <Skeleton variant="text" animation="wave" sx={{ mt: 2, background: "gray" }} />
        <Skeleton variant="rectangular" width="100%" height={40} className="mt-3 rounded-lg" sx={{ bgcolor: "grey.300" }} />
      </div>
    </Box>
  );
}

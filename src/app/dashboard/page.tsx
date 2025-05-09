import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Skeleton, Typography } from "@mui/material";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="bg-slate-100 min-h-screen p-5">
      <div className=" text-black p-5 rounded-lg shadow-md">
        <Typography variant="h4" className="font-roboto font-semibold">
          Kelas Saya
        </Typography>
        <div className="flex mt-7 gap-5 items-center">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-slate-300 px-4 py-2 rounded-md">
      <Skeleton variant="rounded" width={200} height={200} animation="wave" sx={{ mt: 2, background: "white" }}></Skeleton>
      <Skeleton variant="text" animation="wave" sx={{ mt: 2, background: "white" }} />
      <Skeleton variant="text" animation="wave" sx={{ mt: 2, background: "white" }} />
    </div>
  );
};

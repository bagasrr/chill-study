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
    <div>
      <div className="bg-white text-black p-5 rounded-lg shadow-md">
        <Typography variant="h4" className="font-roboto font-semibold">
          Kelas Saya
        </Typography>
        <div className="flex mt-7 gap-5 items-center">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

export const CardSkeleton = () => {
  return (
    <div className="bg-slate-300 px-4 py-2 rounded-md">
      <Skeleton variant="rounded" width={200} height={200} animation="wave" sx={{ mt: 2, background: "gray" }}></Skeleton>
      <Skeleton variant="text" animation="wave" sx={{ mt: 2, background: "gray" }} />
      <Skeleton variant="text" animation="wave" sx={{ mt: 2, background: "gray" }} />
    </div>
  );
};

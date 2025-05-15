import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Skeleton } from "@mui/material";
import UserKelas from "@/components/UserKelas";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <UserKelas />;
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

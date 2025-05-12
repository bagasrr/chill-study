import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Skeleton, Typography } from "@mui/material";
import UserKelas from "@/components/UserKelas";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen py-10 px-6 md:px-12 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Typography variant="h4" className="font-semibold border-b pb-2 border-slate-300">
            🎓 Kelas Saya
          </Typography>
        </div>

        <UserKelas userId={session.user.id} />

        <div className="mt-10">
          <Link href="/dashboard/kelas" className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all text-sm font-semibold">
            Lihat Kelas Lain
          </Link>
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

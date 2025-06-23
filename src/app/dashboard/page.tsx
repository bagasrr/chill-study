// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
// import { Skeleton } from "@mui/material"; // Tidak perlu diimpor di sini jika Skeleton ada di UserKelas atau loading.tsx
import UserKelas from "@/components/UserKelas"; // Ini harus jadi 'use client' component

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Jika UserKelas adalah komponen client yang menangani loading-nya sendiri:
  return <UserKelas />;
}

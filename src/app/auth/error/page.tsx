"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  DeviceActive: "Akun ini sedang aktif di perangkat lain.",
  AccessDenied: "Akses ditolak. Akun tidak diizinkan.",
  Configuration: "Konfigurasi login salah.",
  default: "Terjadi kesalahan saat login.",
};

export default function ErrorPage() {
  const params = useSearchParams();
  const errorCode = params.get("error");
  const message = errorMessages[errorCode || ""] || errorMessages.default;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-slate-800 text-black dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Login Error</h1>
      <p className="text-lg text-center max-w-md">{message}</p>
      <Link href="/login" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Kembali ke Login
      </Link>
    </div>
  );
}

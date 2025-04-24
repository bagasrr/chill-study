"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toastError } from "@/lib/toastUtils";

export default function ToastHandler() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const router = useRouter();

  useEffect(() => {
    if (error === "not-admin") {
      toastError("Akses ditolak 🚫");

      // Bersihin URL agar nggak nge-trigger lagi
      router.replace("/");
    }
  }, [error, router]);

  return null;
}

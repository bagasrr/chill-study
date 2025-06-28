// app/login/page.tsx
"use client"; // Keep this, as LoginPage also uses useRouter and useSession

import { useSession } from "next-auth/react";
import { useEffect, Suspense } from "react"; // Import Suspense
import { useRouter } from "next/navigation";
import LoginForm from "@/ui/LoginForm";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-slate-800 bg-white">
      {/* Wrap LoginForm with Suspense */}
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

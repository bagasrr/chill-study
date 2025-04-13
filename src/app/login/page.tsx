"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/ui/LoginForm";

export default function LoginPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 bg-white">
      <LoginForm />
    </div>
  );
}

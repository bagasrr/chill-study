import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  console.log("session: ", session);
  if (session?.user?.role === "STUDENT") {
    redirect("/?error=not-admin");
  }

  return (
    <>
      <div>
        <AdminNavbar />
        <div className="pt-20 md:pt-24 bg-gray-100 dark:bg-gray-800 min-h-screen">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default layout;

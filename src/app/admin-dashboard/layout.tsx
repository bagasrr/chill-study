import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";

import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
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

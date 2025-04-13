import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div>
        <Navbar />
        <div className="pt-20 md:pt-28 px-[5%] bg-gray-100 dark:bg-gray-800 min-h-screen text-black dark:text-white">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default layout;

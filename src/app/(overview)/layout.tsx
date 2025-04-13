import Navbar from "@/components/Navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 md:pt-28">{children}</div>
      </div>
    </>
  );
};

export default layout;

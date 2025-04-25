"use client";

import { Toaster } from "react-hot-toast";

export default function CustomToast() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          fontSize: "14px",
        },
      }}
    />
  );
}

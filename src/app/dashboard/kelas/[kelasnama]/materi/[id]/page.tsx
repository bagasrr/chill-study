"use client";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { kelasnama, id } = useParams<{ kelasnama: string; id: string }>();
  return (
    <div>
      <h1>Ini Halaman Kelas {kelasnama}</h1>
      <h1>Ini Halaman Materi {id}</h1>
    </div>
  );
};

export default Page;

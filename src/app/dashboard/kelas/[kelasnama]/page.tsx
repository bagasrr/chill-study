"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const res = await axios.get("/api/kelas");
    console.log(res.data);
  };
  const { kelasnama } = useParams<{ kelasnama: string }>();
  return (
    <div>
      <h1>Ini Halaman Kelas {kelasnama}</h1>
    </div>
  );
};

export default Page;

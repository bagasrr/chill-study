"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProgramCard from "./ProgramCard";
import ProgramCardSkeleton from "./Skeleton/ProgramCardSkeleton";
import Link from "next/link";
import Image from "next/image";

const UserKelas = ({ userId }: { userId: string }) => {
  const [kelasUser, setKelasUser] = useState([]);
  useEffect(() => {
    getUserKelas();
  }, []);

  const getUserKelas = async () => {
    try {
      const res = await axios.get(`/api/kelas-user/${userId}`);
      setKelasUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {kelasUser.length > 0
        ? kelasUser.map((item: any) => <ProgramCard key={item.id} {...item.kelas} buttonText="Lihat Kelas" link={`/dashboard/kelas/${item.kelas.CompanyCode}/materi`} />)
        : [...Array(3)].map((_, i) => <ProgramCardSkeleton key={i} />)}
    </div>
  );
};

export default UserKelas;

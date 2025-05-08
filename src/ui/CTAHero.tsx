"use client";
// pages/pricing.tsx
import React, { useEffect, useState } from "react";
import { PricingCard } from "@/components/PricingCard";
import axios from "@/lib/axios";
import Link from "next/link";

type Materi = {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  createdAt: Date;
  price: number;
  CreatedBy: string;
  LastUpdatedBy: Date;
  LastUpdateDate: Date;
  kelas: {
    title: string;
    CompanyCode: string;
  };
};

const CTAHero = () => {
  const [dataTKJ, setDataTKJ] = useState([]);
  const [dataTKR, setDataTKR] = useState([]);

  useEffect(() => {
    getMateriTKJ();
    getMateriTKR();
  }, []);

  const getData = async (kelas: string) => {
    const res = await axios.get("/api/materi", {
      params: {
        limit: 3,
        kelas, // <-- disini!
      },
    });
    return res.data;
  };

  const getMateriTKJ = async () => {
    const data = await getData("Teknik Komputer Jaringan");
    setDataTKJ(data);
  };

  const getMateriTKR = async () => {
    const data = await getData("Teknik Kendaraan Ringan");
    setDataTKR(data);
  };

  console.log({ dataTKJ, dataTKR });

  return (
    <div className="min-h-screen bg-gray-100 px-[5%] py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">📚 Belajar TKJ & TKR Jadi Lebih Mudah!</h1>
        <p className="text-gray-600 mt-2">Mulai dari 10.000 aja, akses materi berkualitas dari mentor profesional. Belajar praktis, cocok buat kamu yang pengen jago di dunia kerja!</p>
      </header>

      <section className="mb-10 text-center">
        <Link href="/dashboard/kelas/" className="mr-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          🔍 Lihat Materi Gratis
        </Link>
        <Link href={"/dashboard/kelas/"} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          🚀 Mulai Belajar Sekarang
        </Link>
      </section>

      <section className="mb-10">
        <Link href="/dashboard/kelas/TKJ/materi" className="text-2xl font-semibold text-gray-800">
          TKJ - Teknik Komputer dan Jaringan
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
          {dataTKJ && dataTKJ.map((materi: Materi) => <PricingCard key={materi.id} title={materi.title} price={materi.price} description={materi.content} link={`dashboard/kelas/${materi.kelas.CompanyCode}/materi/${materi.id}`} />)}
        </div>
      </section>

      <section className="mb-10">
        <Link href="/dashboard/kelas/TKR/materi" className="text-2xl font-semibold text-gray-800 ">
          TKR - Teknik Kendaraan Ringan
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
          {dataTKR && dataTKR.map((materi: Materi) => <PricingCard key={materi.id} title={materi.title} price={materi.price} description={materi.content} link={`/dashboard/kelas/${materi.kelas.CompanyCode}/materi`} />)}
        </div>
      </section>

      <section className="text-center py-10 px-6 bg-yellow-100 rounded-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-2">🎁 GRATIS! 2 Materi Pertama Buat Kamu yang Baru Gabung!</h3>
        <p className="text-gray-600 mb-4">Mulai dari yang gratis, lanjut ke yang pro. Gak usah ragu!</p>
        <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">👇 Akses Materi Gratis</button>
      </section>
    </div>
  );
};

export default CTAHero;

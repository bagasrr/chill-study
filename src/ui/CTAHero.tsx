// pages/pricing.tsx
import React from "react";
import { PricingCard } from "@/components/PricingCard";

const CTAHero = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-[5%] py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">📚 Belajar TKJ & TKR Jadi Lebih Mudah!</h1>
        <p className="text-gray-600 mt-2">Mulai dari 10.000 aja, akses materi berkualitas dari mentor profesional. Belajar praktis, cocok buat kamu yang pengen jago di dunia kerja!</p>
      </header>

      <section className="mb-10 text-center">
        <button className="mr-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">🔍 Lihat Materi Gratis</button>
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">🚀 Mulai Belajar Sekarang</button>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">TKJ - Teknik Komputer dan Jaringan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard title="Dasar Jaringan Komputer" price="Gratis" description="Dasar teori jaringan untuk pemula." />
          <PricingCard title="Instalasi Sistem Operasi Jaringan" price="Rp10.000" description="Panduan instalasi Linux/Windows Server untuk lab sekolah." />
          <PricingCard title="Praktikum Mikrotik Dasar" price="Rp15.000" description="Konfigurasi dasar router Mikrotik untuk jaringan lokal." />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">TKR - Teknik Kendaraan Ringan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard title="Pengenalan Mesin Bensin" price="Gratis" description="Kenali dasar mesin bensin dan komponen pentingnya." />
          <PricingCard title="Tune-Up Mesin Manual" price="Rp10.000" description="Langkah tune-up mesin kendaraan roda dua & empat." />
          <PricingCard title="Sistem Rem dan Suspensi" price="Rp15.000" description="Belajar mekanisme kerja rem dan suspensi secara visual." />
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

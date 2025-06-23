"use client";
// pages/pricing.tsx
import Link from "next/link";
import KelasShowCase from "@/components/KelasShowCase";
import { useAllKelas } from "@/lib/hooks/useAllKelas";
import { useSession } from "next-auth/react";

interface Kelas {
  id: number;
  kelas: string;
  CompanyCode: string;
  materi: [];
}
const CTAHero = () => {
  const { kelas } = useAllKelas();
  console.log(kelas);
  const session = useSession();
  console.log(session);

  return (
    <div className="min-h-screen bg-gray-100 px-[5%] py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">📚 Belajar TKJ & TKR Jadi Lebih Mudah!</h1>
        <p className="text-gray-600 mt-2">Mulai dari 10.000 aja, akses materi berkualitas dari mentor profesional. Belajar praktis, cocok buat kamu yang pengen jago di dunia kerja!</p>
      </header>

      <section className="mb-10 text-center flex gap-2 items-center  justify-center">
        <Link href="/dashboard/kelas/" className="mr-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          🔍 Lihat Materi Gratis
        </Link>
        <Link href={"/dashboard/kelas/"} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          🚀 Mulai Belajar Sekarang
        </Link>
      </section>

      <section className="mb-10">
        {kelas
          ?.filter((kelas: Kelas) => kelas.materi && kelas.materi.length > 0)
          .map((kelas: Kelas) => (
            <KelasShowCase kelasnama={kelas.CompanyCode} key={kelas.id} />
          ))}
      </section>

      <section className="text-center py-10 px-6 bg-yellow-100 rounded-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-2">🎁 GRATIS! 2 Materi Pertama Buat Kamu yang Baru Gabung!</h3>
        <p className="text-gray-600 mb-4">Mulai dari yang gratis, lanjut ke yang pro. Gak usah ragu!</p>
        <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Link href="/dashboard/kelas/">👇 Akses Materi Gratis</Link>
        </button>
      </section>
    </div>
  );
};

export default CTAHero;

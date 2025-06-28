// app/page.tsx
import Hero from "@/ui/Hero";
import Program from "@/ui/Program";
import Navbar from "@/components/Navbar";
import CTAHero from "@/ui/CTAHero";
import Footer from "@/components/Footer";
import ToastHandler from "@/components/ToastHandler";
import { Suspense } from "react"; // Import Suspense

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen">
      <Navbar />
      {/* Wrap ToastHandler with Suspense */}
      <Suspense fallback={null}>
        {/* null because ToastHandler doesn't render anything visually */}
        <ToastHandler />
      </Suspense>
      <div className="pt-24 md:pt-28 bg-gray-100 text-black">
        <Hero />
        <Program />
        <CTAHero />
      </div>
      <Footer />
    </div>
  );
}

import Hero from "@/ui/Hero";
import Program from "@/ui/Program";
import Navbar from "@/components/Navbar";
import CTAHero from "@/ui/CTAHero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen">
      <Navbar />
      <div className="pt-24 md:pt-28 bg-gray-100 text-black">
        <Hero />
        <Program />
        <CTAHero />
      </div>
      <Footer />
    </div>
  );
}

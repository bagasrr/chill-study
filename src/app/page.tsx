// import AuthButton from "@/components/AuthButton";

import Hero from "@/components/Hero";
// import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
      <h2>Hellow</h2>
      {/* <AuthButton /> */}
      <Link href="/dashboard">Otw dashboard</Link>
      <Hero />
    </div>
  );
}

// components/Footer.tsx

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">Just a Chill Study</h2>
          <p className="mt-2 text-sm text-gray-400">Platform pembelajaran interaktif untuk siswa SMK jurusan TKJ dan TKR. Belajar seru, siap kerja!</p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-3 text-white">Navigasi</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/learning" className="hover:underline">
                Program
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                Tentang Kami
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-3 text-white">Kontak</h3>
          <ul className="text-sm space-y-1">
            <li>Email: chillstudy@email.com</li>
            <li>Instagram: @chillstudy</li>
            <li>Alamat: Cikarang, Indonesia</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-500 border-t border-gray-700 pt-4">&copy; {new Date().getFullYear()} Just a Chill Study. All rights reserved.</div>
    </footer>
  );
};

export default Footer;

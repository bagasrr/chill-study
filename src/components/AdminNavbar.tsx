"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthNavbar from "./AuthNavbar";
import { Divider, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // <-- Ambil path aktif
  const { data: session } = useSession();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuItems = [
    { label: "User", href: "#user" },
    { label: "Materi", href: "#materi" },
    { label: "Kelas", href: "#kelas" },
  ];

  return (
    <>
      {/* NAVBAR DESKTOP */}
      <nav className="bg-background text-textPrimary fixed top-0 left-0 w-full z-50 shadow-lg p-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo_navbar.png" alt="Logo" width={60} height={60} />
                <Typography variant="h6">Just a Chill Study</Typography>
              </Link>
            </div>

            {/* Toggle Button (Mobile) */}
            <div className="lg:hidden">
              <button onClick={toggleMenu} className="focus:outline-none text-textPrimary hover:text-linkHover transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Menu (Large Screens) */}
            <div className="hidden lg:flex items-center space-x-6">
              <Stack direction="row" spacing={2} alignItems="center" divider={<Divider orientation="vertical" flexItem />}>
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={index} href={item.href} className={`transition  font-medium px-2 py-1 rounded-md  ${isActive ? " text-primary  ease-out duration-300" : "hover:text-linkHover"}`}>
                      {item.label}
                    </Link>
                  );
                })}
                {session && (
                  <Link href="/admin-dashboard" className={`transition font-medium px-2 py-1 rounded-md hover:text-linkHover ${pathname ? "text-primary ease-out duration-300" : ""}`}>
                    Dashboard
                  </Link>
                )}
                <AuthNavbar />
              </Stack>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-surface text-textPrimary transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:hidden z-50 shadow-lg shadow-primary/20`}>
        <div className="p-6 flex flex-col space-y-4">
          <button onClick={closeMenu} className="self-end text-primary text-2xl hover:text-linkHover transition">
            ✕
          </button>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={index} href={item.href} onClick={closeMenu} className={`text-lg transition rounded-md px-2 py-1 ${isActive ? "bg-primary text-white" : "hover:text-primary"}`}>
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-textSecondary">
            <AuthNavbar />
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeMenu} />}
    </>
  );
};

export default AdminNavbar;

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Stack, Typography } from "@mui/material"; // Removed Divider as it's not strictly needed for simplification
import AuthNavbar from "./AuthNavbar"; // Assuming this is another component
import { DropdownButtonNavbar } from "./DropdownButtonNavbar";

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { label: "Home", href: "/" },
    // You can add more main navigation items here
  ];

  const dashboardDropdownItems = [
    { label: "Admin Dashboard", href: "/admin-dashboard" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Report", href: "/report" },
  ];

  return (
    <>
      {/* 
    Tambah Komen admin navbar di sini 01 jul 2025 */}
      {/* DESKTOP & MOBILE NAV */}
      <nav className="bg-background text-textPrimary fixed top-0 left-0 w-full z-50 shadow-lg p-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="text-xl font-bold">
              <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                <Image src="/logo_navbar.png" alt="Logo" width={60} height={60} />
                <Typography variant="h6" className="hidden sm:block">
                  Just a Chill Study
                </Typography>{" "}
                {/* Hide on small mobile */}
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden">
              <button onClick={toggleMobileMenu} className="focus:outline-none text-textPrimary hover:text-linkHover transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Desktop Menu Items */}
            <div className="hidden lg:flex items-center space-x-6">
              <Stack direction="row" spacing={4} alignItems="center">
                {" "}
                {/* Increased spacing for better look without divider */}
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} className={`transition font-medium px-2 py-1 rounded-md ${isActive ? "text-primary ease-out duration-300" : "hover:text-linkHover"}`}>
                      {item.label}
                    </Link>
                  );
                })}
                {/* Desktop Dropdown */}
                <div className="group">
                  {" "}
                  {/* Crucial for the desktop hover effect */}
                  <DropdownButtonNavbar title="Dashboard" items={dashboardDropdownItems} />
                </div>
                <AuthNavbar />
              </Stack>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEMENU */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-surface text-textPrimary transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:hidden z-50 shadow-lg shadow-primary/20`}>
        <div className="p-6 flex flex-col space-y-4">
          <button onClick={closeMobileMenu} className="self-end text-primary text-2xl hover:text-linkHover transition">
            ✕
          </button>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={closeMobileMenu} className={`text-lg transition rounded-md px-2 py-1 ${isActive ? "bg-primary text-white" : "hover:text-primary"}`}>
                {item.label}
              </Link>
            );
          })}
          {/* Mobile Dropdown */}
          <DropdownButtonNavbar title="Dashboard" items={dashboardDropdownItems} closeMobileMenu={closeMobileMenu} /> {/* Pass closeMobileMenu for mobile dropdown items */}
          <div className="pt-4 border-t border-textSecondary">
            <AuthNavbar />
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeMobileMenu} />}
    </>
  );
};

export default AdminNavbar;

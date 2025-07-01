// components/DropdownButtonNavbar.tsx
import React, { useState } from "react";
import Link from "next/link";

// Define an interface for a single item in the dropdown
interface DropdownItem {
  label: string;
  href: string;
}

// Define an interface for the props of the DropdownButtonNavbar component
interface DropdownButtonNavbarProps {
  title: string;
  items: DropdownItem[];
  closeMobileMenu?: () => void; // Optional prop for closing the mobile menu
}

export const DropdownButtonNavbar: React.FC<DropdownButtonNavbarProps> = ({ title, items, closeMobileMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <div className="transition font-medium px-2 py-1 rounded-md cursor-pointer text-linkHover lg:cursor-default" onClick={toggleDropdown}>
        {title}
      </div>

      {/* Dropdown Content */}
      <div
        className={`
          absolute sm:top-0 lg:top-full sm:-right-20 lg:left-0 bg-green-700 shadow-lg border border-gray-200 z-50 min-w-[150px]
          lg:group-hover:block lg:hidden
          ${isOpen ? "block" : "hidden"}
        `}
      >
        {items.map(
          (
            item // Use item.href directly as key
          ) => (
            <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm hover:bg-green-900" onClick={handleItemClick}>
              {item.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
};

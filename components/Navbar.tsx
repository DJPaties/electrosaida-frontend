"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react"; // You can replace with any icon library

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-gray-300 text-white px-6 py-4 flex items-center justify-between h-[100px] rounded-lg m-6 sticky top-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-4 h-full">
        <div className="flex items-center h-full gap-2 w-full">
          <div className="h-full flex items-center">
            <Image
              src="/assets/logos/icon_no_white_edges.png"
              alt="ElectroSaida Icon"
              width={60}
              height={60}
              className="object-contain h-full w-auto mb-4"
              priority
            />
          </div>
          <div className="flex items-center h-full w-2/4">
            <Image
              src="/assets/logos/slogan_no_white_edges.png"
              alt="ElectroSaida Slogan"
              width={160}
              height={40}
              className="object-contain h-full w-auto"
              priority
            />
          </div>
        </div>
      </Link>

      {/* Search Bar */}
      <div className="relative  w-100">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 rounded-md text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#242B91] focus:border-transparent"
        />
      </div>

      {/* Cart */}
      <div className="relative ml-12">
        <Link href="/cart" className="text-xl">
          🛒
        </Link>
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
          3
        </span>
      </div>
    </nav>
  );
}

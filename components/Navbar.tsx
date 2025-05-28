"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react"; // You can replace with any icon library
import CartModal from "./CartModal"; // Adjust path if needed
import { useCart } from "./CartContext"; // Adjust the path if needed

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>

      <nav
        className={`bg-gray-300 text-white px-4 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between h-auto sm:h-[100px] rounded-lg sticky top-0 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"
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
            <div className="hidden md:flex items-center h-full w-2/4">
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
        <div className="relative flex-1 max-w-xs sm:max-w-md lg:max-w-lg mx-4">
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
        <div className="relative ml-12 md:mr-12 sm:mr-4">
          <button onClick={toggleCart} className="text-xl">
            🛒
          </button>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
              {totalItems}
            </span>
          )}
        </div>
      </nav>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

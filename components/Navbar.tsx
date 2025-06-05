"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Search, User } from "lucide-react";
import CartModal from "./CartModal";
import { useCart } from "./CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dropdownFixed, setDropdownFixed] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const isLoggedIn = true; // Replace later with real auth

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

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(e.target as Node)
      ) {
        setShowUserDropdown(false);
        setDropdownFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when route changes (e.g. clicking a link)
  useEffect(() => {
    setShowUserDropdown(false);
    setDropdownFixed(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`bg-gray-300 text-white px-4 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between h-auto sm:h-[100px] rounded-lg sticky top-0 z-50 transition-transform duration-300 ${
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

        {/* Right Icons */}
        <div className="flex items-center gap-6 relative">
          {/* User Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => !dropdownFixed && setShowUserDropdown(true)}
            onMouseLeave={() => !dropdownFixed && setShowUserDropdown(false)}
          >
            <button
              ref={iconRef}
              onClick={() => {
                setDropdownFixed((prev) => !prev);
                setShowUserDropdown(true);
              }}
              className="text-black hover:text-yellow-600 transition"
            >
              <User size={24} />
            </button>

            {showUserDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-md rounded-md py-2 z-50"
              >
                {!isLoggedIn ? (
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  >
                    Log in
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        alert("Logging out...");
                        setDropdownFixed(false);
                        setShowUserDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Log out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative">
            <button onClick={toggleCart} className="text-xl">
              🛒
            </button>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

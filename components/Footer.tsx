"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-gradient-to-r from-white via-gray-200 to-blue-300 text-gray-900 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Logo and Contact Info */}
        <div>
          <div className="mb-4">
            <Image
              src="/assets/logos/icon_no_white_edges.png"
              alt="ElectroSaida Logo"
              width={150}
              height={80}
              className="mb-2"
            />
          </div>
          <p className="text-sm mb-1">Lebanon, Saida</p>
          <p className="text-sm mb-4">+961 71109468</p>
          <div className="flex space-x-4 text-xl text-gray-800">
            <Link href="https://instagram.com" target="_blank">
              <FaInstagram className="hover:text-pink-500 transition" />
            </Link>
            <Link href="https://wa.me/96171109468" target="_blank">
              <FaWhatsapp className="hover:text-green-500 transition" />
            </Link>
            <Link href="mailto:electrosaida@gmail.com">
              <FaEnvelope className="hover:text-yellow-500 transition" />
            </Link>
          </div>
        </div>

        {/* Column 2: Pages */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Pages</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "About Us", "Products", "Categories"].map((page, i) => (
              <li key={i}>
                <Link
                  href={`/${page === "Home" ? "" : page.toLowerCase().replace(" ", "-")}`}
                  className="transition hover:text-yellow-600 hover:drop-shadow-md"
                >
                  {page}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Policies */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Policies</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/refund-policy" className="hover:text-yellow-600 hover:drop-shadow-md transition">Refund Policy</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-yellow-600 hover:drop-shadow-md transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-yellow-600 hover:drop-shadow-md transition">Terms and Conditions</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Form */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact Us</h3>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Your email"
              className="bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Message"
              rows={3}
              className="bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white text-sm py-2 rounded"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-xs text-gray-700 mt-10">
        © {new Date().getFullYear()} ElectroSaida. All rights reserved.
      </div>
    </footer>
  );
}

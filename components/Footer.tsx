"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";

export default function Footer() {
  // State for contact form
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!userInput.email || !userInput.message) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceID || !templateID || !userID) {
        throw new Error("EmailJS configuration is missing");
      }

      // Send email
      await emailjs.send(
        serviceID,
        templateID,
        {
          to_email: "electrosaida@gmail.com", // Fixed recipient
          from_name: userInput.name || "Anonymous",
          from_email: userInput.email,
          message: userInput.message
        },
        userID
      );

      // Success handling
      toast.success("Message sent successfully!");
      setUserInput({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Email sending failed:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <footer className="w-full mt-auto bg-gradient-to-r from-white via-gray-200 to-blue-300 text-gray-900 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
        {/* Column 1: Logo and Contact Info */}
        <div className="space-y-4 flex flex-col items-center sm:items-start">
          <div className="w-32 mx-auto sm:mx-0">
            <Image
              src="/assets/logos/icon_no_white_edges.png"
              alt="ElectroSaida Logo"
              width={150}
              height={80}
              className="object-contain"
            />
          </div>
          <p className="text-sm">Lebanon, Saida</p>
          <p className="text-sm">+961 71109468</p>
          <div className="flex justify-center sm:justify-start space-x-4 text-2xl text-gray-800">
            <Link href="https://instagram.com" target="_blank" className="hover:text-pink-500 transition-colors">
              <FaInstagram />
            </Link>
            <Link href="https://wa.me/96171109468" target="_blank" className="hover:text-green-500 transition-colors">
              <FaWhatsapp />
            </Link>
            <Link href="mailto:electrosaida@gmail.com" className="hover:text-yellow-500 transition-colors">
              <FaEnvelope />
            </Link>
          </div>
        </div>

        {/* Column 2: Pages */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="font-semibold text-lg mb-4">Pages</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "About Us", "Products", "Categories"].map((page, i) => (
              <li key={i}>
                <Link
                  href={`/${page === "Home" ? "" : page.toLowerCase().replace(" ", "-")}`}
                  className="block hover:text-yellow-600 hover:drop-shadow-md transition-colors"
                >
                  {page}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Policies */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="font-semibold text-lg mb-4">Policies</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/refund-policy" className="block hover:text-yellow-600 hover:drop-shadow-md transition-colors">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="block hover:text-yellow-600 hover:drop-shadow-md transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="block hover:text-yellow-600 hover:drop-shadow-md transition-colors">
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-3 w-full max-w-xs sm:max-w-none"
          >
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={userInput.name}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              value={userInput.email}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={3}
              required
              value={userInput.message}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm py-2 rounded"
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
// pages/terms.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-800">
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/assets/logos/icon_no_white_edges.png"
          alt="ElectroSaida Logo"
          width={100}
          height={100}
        />
        <h1 className="text-3xl sm:text-4xl font-bold mt-4 text-center text-blue-800">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-sm text-gray-500">Please read carefully before using our website</p>
      </div>

      <div className="space-y-6 text-base leading-7">
        <h2 className="text-xl font-semibold text-blue-700">1. Introduction</h2>
        <p>Welcome to ElectroSaida. By using our website, you agree to the following terms and conditions.</p>

        <h2 className="text-xl font-semibold text-blue-700">2. Orders & Payments</h2>
        <p>All orders are subject to availability and confirmation. Prices are in USD unless stated otherwise. Payments are processed securely.</p>

        <h2 className="text-xl font-semibold text-blue-700">3. Intellectual Property</h2>
        <p>All content including product images, text, and logos are the property of ElectroSaida.</p>

        <h2 className="text-xl font-semibold text-blue-700">4. Limitation of Liability</h2>
        <p>We are not liable for any indirect or incidental damages resulting from the use of our services.</p>

        <h2 className="text-xl font-semibold text-blue-700">5. Contact</h2>
        <p>Have questions? Contact us at <Link href="mailto:electrosaida@gmail.com" className="text-blue-600 underline">electrosaida@gmail.com</Link>.</p>
      </div>
    </main>
  );
}
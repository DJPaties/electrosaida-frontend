// pages/privacy-policy.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">Your privacy matters to us</p>
      </div>

      <div className="space-y-6 text-base leading-7">
        <p>We value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and store your data.</p>

        <h2 className="text-xl font-semibold text-blue-700">Information We Collect</h2>
        <ul className="list-disc pl-5">
          <li>Your name and contact details</li>
          <li>Email, address, phone number</li>
          <li>Product orders and communication history</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-700">How We Use Your Information</h2>
        <p>We use your data to process orders, provide customer support, and improve our services. We do not sell your data to third parties.</p>

        <h2 className="text-xl font-semibold text-blue-700">Your Rights</h2>
        <p>You have the right to access, update, or delete your personal data. To do so, please contact us.</p>

        <p>Contact us at <Link href="mailto:electrosaida@gmail.com" className="text-blue-600 underline">electrosaida@gmail.com</Link> with any concerns.</p>
      </div>
    </main>
  );
}

// pages/refund-policy.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function RefundPolicy() {
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
          Refund Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">Effective as of {new Date().getFullYear()}</p>
      </div>

      <div className="space-y-6 text-base leading-7">
        <p>
          At ElectroSaida, we strive to ensure our customers are satisfied with every purchase. If you are not entirely happy with your order, we’re here to help.
        </p>

        <h2 className="text-xl font-semibold text-blue-700">Return Period</h2>
        <p>Returns are accepted within 7 days of purchase. To be eligible, the product must be unused and in its original packaging.</p>

        <h2 className="text-xl font-semibold text-blue-700">Non-Returnable Items</h2>
        <p>Custom 3D printed products and opened electronic components are not eligible for return unless defective.</p>

        <h2 className="text-xl font-semibold text-blue-700">Refunds</h2>
        <p>Once your return is received and inspected, we will notify you about the status. If approved, your refund will be processed to your original payment method within 5–7 business days.</p>

        <p>If you have any questions, feel free to contact us at <Link href="mailto:electrosaida@gmail.com" className="text-blue-600 underline">electrosaida@gmail.com</Link>.</p>
      </div>
    </main>
  );
}
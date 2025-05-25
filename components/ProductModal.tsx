"use client";

import React from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";

interface ProductModalProps {
  id: string;
  name: string;
  image: string;
  description?: string;
  price: number;
  inStock: boolean;
  onClose: () => void;
}

export default function ProductModal({
  name,
  image,
  description,
  price,
  inStock,
  onClose,
}: ProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white max-w-md w-full rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="relative w-48 h-48 mb-4">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain rounded"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="mt-2 text-gray-600 text-sm">{description || "No description available."}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-lg font-semibold text-blue-600">${price.toFixed(2)}</span>
            <span
              className={`text-sm font-medium ${
                inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

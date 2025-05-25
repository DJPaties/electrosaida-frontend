"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiEye, FiShoppingCart } from "react-icons/fi";
import ProductModal from "./ProductModal";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage: string;
  inStock: boolean;
  description?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  hoverImage,
  inStock,
  description,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative w-full h-64 overflow-hidden">
          {/* Main image */}
          <Image
            src={image}
            alt={name}
            fill
            sizes="small"
            className={`object-contain absolute transition-opacity duration-500 ease-in-out ${hovered ? "opacity-0" : "opacity-100"}`}
          />
          {/* Hover image */}
          <Image
            src={hoverImage}
            alt={name}
            fill
            sizes="small"
            className={`object-contain absolute transition-opacity duration-500 ease-in-out ${hovered ? "opacity-100" : "opacity-0"}`}
          />

          {/* Hover Buttons */}
          <div
            className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              className="p-2 bg-gray-100 rounded-full shadow hover:bg-yellow-400 transition-colors"
              onClick={() => setModalOpen(true)}
            >
              <FiEye className="text-xl text-blue-600" />
            </button>
            <button className="p-2 bg-gray-100 rounded-full shadow hover:bg-yellow-400 transition-colors">
              <FiShoppingCart className="text-xl text-blue-600" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{name}</h3>
          <div className="flex items-center justify-center mt-2 gap-2">
            <span className="text-blue-600 font-bold text-lg">${price.toFixed(2)}</span>
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

      {/* Modal */}
      {modalOpen && (
        <ProductModal
          id={id}
          name={name}
          image={image}
          description={description}
          price={price}
          inStock={inStock}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

// Updated ProductCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiEye, FiShoppingCart } from "react-icons/fi";
import ProductModal from "./ProductModal";
import Link from "next/link";
import { useCart } from "./CartContext";
import { toast } from "react-hot-toast";


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
  const { addToCart } = useCart();
 const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, image, quantity: 1 });
    toast.success("Added to cart!");
  };

  return (
    <>
      <Link
        href={`/products/${id}`}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition relative cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="small"
            className={`object-contain absolute transition-opacity duration-500 ease-in-out ${hovered ? "opacity-0" : "opacity-100"}`}
          />
          <Image
            src={hoverImage}
            alt={name}
            fill
            sizes="small"
            className={`object-contain absolute transition-opacity duration-500 ease-in-out ${hovered ? "opacity-100" : "opacity-0"}`}
          />

          {/* Hover Buttons */}
          <div
            className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"} hidden md:flex`}
          >
            <button
              className="p-2 bg-gray-100 rounded-full shadow hover:bg-yellow-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalOpen(true);
              }}
            >
              <FiEye className="text-xl text-blue-600" />
            </button>
            <button
              className="p-2 bg-gray-100 rounded-full shadow hover:bg-yellow-400 transition-colors"
              onClick={handleAddToCart}
            >
              <FiShoppingCart className="text-xl text-blue-600" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-center mt-2 gap-2 flex-wrap">
          <span className="text-blue-600 font-bold text-lg">${price.toFixed(2)}</span>
          <span className={`text-sm font-medium ${inStock ? "text-green-600" : "text-red-500"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </span>

          <div className="flex gap-2 ml-4 md:hidden">
            <button
              className="p-2 bg-gray-100 rounded-full shadow hover:bg-yellow-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalOpen(true);
              }}
            >
              <FiEye className="text-xl text-blue-600" />
            </button>
            <button
              className="p-2 bg-gray-100 rounded-full shadow hover:bg-yellow-400 transition-colors"
              onClick={handleAddToCart}
            >
              <FiShoppingCart className="text-xl text-blue-600" />
            </button>
          </div>
        </div>
      </Link>

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

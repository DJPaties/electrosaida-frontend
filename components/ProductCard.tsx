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
  {/* Image & overlay area */}
  <div className="relative w-full h-64 overflow-hidden">
    {/* Product Images */}
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

    {/* Stock Label */}
    <div className="absolute top-2 left-2 z-20">
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
        {inStock ? "In Stock" : "Out of Stock"}
      </span>
    </div>

    {/* Hover Action Buttons */}
    <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
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

  {/* Product Details */}
  <div className="flex flex-col items-center justify-center gap-2 px-4 py-4">
    <h3 className="text-center font-semibold text-gray-800 line-clamp-1">{name}</h3>
    <span className="text-blue-600 font-bold text-lg">${price.toFixed(2)}</span>
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

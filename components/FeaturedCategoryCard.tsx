"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/interfaces";

interface FeaturedCategoryCardProps {
  category: Category;
}

export default function FeaturedCategoryCard({ category }: FeaturedCategoryCardProps) {
  // You can use the category prop to dynamically set the image and text

  const API = process.env.NEXT_PUBLIC_API_URL;


  return (
    <Link href={`/products?category=${encodeURIComponent(typeof category === "string" ? category : category.title ?? category.title)}`}
     className="relative group overflow-hidden rounded-xl shadow-lg w-full h-full">
      <Image
        src={`${API}/${category.image}`} // Replace with your image path
        alt={category.title ?? "Category Image"}
        fill
        className="object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
      <div className="absolute bottom-6 left-6 text-white z-10">
        <h2 className="text-3xl font-bold">{category.title}</h2>
        <p className="text-sm mt-1">{category.subTitle}</p>
      </div>
    </Link>
  );
}

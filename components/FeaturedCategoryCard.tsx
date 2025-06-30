"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/interfaces";

interface FeaturedCategoryCardProps {
  category: Category;
}

export default function FeaturedCategoryCard() {
  // You can use the category prop to dynamically set the image and text

  return (
    <Link href="/categories/arduino" className="relative group overflow-hidden rounded-xl shadow-lg w-full h-full">
      <Image
        src="/assets/category/ArduinoClose.webp" // Replace with your image path
        alt="Arduino Components"
        fill
        className="object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
      <div className="absolute bottom-6 left-6 text-white z-10">
        <h2 className="text-3xl font-bold">Arduino Components</h2>
        <p className="text-sm mt-1">Everything you need for your next hardware project</p>
      </div>
    </Link>
  );
}

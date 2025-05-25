"use client";

import FeaturedCategoryCard from "@/components/FeaturedCategoryCard";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const images = [
  "/assets/banner/banner1.webp",
  "/assets/banner/banner2.webp",
  "/assets/banner/banner3.webp",
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => setCurrent(index);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : (e as any).clientX;
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : (e as any).clientX;
    touchEndX.current = clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) setCurrent((prev) => (prev + 1) % images.length);
    else if (diff < -50) setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const slideContent = [
    {
      title: "Ready to start your project!",
      subtitle: "",
      button: { text: "Shop Now", href: "/products" },
    },
    {
      title: "You want it now? We deliver!",
      subtitle: "Special Offer: Delivery to LIU – Saida University is FREE!",
      button: null,
    },
    {
      title: "Browse Our Featured Categories!",
      subtitle: "",
      button: { text: "Explore", href: "/categories" },
    },
  ];

  return (
    <main className="w-full pt-6 pb-10">
      {/* 🌄 Carousel */}
      <div
        className="relative w-full h-[500px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Image
              src={src}
              alt={`Banner ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 flex flex-col justify-center items-start px-10 text-black bg-black/10">
              <h2 className="text-4xl font-bold drop-shadow-lg max-w-[600px]">
                {slideContent[index].title}
              </h2>
              {slideContent[index].subtitle && (
                <p className="mt-2 text-lg font-medium drop-shadow-sm">
                  {slideContent[index].subtitle}
                </p>
              )}
              {slideContent[index].button && (
                <Link
                  href={slideContent[index].button.href}
                  className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md text-lg font-semibold shadow hover:bg-yellow-400 hover:text-black transition-all duration-300 cursor-pointer"
                >
                  {slideContent[index].button.text}
                </Link>
              )}
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-6 w-full flex justify-center items-center gap-3 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-500 h-2 rounded-full ${current === index
                ? "w-8 bg-blue-600"
                : "w-2 bg-gray-400 hover:bg-blue-400"
                } cursor-pointer`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 🏷️ Label + Gap */}
      <div className="my-10 px-4 justify-center text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Arduino Essentials</h2>
      </div>

      {/* 🧩 Featured Section */}
      {/* 🧩 Featured Section */}
      {/* 🧩 Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4 items-stretch">
        {/* Left: Big Category Card */}
        <div className="lg:col-span-2 flex justify-center items-center">
          <FeaturedCategoryCard />
        </div>

        {/* Right: Product Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ProductCard
            id="1"
            name="Arduino Uno R3"
            price={12.99}
            image="/assets/products/Arduino-Uno-R3.jpg"
            hoverImage="/assets/products/Arduino-Uno-R3-hover.jpg"
            inStock={true}
            description="Classic board for beginners and pros."
          />
          <ProductCard
            id="2"
            name="Nano V3.0"
            price={9.5}
            image="/assets/products/arduino-nano-v3.0.webp"
            hoverImage="/assets/products/arduino-nano-v3.0-hover.webp"
            inStock={true}
          />
          <ProductCard
            id="3"
            name="Breadboard Power Supply"
            price={3.2}
            image="/assets/products/Arduino-Uno-R3.jpg"
            hoverImage="/assets/products/Arduino-Uno-R3-hover.jpg"
            inStock={false}
          />
          <ProductCard
            id="4"
            name="Jumper Wires 40pcs"
            price={1.5}
            image="/assets/products/Male-Female_Wires.webp"
            hoverImage="/assets/products/Male-Female-Wires-hover.webp"
            inStock={true}
          />
        </div>
      </section>



      {/* 📦 See More Button */}
      <div className="text-center mt-6">
        <Link
          href="/categories/arduino"
          className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-yellow-400 hover:text-black transition rounded-lg shadow font-medium"
        >
          See More
        </Link>
      </div>

      {/* 🚚 Special Offer Ticker */}
      <div className="mt-12 overflow-hidden bg-blue-100 py-3">
        <div className="animate-marquee whitespace-nowrap text-center text-blue-900 font-semibold text-lg">
          <span className="inline-block mx-10">
            🚚 Delivery in Saida Available!
          </span>
          <span className="inline-block mx-10">
            🎓 Free Delivery To LIU – Saida University!
          </span>
          <span className="inline-block mx-10">
            🚚 Delivery in Saida Available!
          </span>
          <span className="inline-block mx-10">
            🎓 Free Delivery To LIU – Saida University!
          </span>
          <span className="inline-block mx-10">
            🚚 Delivery in Saida Available!
          </span>
          <span className="inline-block mx-10">
            🎓 Free Delivery To LIU – Saida University!
          </span>
          <span className="inline-block mx-10">
            🚚 Delivery in Saida Available!
          </span>
          <span className="inline-block mx-10">
            🎓 Free Delivery To LIU – Saida University!
          </span>
          <span className="inline-block mx-10">
            🚚 Delivery in Saida Available!
          </span>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </main>
  );
}

"use client";

import FeaturedCategoryCard from "@/components/FeaturedCategoryCard";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
  "/assets/banner/banner1.webp",
  "/assets/banner/banner2.webp",
  "/assets/banner/banner3.webp",
];

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

  const horizontalProducts = [
    {
      id: "5",
      name: "ESP32 Dev Board",
      price: 14.99,
      image: "/assets/products/esp32.jpg",
      hoverImage: "/assets/products/esp32-hover.jpg",
      inStock: true,
    },
    {
      id: "6",
      name: "OLED 0.96'' Display",
      price: 4.5,
      image: "/assets/products/oled.jpg",
      hoverImage: "/assets/products/oled-hover.jpg",
      inStock: true,
    },
    {
      id: "7",
      name: "DHT11 Temperature Sensor",
      price: 2.99,
      image: "/assets/products/dht11.jpg",
      hoverImage: "/assets/products/dht11-hover.jpg",
      inStock: true,
    },
    {
      id: "8",
      name: "Servo Motor SG90",
      price: 1.99,
      image: "/assets/products/sg90.jpg",
      hoverImage: "/assets/products/sg90-hover.jpg",
      inStock: true,
    },
  ];

  return (
    <main className="w-full pt-6">
      {/* 📂 Categories Section */}
      <section className="px-4 mb-6">
        <div className="flex gap-4 overflow-x-auto pb-2 justify-center items-center">
          {[
            "Sensors",
            "Displays",
            "Arduino Boards",
            "Wires & Connectors",
            "Passive Components",
          ].map((category) => (
            <Link
              key={category}
              href={`/categories/${encodeURIComponent(
                category.toLowerCase().replace(/ /g, "-")
              )}`}
              className="flex-shrink-0 px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-yellow-300 transition whitespace-nowrap"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg max-w-[90%] md:max-w-[600px]">
                {slideContent[index].title}
              </h2>
              {slideContent[index].subtitle && (
                <p className="mt-2 text-sm sm:text-base md:text-lg font-medium drop-shadow-sm">
                  {slideContent[index].subtitle}
                </p>
              )}
              {slideContent[index].button && (
                <Link
                  href={slideContent[index].button.href}
                  className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md text-lg font-semibold shadow hover:bg-yellow-400 hover:text-black transition-all duration-300"
                >
                  {slideContent[index].button.text}
                </Link>
              )}
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 w-full flex justify-center items-center gap-3 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-500 h-2 rounded-full ${current === index ? "w-8 bg-blue-600" : "w-2 bg-gray-400 hover:bg-blue-400"
                } cursor-pointer`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 🏷️ Label */}
      <div className="my-10 px-4 justify-center text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Arduino Essentials</h2>
      </div>

      {/* 🧩 Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4 items-stretch">
        <div className="lg:col-span-2 flex justify-center items-center">
          <FeaturedCategoryCard />
        </div>
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

      {/* 📦 See More */}
      <div className="text-center mt-6">
        <Link
          href="/categories/arduino"
          className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-yellow-400 hover:text-black transition rounded-lg shadow font-medium"
        >
          See More
        </Link>
      </div>

      {/* 🚚 Ticker */}
      <div className="mt-12 mb-12 overflow-hidden bg-blue-100 py-3">
        <div className="animate-marquee whitespace-nowrap text-center text-blue-900 font-semibold text-lg">
          <span className="inline-block mx-10">🚚 Delivery in Saida Available!</span>
          <span className="inline-block mx-10">🎓 Free Delivery To LIU – Saida University!</span>
          <span className="inline-block mx-10">🚚 Delivery in Saida Available!</span>
          <span className="inline-block mx-10">🎓 Free Delivery To LIU – Saida University!</span>
        </div>
      </div>

      {/* 🔻 Divider */}
      <div className="px-4 my-14">
        <hr className="border-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-center text-gray-800">Featured Picks</h2>
      </div>

      {/* 🌀 Swiper Carousel */}

      <section className="px-4 py-6 bg-white">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            // when window width ≥ 640px
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // when window width ≥ 768px
            768: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            // when window width ≥ 1024px
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          className="mx-auto"
        >
          {horizontalProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="mx-auto max-w-[250px]">
                <ProductCard {...product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 🏆 Why Choose Us Section */}
      <section
        className="relative bg-cover bg-center text-white py-20 px-4"
        style={{ backgroundImage: "url('/assets/banner/why-chose-us.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <p className="uppercase text-sm tracking-widest text-yellow-400 mb-2">
            Professional Team Support
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Why Choose ElectroSaida?
          </h2>
          <p className="text-lg mb-12 text-gray-200">
            Your trusted electronics partner in Lebanon
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Expert Guidance</h3>
              <p className="text-sm text-gray-200">
                Get professional advice for your electronics and robotics projects.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-200">
                We offer same to one day shipping across all Saida.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Responsive Support</h3>
              <p className="text-sm text-gray-200">
                We're available 7 days a week on WhatsApp to assist you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎞 Animation Styles */}
      <style jsx>{`
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
    :global(.swiper-pagination) {
      bottom: -5px !important;
    }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </main>
  );
}

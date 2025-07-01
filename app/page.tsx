"use client";

import FeaturedCategoryCard from "@/components/FeaturedCategoryCard";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ModelingShowcase from "@/components/ModelingShowcase";
// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { Product, Category } from "@/types/interfaces";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
  "/assets/banner/banner1.webp",
  "/assets/banner/Banner2.webp",
  "/assets/banner/banner3.webp",
];

const slideContent = [
  {
    title: "Ready to start your project!",
    subtitle: "",
    button: { text: "Shop Now", href: "/products" },
  },
  {
    title: "Bring Your Ideas to Life!",
    subtitle: "We can design and 3D print your custom parts.",
    button: null,
  },
  {
    title: "Browse Our Featured Categories!",
    subtitle: "",
    button: { text: "Explore", href: "/products" },
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [featuredCategory1, setFeaturedCategory1] = useState<Category | null>(null);
  const [featuredCategory2, setFeaturedCategory2] = useState<Category | null>(null);
  const [featuredProducts1, setFeaturedProducts1] = useState<Product[]>([]);
  const [featuredProducts2, setFeaturedProducts2] = useState<Product[]>([]);
  const [featuredSwiperProducts, setFeaturedSwiperProducts] = useState<Product[]>([]);


  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const API = process.env.NEXT_PUBLIC_API_URL;
  // Define categories for the homepage from api 
  const [homepageCategories, setHomepageCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${API}/category`),
          fetch(`${API}/product`)
        ]);

        const categories = await catRes.json();
        const products = await prodRes.json();

        if (Array.isArray(categories)) {
          setHomepageCategories(categories);

          if (categories.length >= 2) {
            // 🔹 Pick 2 distinct random categories
            const shuffled = [...categories].sort(() => 0.5 - Math.random());
            const cat1 = shuffled[0];
            const cat2 = shuffled.find((c) => c.id !== cat1.id) || null;

            setFeaturedCategory1(cat1);
            setFeaturedCategory2(cat2);

            const productsCat1 = products.filter((p: Product) => p.categoryId === cat1.id);
            const productsCat2 = cat2 ? products.filter((p: Product) => p.categoryId === cat2.id) : [];

            setFeaturedProducts1([...productsCat1].sort(() => 0.5 - Math.random()).slice(0, 4));
            setFeaturedProducts2([...productsCat2].sort(() => 0.5 - Math.random()).slice(0, 4));
          }
        }

        if (Array.isArray(products)) {
            setFeaturedSwiperProducts([...products].sort(() => 0.5 - Math.random()).slice(0, 8));

        }

      } catch (err) {
        console.error("❌ Failed to fetch data", err);
      }
    };

    fetchCategoriesAndProducts();
  }, [API]);




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


  return (
    <main className="w-full pt-6">
      {/* 📂 Categories Section */}
      <div className="flex gap-4 overflow-x-auto pb-2 justify-center items-center">
        {homepageCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.title)}`}
            className="flex-shrink-0 px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-yellow-300 transition whitespace-nowrap"
          >
            {category.title}
          </Link>
        ))}
      </div>

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
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Products</h2>
      </div>

      {/* 🧩 First Featured Section */}
      {featuredCategory1 && (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4 items-stretch my-10">
          <div className="lg:col-span-2 flex justify-center items-center">
            <FeaturedCategoryCard category={featuredCategory1} />
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featuredProducts1.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}






      {/* 📦 See More */}
      <div className="text-center mt-6">
        <Link
          href={`/products?category=${featuredCategory1?.title}`}
          className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-yellow-400 hover:text-black transition rounded-lg shadow font-medium"
        >
          See More
        </Link>
      </div>

      {/* 🚚 Ticker */}
      <div className="mt-12 mb-12 overflow-hidden bg-blue-100 py-3 text-black">
        <div className="marquee">
          <div className="marquee-content whitespace-nowrap">
            <span className="inline-block mx-10">🚚 Delivery in Saida Available!</span>
            <span className="inline-block mx-10">🎓 Free Delivery To LIU – Saida University!</span>
            <span className="inline-block mx-10">🚚 Delivery in Saida Available!</span>
            <span className="inline-block mx-10">🎓 Free Delivery To LIU – Saida University!</span>
          </div>
          <div className="marquee-content whitespace-nowrap">
            <span className="inline-block mx-10">🚚 Delivery in Saida Available!</span>
            <span className="inline-block mx-10">🎓 Free Delivery To LIU – Saida University!</span>
            <span className="inline-block mx-10">🚚 Delivery in Saida Available!</span>
            <span className="inline-block mx-10">🎓 Free Delivery To LIU – Saida University!</span>
          </div>
        </div>
      </div>

      {/* 🧩 Second Featured Section (Different Category) */}
      {featuredCategory2 && (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4 items-stretch my-10">
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featuredProducts2.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="lg:col-span-2 flex justify-center items-center">
            <FeaturedCategoryCard category={featuredCategory2} />
          </div>
        </section>
      )}
      {/* 📦 See More */}
      <div className="text-center mt-6">
        <Link
          href={`/products?category=${featuredCategory2?.title}`}
          className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-yellow-400 hover:text-black transition rounded-lg shadow font-medium"
        >
          See More
        </Link>
      </div>
      {/* 🎨 3D Modeling Showcase */}
      <ModelingShowcase />



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
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="mx-auto"
        >
          {featuredSwiperProducts.map((product) => (

              <SwiperSlide key={product.id}>
                <div className="mx-auto">
                  <ProductCard product={product} />
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
  .marquee {
    display: flex;
    overflow: hidden;
    position: relative;
  }

  .marquee-content {
    display: flex;
    animation: marquee 15s linear infinite;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  :global(.swiper-pagination) {
    bottom: -5px !important;
  }
`}</style>

    </main>
  );
}

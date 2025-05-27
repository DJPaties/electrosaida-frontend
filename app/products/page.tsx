"use client";

import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const mockProducts = [
  {
    id: "1",
    name: "ESP32 Dev Board",
    price: 15.99,
    image: "/images/esp32-main.jpg",
    hoverImage: "/images/esp32-hover.jpg",
    inStock: true,
    description: "Wi-Fi + Bluetooth development board perfect for IoT projects.",
    category: "Microcontrollers",
  },
  {
    id: "2",
    name: "Ultrasonic Sensor",
    price: 4.99,
    image: "/images/ultrasonic-main.jpg",
    hoverImage: "/images/ultrasonic-hover.jpg",
    inStock: false,
    description: "Measure distance with precision using ultrasonic waves.",
    category: "Sensors",
  },
  {
    id: "3",
    name: "L298N Motor Driver",
    price: 7.5,
    image: "/images/motor-driver-main.jpg",
    hoverImage: "/images/motor-driver-hover.jpg",
    inStock: true,
    description: "Dual H-Bridge driver for controlling DC motors and stepper motors.",
    category: "Modules",
  },
  {
    id: "4",
    name: "Arduino UNO R3",
    price: 10.99,
    image: "/images/arduino-main.jpg",
    hoverImage: "/images/arduino-hover.jpg",
    inStock: true,
    description: "Classic Arduino board for all kinds of DIY electronics.",
    category: "Microcontrollers",
  },
  {
    id: "5",
    name: "IR Obstacle Sensor",
    price: 2.5,
    image: "/images/ir-sensor-main.jpg",
    hoverImage: "/images/ir-sensor-hover.jpg",
    inStock: true,
    description: "Detect obstacles and edges easily using IR technology.",
    category: "Sensors",
  }
];

const categories = ["All", "Microcontrollers", "Sensors", "Modules"];
const sortOptions = ["Default", "Price: Low to High", "Price: High to Low", "Name: A-Z", "Name: Z-A"];

export default function ProductPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState(false);
  const [sortOption, setSortOption] = useState("Default");
  const [priceRange, setPriceRange] = useState([0, 20]);

  let filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesStock = stockFilter ? product.inStock : true;
    const withinPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesStock && withinPrice;
  });

  switch (sortOption) {
    case "Price: Low to High":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "Price: High to Low":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "Name: A-Z":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "Name: Z-A":
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  return (
    <div className="py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 px-4">Our Products</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4 w-full bg-white rounded-xl shadow p-4 border border-gray-200 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter</h2>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded text-black shadow-sm focus:ring focus:ring-blue-200"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded text-black shadow-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-gray-700 mb-4">
            <input
              type="checkbox"
              checked={stockFilter}
              onChange={(e) => setStockFilter(e.target.checked)}
            />
            In Stock Only
          </label>

          <label className="block text-gray-700 font-medium mb-2">Sort By</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded text-black shadow-sm"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <label className="block text-gray-700 font-medium mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
          <Slider
            range
            min={0}
            max={20}
            defaultValue={priceRange}
            onChange={(value) => setPriceRange(value as number[])}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4 w-full px-4">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  hoverImage={product.hoverImage}
                  inStock={product.inStock}
                  description={product.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

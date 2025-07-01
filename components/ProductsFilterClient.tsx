"use client";

import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Slider from "rc-slider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Product, Category } from "@/types/interfaces";

import "rc-slider/assets/index.css";



const sortOptions = ["Default", "Price: Low to High", "Price: High to Low", "Name: A-Z", "Name: Z-A"];

export default function ProductPage() {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState(false);
  const [sortOption, setSortOption] = useState("Default");
  const [priceRange, setPriceRange] = useState([0, 20]);
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [Categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const API = process.env.NEXT_PUBLIC_API_URL


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
          setCategories(categories);

        }
        if (Array.isArray(products)) {
          setProducts(products);
        }

      } catch (err) {
        console.error("❌ Failed to fetch data", err);
      }
    };

    fetchCategoriesAndProducts();
  }, [API]);
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && Categories.some(cat => cat.title === categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }

  }, [searchParams,Categories]);

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category?.title === selectedCategory;
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
          <option value="All">All Categories</option>

          {Categories.map((cat) => (
            <option key={cat.id} value={cat.title}>{cat.title}</option>
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
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

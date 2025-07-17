"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useParams } from "next/navigation";
import { Product } from "@/types/interfaces";

const PdfIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 1.2,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2.2, spacing: 24 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3.2, spacing: 32 },
      },
    },
  });

  const API = process.env.NEXT_PUBLIC_API_URL ;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch main product
        const productRes = await fetch(`${API}/product/${id}`);
        if (!productRes.ok) throw new Error("Product not found");
        const productData: Product = await productRes.json();
        setProduct(productData);

        // Fetch related products (same category)
        const relatedRes = await fetch(
          `${API}/product?category=${productData.category.title}&exclude=${id}`
        );
        const relatedData: Product[] = await relatedRes.json();
        setRelatedProducts(relatedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-red-600">
        {error || "Product not found"}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Product Info */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <Image
            src={`${API}/uploads/products/${product.image}`}
            alt={product.name}
            width={500}
            height={500}
            className="object-contain rounded shadow"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-xl text-blue-600 font-semibold">
            ${product.price.toFixed(2)}
          </p>
          <p
            className={`text-md ${
              product.inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>

          <div className="flex items-center gap-4">
            <label className="text-gray-700">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-12 text-center border-x border-gray-300 py-2 text-black">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add {quantity} to Cart
          </button>
        </div>
      </div>

      {/* Description, Features, PDF */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Description</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>

        {product.features && product.features.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Features</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Documentation
          </h2>
          <a
            href={`${API}/uploads/products/${product.pdf}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PdfIcon />
            <div>
              <p className="text-lg font-medium text-gray-800">Product Guide</p>
              <p className="text-sm text-gray-500">
                Click to view/download PDF
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
          <div ref={sliderRef} className="keen-slider">
            {relatedProducts.map((related) => (
              <a
                key={related.id}
                href={`/products/${related.id}`}
                className="keen-slider__slide block bg-white border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer"
              >
                <Image
                  src={`${API}/uploads/products/${related.image}`}
                  alt={related.name}
                  width={200}
                  height={200}
                  className="object-contain mx-auto"
                />
                <h3 className="text-lg font-semibold mt-2 text-center">
                  {related.name}
                </h3>
                <p className="text-blue-600 font-medium text-center">
                  ${related.price.toFixed(2)}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import { Suspense } from "react";
import ProductsFilterClient from "@/components/ProductsFilterClient";

export default function ProductsPage() {
  return (
    <div className="py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 px-4">Our Products</h1>
      <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
        <ProductsFilterClient />
      </Suspense>
    </div>
  );
}

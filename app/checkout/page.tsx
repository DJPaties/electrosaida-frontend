"use client";

import { useCart } from "@/components/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<"cod" | "whish" | null>(null);
  const router = useRouter();

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Show toast on mount if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error("No items to proceed with");
    }
  }, [items]);

  const handleSubmit = () => {
    if (items.length === 0) return;

    if (!selectedPayment) {
      alert("Please select a payment method.");
      return;
    }

    alert(`Order placed using ${selectedPayment === "cod" ? "Cash on Delivery" : "Whish Money"}.`);
    clearCart();
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {items.length === 0 ? (
          <p className="text-gray-600 text-center">Please add items to your cart before checking out.</p>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="py-4 flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded border"
                />
                <div className="flex-1">
                  <p className="font-medium text-black">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-black">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-right">
          <p className="text-lg font-bold">
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setSelectedPayment("cod")}
            className={`flex items-center gap-2 border p-3 rounded w-full sm:w-1/2 ${
              selectedPayment === "cod" ? "border-[#242B91]" : "border-gray-300"
            }`}
          >
            <Image
              src="/assets/logos/cash-on-delivery.png"
              alt="Cash on Delivery"
              width={40}
              height={40}
            />
            <span className="text-black">Cash on Delivery</span>
          </button>
          <button
            onClick={() => setSelectedPayment("whish")}
            className={`flex items-center gap-2 border p-3 rounded w-full sm:w-1/2 ${
              selectedPayment === "whish" ? "border-[#242B91]" : "border-gray-300"
            }`}
          >
            <Image
              src="/assets/logos/whish-money.png"
              alt="Whish Money"
              width={40}
              height={40}
            />
            <span className="text-black">Whish Money</span>
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={items.length === 0}
        className={`w-full py-3 rounded transition ${
          items.length === 0
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-[#242B91] text-white hover:bg-[#1e237a]"
        }`}
      >
        Place Order
      </button>
    </div>
  );
}

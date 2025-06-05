"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaBoxOpen, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";

const mockOrder = {
  orderId: "ORD-872193",
  customer: "Mohammad Dghaily",
  location: "Saida, Lebanon",
  placedAt: "2025-06-05",
  items: [
    { name: "ESP32 Dev Board", quantity: 2 },
    { name: "Jumper Wires 40pcs", quantity: 1 },
  ],
  status: "delivered", // possible values: pending, preparing, delivering, delivered
};

const statusSteps = [
  { key: "pending", label: "Pending", color: "bg-red-500", icon: <FaClock /> },
  { key: "preparing", label: "Preparing", color: "bg-orange-500", icon: <FaBoxOpen /> },
  { key: "delivering", label: "Delivering", color: "bg-yellow-400", icon: <FaTruck /> },
  { key: "delivered", label: "Delivered", color: "bg-green-500", icon: <FaCheckCircle /> },
];

export default function OrderStatusPage() {
  const [order] = useState(mockOrder);

  const currentIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Order Tracking</h1>

      {/* Order Status Timeline */}
      <div className="flex justify-between items-center mb-10 relative">
        {statusSteps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center w-1/4">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white text-xl z-10 ${
                index <= currentIndex ? step.color : "bg-gray-300"
              }`}
            >
              {step.icon}
            </div>
            <span className="mt-2 text-sm text-center font-medium text-gray-700">
              {step.label}
            </span>
          </div>
        ))}
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 z-0 mx-5 rounded-full">
          <div
            className="h-1 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-400 to-green-500 rounded-full"
            style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>

        <p className="text-gray-700 mb-2">
          <strong>Order ID:</strong> {order.orderId}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Customer:</strong> {order.customer}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Location:</strong> <FaMapMarkerAlt className="inline mr-1 text-blue-600" /> {order.location}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Placed At:</strong> {order.placedAt}
        </p>

        <h3 className="text-md font-semibold text-gray-800 mb-2">Items</h3>
        <ul className="list-disc list-inside text-gray-700">
          {order.items.map((item, i) => (
            <li key={i}>{item.quantity} * {item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

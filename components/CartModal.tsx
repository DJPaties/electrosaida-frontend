"use client";

import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react"; // added X icon import
import { useEffect } from "react";
import Link from "next/link";

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const { items, updateQuantity, removeFromCart } = useCart();

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-30 z-[60]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Slide-in Modal */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-lg z-[70] overflow-y-auto"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                    >
                        <div className="p-4 flex flex-col h-full text-black">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Your Cart</h2>
                                <button
                                    onClick={onClose}
                                    className="text-black hover:text-gray-700"
                                    aria-label="Close Cart"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {items.length === 0 ? (
                                <p className="text-gray-500">Your cart is empty.</p>
                            ) : (
                                <div className="flex flex-col gap-4 flex-1">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 items-center border-b pb-4"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg border"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-black">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    ${item.price.toFixed(2)} × {item.quantity}
                                                </p>
                                                <p className="text-sm font-medium text-black">
                                                    Total: ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <button
                                                    className="w-6 h-6 bg-gray-200 rounded text-black"
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                >
                                                    +
                                                </button>
                                                <span className="text-sm">{item.quantity}</span>
                                                <button
                                                    className="w-6 h-6 bg-gray-200 rounded text-black"
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                >
                                                    −
                                                </button>
                                                <button
                                                    className="text-red-500 mt-2"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-6 pt-4 border-t">
                                <p className="text-sm text-gray-600 mb-2">
                                    Total Items: {totalItems}
                                </p>
                                <p className="text-lg font-bold mb-4">
                                    Total Price: ${totalPrice.toFixed(2)}
                                </p>
                                <Link href="/checkout">
                                    <button
                                        className="w-full bg-[#242B91] text-white py-2 rounded hover:bg-[#1e237a] transition"
                                        onClick={onClose}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

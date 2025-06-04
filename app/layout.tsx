// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { CartProvider } from "@/components/CartContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElectroSaida",
  description: "Your electronics partner in Lebanon.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily: "var(--font-geist-sans), var(--font-geist-mono), sans-serif",
          backgroundColor: "#ffffff",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CartProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </CartProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}

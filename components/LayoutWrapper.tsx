"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthProvider } from "./AuthContext";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname.includes("/admin");

  return (
    <>
    <AuthProvider>

      {!isAuthPage && <Navbar />}
      <main>{children}</main>
      {!isAuthPage && <Footer />}
</AuthProvider>

    </>
  );
}

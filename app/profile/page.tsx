"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated } from "@/utils/checkAuth";
import { logoutUser } from "@/utils/logout";

export default function ProfilePage() {
  const [isAuth, setIsAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("access_token");
      const auth = await isAuthenticated();

      
      if (!auth || !token) {
        router.push("/login");
        return;
      }
      setIsAuth(true);
      
      // Get user data from /auth/me
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        router.push("/login");
      }
    };

    loadProfile();
  }, [router]);

  const logout = async () => {
    await logoutUser();
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
          <Image
            src="/assets/logos/icon_no_white_edges.png"
            alt="Profile"
            width={96}
            height={96}
            className="object-contain"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <button
            onClick={logout}
            className="mt-2 text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">My Info</h3>
        <div className="space-y-2 text-gray-700 text-sm">
          <p><strong>User ID:</strong> {user.sub}</p>
          <p><strong>Joined:</strong> January 2024</p>
          <p><strong>Location:</strong> Saida, Lebanon</p>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Quick Access</h3>
          <div className="flex gap-4">
            <Link
              href="/orders"
              className="px-4 py-2 rounded bg-yellow-400 text-black font-medium hover:bg-blue-600 hover:text-white transition"
            >
              View Orders
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-yellow-400 hover:text-black transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

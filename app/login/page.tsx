// app/login/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    // Handle auth logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-yellow-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm">or</p>
          <button
            type="button"
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
          >
            Login with Google
          </button>
        </div>

        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ App Router version

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real auth logic
    router.push('/admin/dashboard'); // ✅ still works
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center">Admin Login</h1>
        <label className="block mb-4">
          <span className="text-gray-700">Email or Username</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>
        <label className="block mb-6">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

// app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Stats {
  users: number;
  orders: number;
  products: number;
  carts: number;
}

interface Order {
  id: number;
  userName: string;
  status: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ users: 0, orders: 0, products: 0, carts: 0 });
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  useEffect(() => {
    const verifyAdminAndFetch = async () => {
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const verifyRes = await fetch(`${API}/auth/me`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!verifyRes.ok) throw new Error('Failed to verify admin');

        const payload = await verifyRes.json();
        if (payload.role !== 'admin') throw new Error('Access denied: Not an admin');

        const fetchResource = async (endpoint: string, key: keyof Stats) => {
          try {
            const res = await fetch(`${API}/${endpoint}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log(`Fetching ${key} from ${API}/${endpoint}`);
            console.log('Response status:', res.status);
            if (!res.ok) throw new Error(`Failed to fetch ${key}`);
            const data = await res.json();
            return data;
          } catch (err) {
            setErrors(prev => ({ ...prev, [key]: (err as Error).message }));
            return [];
          }
        };

        const [users, orders, products, carts] = await Promise.all([
          fetchResource('user', 'users'),
          fetchResource('orders', 'orders'),
          fetchResource('product', 'products'),
          fetchResource('cart', 'carts'),
        ]);

        setStats({
          users: users.length || 0,
          orders: orders.length || 0,
          products: products.length || 0,
          carts: carts.length || 0,
        });

        const pending = (orders || []).filter((order: Order) => order.status === 'PENDING');
        setPendingOrders(pending);
      } catch (err) {
        setErrors(prev => ({ ...prev, general: (err as Error).message }));
      }
    };

    verifyAdminAndFetch();
  }, [token, router]);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-black">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {['users', 'orders', 'products', 'carts'].map((key) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-gray-600 mb-1 capitalize">{key}</h2>
            {errors[key] ? (
              <p className="text-sm text-red-500">Error</p>
            ) : (
              <p className={`text-3xl font-bold ${
                key === 'users'
                  ? 'text-blue-600'
                  : key === 'orders'
                  ? 'text-green-600'
                  : key === 'products'
                  ? 'text-purple-600'
                  : 'text-yellow-600'
              }`}>
                {stats[key as keyof Stats] || 0}
              </p>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-black">Pending Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Order ID</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">User</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Created At</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 border-b">
                  <td className="px-6 py-4 text-sm">#{order.id}</td>
                  <td className="px-6 py-4 text-sm">{order.userName}</td>
                  <td className="px-6 py-4 text-sm text-yellow-600 font-medium">{order.status}</td>
                  <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-6">
                  No pending orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

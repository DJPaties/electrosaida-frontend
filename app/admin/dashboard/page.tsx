// app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
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

  const API = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      const res = await fetch(`${API}/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data.stats);
      setPendingOrders(data.pendingOrders);
    };

    fetchStats();
  }, [token]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-600">Users</h2>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-600">Orders</h2>
          <p className="text-2xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-600">Products</h2>
          <p className="text-2xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-600">Carts</h2>
          <p className="text-2xl font-bold">{stats.carts}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Pending Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="text-left p-3 border-b">Order ID</th>
              <th className="text-left p-3 border-b">User</th>
              <th className="text-left p-3 border-b">Status</th>
              <th className="text-left p-3 border-b">Created At</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">#{order.id}</td>
                <td className="p-3 border-b">{order.userName}</td>
                <td className="p-3 border-b">{order.status}</td>
                <td className="p-3 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

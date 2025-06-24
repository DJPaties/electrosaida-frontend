'use client';

import React, { useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to verify admin');

        const payload = await res.json();
        if (payload.role !== 'admin') throw new Error('Access denied: Not an admin');
      } catch (err) {
        router.push('/admin/login');
      }
    };

    verifyAdmin();
  }, [token, router]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {/* TODO: Orders listing and status update */}
    </AdminLayout>
  );
};

export default OrdersPage;

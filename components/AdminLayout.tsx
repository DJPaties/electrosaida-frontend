import React from 'react';
import Link from 'next/link';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/admin/dashboard">Overview</Link>
          <Link href="/admin/dashboard/products">Products</Link>
          <Link href="/admin/dashboard/orders">Orders</Link>
          <Link href="/admin/dashboard/users">Users</Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

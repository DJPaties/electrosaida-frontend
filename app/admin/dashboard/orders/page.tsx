'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface Order {
  id: number;
  status: string;
  deliveryAddress: string;
  createdAt: string;
  user: { name: string; email: string };
  items: {
    id: string;
    quantity: number;
    product: { name: string; price: number };
  }[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const OrderStatusList = ['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED'];

const OrdersPage: React.FC = () => {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'createdAt' | 'status'>('createdAt');
  const [error, setError] = useState('');

  const [open, setOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ userId: '', deliveryAddress: '', items: [{ productId: '', quantity: 1 }] });

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchUsers();
      fetchProducts();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data || []);
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API}/product`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data || []);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`${API}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchOrders();
    } catch {
      setError('Failed to update status');
    }
  };

  const handleNewOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        setOpen(false);
        setNewOrder({ userId: '', deliveryAddress: '', items: [{ productId: '', quantity: 1 }] });
        fetchOrders();
      }
    } catch {
      setError('Failed to create order');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.status.localeCompare(b.status);
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Orders Management</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Create Order</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleNewOrderSubmit} className="space-y-4 text-black">
                <div>
                  <label className="block text-sm font-medium mb-1">User</label>
                  <select
                    value={newOrder.userId}
                    onChange={(e) => setNewOrder({ ...newOrder, userId: e.target.value })}
                    required
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Address</label>
                  <input
                    type="text"
                    value={newOrder.deliveryAddress}
                    onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                {newOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <select
                      value={item.productId}
                      onChange={(e) => {
                        const updated = [...newOrder.items];
                        updated[index].productId = e.target.value;
                        setNewOrder({ ...newOrder, items: updated });
                      }}
                      required
                      className="border p-2 rounded"
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...newOrder.items];
                        updated[index].quantity = +e.target.value;
                        setNewOrder({ ...newOrder, items: updated });
                      }}
                      className="border p-2 rounded"
                      required
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewOrder({
                    ...newOrder,
                    items: [...newOrder.items, { productId: '', quantity: 1 }]
                  })}
                >
                  + Add Item
                </Button>
                <Button type="submit" className="w-full">
                  Submit Order
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="mb-4 flex justify-end space-x-4">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'status')}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="createdAt">Created At</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Address</th>
                <th className="p-4">Status</th>
                <th className="p-4">Items</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">#{order.id}</td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold">{order.user.name}</p>
                      <p className="text-sm text-gray-500">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="p-4 max-w-xs truncate">{order.deliveryAddress}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-300 rounded p-1"
                    >
                      {OrderStatusList.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-sm space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.product.name} x{item.quantity}{' '}
                        <span className="text-gray-400 text-xs">(${item.product.price})</span>
                      </div>
                    ))}
                  </td>
                  <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
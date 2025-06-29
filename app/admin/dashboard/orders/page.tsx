'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  inStock: number;
}

const OrderStatusList = ['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED'];

// Toast component for user feedback
const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => {
  if (!message) return null;
  
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {message}
    </div>
  );
};

const OrdersPage: React.FC = () => {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'createdAt' | 'status'>('createdAt');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    userId: '',
    deliveryAddress: '',
    items: [{ productId: '', quantity: 1 }]
  });

  // Show toast message and auto-hide after 3 seconds
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch data from API
  const fetchData = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      
      // Fetch orders
      const ordersRes = await fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } });
      const ordersData = await ordersRes.json();
      setOrders(ordersData || []);
      
      // Fetch users
      const usersRes = await fetch(`${API}/user`, { headers: { Authorization: `Bearer ${token}` } });
      const usersData = await usersRes.json();
      setUsers(usersData || []);
      
      // Fetch products
      const productsRes = await fetch(`${API}/product`, { headers: { Authorization: `Bearer ${token}` } });
      const productsData = await productsRes.json();
      setProducts(productsData || []);
      
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [API, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle order status change
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`${API}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        fetchData();
        showToast('Order status updated successfully', 'success');
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  // Handle new order submission
  const handleNewOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${API}/orders/admin`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });
      
      if (res.ok) {
        setIsDialogOpen(false);
        setNewOrder({ userId: '', deliveryAddress: '', items: [{ productId: '', quantity: 1 }] });
        fetchData();
        showToast('Order created successfully', 'success');
      } else {
        showToast('Failed to create order', 'error');
      }
    } catch {
      showToast('Failed to create order', 'error');
    }
  };

  // Add new item to order form
  const addNewItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: '', quantity: 1 }]
    });
  };

  // Remove item from order form
  const removeItem = (index: number) => {
    if (newOrder.items.length <= 1) return;
    
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  // Update item in order form
  const updateItem = (index: number, field: 'productId' | 'quantity', value: string) => {
    const updatedItems = [...newOrder.items];
    
    if (field === 'quantity') {
      updatedItems[index][field] = parseInt(value) || 0;
    } else {
      updatedItems[index][field] = value;
    }
    
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  // Sort orders based on selected criteria
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.status.localeCompare(b.status);
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Toast notifications */}
        {toast && <Toast message={toast.message} type={toast.type} />}
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-black">Orders Management</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">Create Order</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-black">Create New Order</h2>
              
              <form onSubmit={handleNewOrderSubmit} className="space-y-4 text-black">
                {/* User selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">Select User *</label>
                  <select
                    value={newOrder.userId}
                    onChange={(e) => setNewOrder({ ...newOrder, userId: e.target.value })}
                    required
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Choose user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Delivery address */}
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    value={newOrder.deliveryAddress}
                    onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })}
                    required
                    className="w-full border p-2 rounded"
                    placeholder="Enter full address"
                  />
                </div>
                
                {/* Order items */}
                <div>
                  <label className="block text-sm font-medium mb-1">Order Items *</label>
                  <div className="space-y-3">
                    {newOrder.items.map((item, index) => {
                      const product = products.find((p) => p.id === item.productId);
                      const availableStock = product?.inStock || 0;
                      
                      return (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                          {/* Product selection */}
                          <select
                            value={item.productId}
                            onChange={(e) => updateItem(index, 'productId', e.target.value)}
                            required
                            className="col-span-5 border p-2 rounded"
                          >
                            <option value="">Select product</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id} disabled={p.inStock <= 0}>
                                {p.name} {p.inStock <= 0 ? '(Out of stock)' : `($${p.price})`}
                              </option>
                            ))}
                          </select>
                          
                          {/* Quantity input */}
                          <div className="col-span-4 relative">
                            <input
                              type="number"
                              min={1}
                              max={availableStock}
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                              className="w-full border p-2 rounded"
                              required
                              disabled={!item.productId}
                            />
                            {item.productId && (
                              <span className="absolute right-2 top-2 text-xs text-gray-500">
                                Max: {availableStock}
                              </span>
                            )}
                          </div>
                          
                          {/* Remove button */}
                          {newOrder.items.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="col-span-3"
                              onClick={() => removeItem(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addNewItem}
                    className="mt-2"
                  >
                    + Add Item
                  </Button>
                </div>
                
                <Button type="submit" className="w-full mt-4">
                  Create Order
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sorting controls */}
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-sm text-gray-600">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'status')}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="createdAt">Newest First</option>
              <option value="status">Order Status</option>
            </select>
          </div>
        </div>

        {/* Orders table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-black">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No orders available</p>
            <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
              Create Your First Order
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Address</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Items</th>
                  <th className="p-4 text-left">Date</th>
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
                    <td className="p-4 max-w-xs">
                      <div className="line-clamp-2">{order.deliveryAddress}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`border rounded p-1 w-full max-w-[150px] ${
                          order.status === 'PENDING' ? 'bg-yellow-100 border-yellow-300' :
                          order.status === 'PREPARING' ? 'bg-blue-100 border-blue-300' :
                          order.status === 'DELIVERING' ? 'bg-purple-100 border-purple-300' :
                          'bg-green-100 border-green-300'
                        }`}
                      >
                        {OrderStatusList.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id}>
                            {item.product.name} <span className="text-gray-500">x{item.quantity}</span>
                            <span className="text-gray-400 text-xs ml-1">(${item.product.price.toFixed(2)} each)</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
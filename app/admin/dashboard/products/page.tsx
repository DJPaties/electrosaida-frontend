'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Trash2 } from 'lucide-react';

interface Category {
  id: number;
  title: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  inStock: number;
  image: string;
  hoverImage?: string;
  pdf?: string;
  description: string;
  category: { title: string; id: number } | null;
}

const ProductPage: React.FC = () => {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    inStock: '',
    categoryId: '',
  });

  // File states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hoverImageFile, setHoverImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Preview states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Auth states
  const [token, setToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    inStock: '',
    categoryId: '',
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editHoverImageFile, setEditHoverImageFile] = useState<File | null>(null);
  const [editPdfFile, setEditPdfFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editHoverPreview, setEditHoverPreview] = useState<string | null>(null);

  // Feedback states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Add these state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sortConfig, setSortConfig] = useState<{
    field: keyof Product;
    direction: 'asc' | 'desc';
  }>({ field: 'name', direction: 'asc' });

  // Define table headers
  const tableHeaders: { key: keyof Product | 'actions'; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'image', label: 'Image' },
    { key: 'hoverImage', label: 'Hover Image' },
    { key: 'pdf', label: 'PDF' },
    { key: 'price', label: 'Price' },
    { key: 'inStock', label: 'Stock' },
    { key: 'category', label: 'Category' },
    { key: 'actions', label: 'Actions' },
  ];

  // Sorting handler
  const handleSort = (field: keyof Product) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(term) ||
        (product.category?.title?.toLowerCase().includes(term) || false)
      );
    }

    // Apply sorting
    if (sortConfig.field) {
      result.sort((a, b) => {
        // Handle category separately
        if (sortConfig.field === 'category') {
          const aValue = a.category?.title || '';
          const bValue = b.category?.title || '';
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Handle other fields
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return result;
  }, [products, searchTerm, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const currentItems = filteredProducts.slice(startIndex, endIndex);



  // Initialize token and verify admin access
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) router.push('/admin/login');
    else setToken(storedToken);
  }, [router]);

  // Load data when token is available
  const loadData = useCallback(async () => {
    if (!token) return;

    try {
      // Verify admin access
      const verifyRes = await fetch(`${API}/auth/me`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.message || 'Unauthorized');
      }

      const userData = await verifyRes.json();
      if (userData.role !== 'admin') throw new Error('Admin access required');

      setIsVerifying(false);

      // Load categories
      const categoriesRes = await fetch(`${API}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData || []);

      // Load products with all needed fields
      const productsRes = await fetch(`${API}/product`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productsData = await productsRes.json();
      setProducts(productsData || []);
    } catch (err: any) {
      setError(err.message);
      router.push('/admin/login');
    }
  }, [token, API, router]);

  useEffect(() => {
    if (token) loadData();
  }, [token, loadData]);

  // Handle file selection with preview
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview?: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFile(file);

      if (setPreview) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle edit form changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit new product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('inStock', form.inStock);
      formData.append('categoryId', form.categoryId);

      if (imageFile) formData.append('image', imageFile);
      if (hoverImageFile) formData.append('hoverImage', hoverImageFile);
      if (pdfFile) formData.append('pdf', pdfFile);

      const res = await fetch(`${API}/product`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      // Reset form and show success
      setForm({ name: '', description: '', price: '', inStock: '', categoryId: '' });
      setImageFile(null);
      setHoverImageFile(null);
      setPdfFile(null);
      setImagePreview(null);
      setHoverPreview(null);

      setSuccess('Product added successfully');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit modal with product data
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      inStock: product.inStock.toString(),
      categoryId: product.category?.id?.toString() || '',
    });

    // Set current image URLs as previews
    setEditImagePreview(product.image ? `${API}/uploads/products/${product.image}` : null);
    setEditHoverPreview(product.hoverImage ? `${API}/uploads/products/${product.hoverImage}` : null);
    setIsEditModalOpen(true);
  };

  // Close edit modal and reset states
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditImageFile(null);
    setEditHoverImageFile(null);
    setEditPdfFile(null);
    setEditImagePreview(null);
    setEditHoverPreview(null);
  };

  // Submit edited product
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      formData.append('inStock', editForm.inStock);
      formData.append('categoryId', editForm.categoryId);

      if (editImageFile) formData.append('image', editImageFile);
      if (editHoverImageFile) formData.append('hoverImage', editHoverImageFile);
      if (editPdfFile) formData.append('pdf', editPdfFile);

      // Flag to delete existing images if new ones are uploaded
      // if (editImageFile) formData.append('image', 'true');
      // if (editHoverImageFile) formData.append('hoverImage', 'true');
      // if (editPdfFile) formData.append('pdf', 'true');

      const res = await fetch(`${API}/product/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      closeEditModal();
      setSuccess('Product updated successfully');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This will also remove associated images and files.')) return;

    try {
      const res = await fetch(`${API}/product/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      setSuccess('Product deleted successfully');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black">Verifying admin access...</p>
      </div>
    );
  }





  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black">Add New Product</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 md:p-6 rounded-lg shadow-md space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">Price</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">In Stock</label>
              <input
                name="inStock"
                type="number"
                value={form.inStock}
                onChange={handleChange}
                required
                min="0"
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 font-medium">Main Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setImageFile, setImagePreview)}
                className="w-full"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Main preview"
                  className="w-32 h-32 object-contain mt-2 rounded border"
                />
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">Hover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setHoverImageFile, setHoverPreview)}
                className="w-full"
              />
              {hoverPreview && (
                <img
                  src={hoverPreview}
                  alt="Hover preview"
                  className="w-32 h-32 object-contain mt-2 rounded border"
                />
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">Product PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, setPdfFile)}
                className="w-full"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Adding Product...' : 'Submit Product'}
          </Button>
        </form>

        <div className="mt-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Existing Products</h2>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border p-2 rounded"
              >
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="bg-white rounded-lg shadow min-w-full w-full">
              <thead>
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header.key}
                      className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        if (header.key !== 'actions') {
                          handleSort(header.key as keyof Product);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        {header.label}
                        {sortConfig.field === header.key && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">
                        {product.image && (
                          <img
                            src={`${API}/uploads/products/${product.image}`}
                            alt={product.name}
                            className="w-16 h-16 object-contain rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {product.hoverImage && (
                          <img
                            src={`${API}/uploads/products/${product.hoverImage}`}
                            alt={`${product.name} hover`}
                            className="w-16 h-16 object-contain rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {product.pdf && (
                          <a
                            href={`${API}/uploads/products/${product.pdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <FileText className="w-5 h-5 mr-1" />
                            PDF
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-2">{product.inStock}</td>
                      <td className="px-4 py-2">{product.category?.title || '-'}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(product)}
                            className="flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {endIndex} of {filteredProducts.length} products
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        {/* Edit Product Modal */}
        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Edit Product</h2>
                  <button
                    onClick={closeEditModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">Product Name</label>
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        required
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">Category</label>
                      <select
                        name="categoryId"
                        value={editForm.categoryId}
                        onChange={handleEditChange}
                        required
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      required
                      className="w-full border p-2 rounded min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">Price</label>
                      <input
                        name="price"
                        type="number"
                        value={editForm.price}
                        onChange={handleEditChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">In Stock</label>
                      <input
                        name="inStock"
                        type="number"
                        value={editForm.inStock}
                        onChange={handleEditChange}
                        required
                        min="0"
                        className="w-full border p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">Main Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setEditImageFile, setEditImagePreview)}
                        className="w-full"
                      />
                      {editImagePreview && (
                        <img
                          src={editImagePreview}
                          alt="Main preview"
                          className="w-32 h-32 object-contain mt-2 rounded border"
                        />
                      )}
                      {!editImagePreview && editingProduct.image && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Current:</p>
                          <img
                            src={`${API}/uploads/products/${editingProduct.image}`}
                            alt="Current main"
                            className="w-32 h-32 object-contain rounded border"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">Hover Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setEditHoverImageFile, setEditHoverPreview)}
                        className="w-full"
                      />
                      {editHoverPreview && (
                        <img
                          src={editHoverPreview}
                          alt="Hover preview"
                          className="w-32 h-32 object-contain mt-2 rounded border"
                        />
                      )}
                      {!editHoverPreview && editingProduct.hoverImage && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Current:</p>
                          <img
                            src={`${API}/uploads/products/${editingProduct.hoverImage}`}
                            alt="Current hover"
                            className="w-32 h-32 object-contain rounded border"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">Product PDF</label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, setEditPdfFile)}
                        className="w-full"
                      />
                      {editingProduct.pdf && !editPdfFile && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Current:</p>
                          <a
                            href={`${API}/uploads/products/${editingProduct.pdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <FileText className="w-16 h-16 mr-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update Product'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductPage;
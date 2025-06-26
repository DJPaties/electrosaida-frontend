'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Category {
  id: number;
  title: string;
  subTitle: string;
  image: string;
}

const CategoryPage: React.FC = () => {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const [form, setForm] = useState({ title: '', subTitle: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editModal, setEditModal] = useState<{ open: boolean; data: Category | null }>({
    open: false,
    data: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch(`${API}/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCategories(data || []);
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API}/category/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      const { path } = await res.json();
      return path; // expected: 'uploads/category123.jpg'
    } else {
      alert('Image upload failed');
      return null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imagePath = form.image;
    if (imageFile) {
      const uploaded = await handleImageUpload(imageFile);
      if (uploaded) imagePath = uploaded;
    }

    const payload = {
      title: form.title,
      subTitle: form.subTitle,
      image: imagePath,
    };

    const res = await fetch(`${API}/category${editModal.open ? `/${editModal.data?.id}` : ''}`, {
      method: editModal.open ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setForm({ title: '', subTitle: '', image: '' });
      setImageFile(null);
      setImagePreview(null);
      setEditModal({ open: false, data: null });
      fetchCategories();
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API}/category/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCategories();
  };

  const openEditModal = (cat: Category) => {
    setEditModal({ open: true, data: cat });
    setForm({ title: cat.title, subTitle: cat.subTitle, image: cat.image });
    setImagePreview(`${API}/${cat.image}`);
  };

  return (
    <AdminLayout>
      <div className="text-black px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold mb-6">Category Management</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-6 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Category Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={form.subTitle}
                onChange={(e) => setForm({ ...form, subTitle: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
            {imagePreview && (
              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-24 w-24 object-contain border rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setForm({ ...form, image: '' });
                  }}
                  className="text-sm text-red-500 underline"
                >
                  Clear Image
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
            >
              {editModal.open ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Subtitle</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={`${API}/${cat.image}`}
                      alt={cat.title}
                      className="h-16 w-16 object-contain rounded"
                    />
                  </td>
                  <td className="p-4">{cat.title}</td>
                  <td className="p-4">{cat.subTitle}</td>
                  <td className="p-4 space-x-4">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No categories found.
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

export default CategoryPage;

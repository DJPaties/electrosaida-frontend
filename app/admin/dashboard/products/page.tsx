'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';

const ProductPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    inStock: '',
    category: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [hoverImage, setHoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hoverImagePreview, setHoverImagePreview] = useState<string | null>(null);

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
        if (payload.role !== 'admin') throw new Error('Access denied');
      } catch (err) {
        router.push('/admin/login');
      }
    };

    verifyAdmin();
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewSetter?: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file);

      if (previewSetter) {
        const reader = new FileReader();
        reader.onloadend = () => previewSetter(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('inStock', form.inStock);
    formData.append('category', form.category);
    if (image) formData.append('image', image);
    if (hoverImage) formData.append('hoverImage', hoverImage);
    if (pdfFile) formData.append('pdf', pdfFile);
    console.log('Submitting product...');
    // TODO: send to backend with token
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-black">Add New Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow space-y-6 w-full text-black"
        encType="multipart/form-data"
      >
        {/* Form Content remains unchanged */}
        {/* ... */}
      </form>
    </AdminLayout>
  );
};

export default ProductPage;

'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

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
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-black">Add New Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow space-y-6 w-full text-black"
        encType="multipart/form-data"
      >
        {/* Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="block font-medium mb-1">Price (USD)</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              name="inStock"
              min="0"
              value={form.inStock}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          {/* Image Upload + Preview + Delete */}
          <div>
            <label className="block font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFileChange(e, setImage, setImagePreview)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="h-24 object-contain rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="mt-1 text-sm text-red-500 underline"
                >
                  Clear Image
                </button>
              </div>
            )}
          </div>

          {/* Hover Image Upload + Preview + Delete */}
          <div>
            <label className="block font-medium mb-1">Hover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFileChange(e, setHoverImage, setHoverImagePreview)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            {hoverImagePreview && (
              <div className="mt-2">
                <img src={hoverImagePreview} alt="Hover Preview" className="h-24 object-contain rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setHoverImage(null);
                    setHoverImagePreview(null);
                  }}
                  className="mt-1 text-sm text-red-500 underline"
                >
                  Clear Hover Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PDF File Upload + Delete */}
        <div>
          <label className="block font-medium mb-1">Attach PDF (optional)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={e => handleFileChange(e, setPdfFile)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {pdfFile && (
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-gray-600">{pdfFile.name}</p>
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                className="text-sm text-red-500 underline ml-4"
              >
                Clear PDF
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Submit Product
        </button>
      </form>
    </AdminLayout>
  );
};

export default ProductPage;

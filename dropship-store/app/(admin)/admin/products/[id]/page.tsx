"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
}

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    details: "",
    originalPrice: 0,
    discountPrice: 0,
    categoryId: "",
    imageUrl: "",
    stock: 100,
  });

  useEffect(() => {
    fetchCategories();
    if (!isNew) {
      fetchProduct();
    }
  }, [isNew, params.id]);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const fetchProduct = async () => {
    const res = await fetch(`/api/products/${params.id}`);
    const data = await res.json();
    setFormData({
      name: data.name,
      details: data.details,
      originalPrice: data.originalPrice,
      discountPrice: data.discountPrice,
      categoryId: data.categoryId,
      imageUrl: data.imageUrl || "",
      stock: data.stock,
    });
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = isNew ? "/api/products" : `/api/products/${params.id}`;
    const method = isNew ? "POST" : "PUT";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    router.push("/admin/products");
  };

  if (!isNew && loading) {
    return <p className="text-gray-500 text-center py-8">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#23271A] tracking-tight mb-6">
        {isNew ? "Add New Product" : "Edit Product"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xs border border-[#E5DFD7] p-6 sm:p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-bold text-[#2D3319] mb-1.5">
            Product Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-3.5 py-2.5 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#23271A] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] shadow-2xs transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#2D3319] mb-1.5">
            Description / Details
          </label>
          <textarea
            required
            rows={4}
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            className="w-full px-3.5 py-2.5 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#23271A] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] shadow-2xs transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#2D3319] mb-1.5">
              Original Price (₱)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.originalPrice || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  originalPrice: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#23271A] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] shadow-2xs transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#2D3319] mb-1.5">
              Discount Sale Price (₱)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.discountPrice || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountPrice: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#23271A] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] shadow-2xs transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#2D3319] mb-1.5">
              Category
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#23271A] focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] shadow-2xs transition-all cursor-pointer font-medium"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#2D3319] mb-1.5">
            Product Image
          </label>

          <div className="mt-2">
            {formData.imageUrl ? (
              <div className="relative inline-block">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="w-40 h-40 object-cover rounded-lg border border-[#E5DFD7] shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-800 shadow-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-40 border-2 border-dashed border-[#E5DFD7] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#B35E2B] hover:bg-[#FAF7F2] transition-colors p-4"
              >
                {uploading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#B35E2B] border-t-transparent mx-auto"></div>
                    <p className="text-xs font-semibold text-stone-600 mt-2">Uploading...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      className="w-8 h-8 text-stone-400 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-xs font-semibold text-[#2D3319] mt-2">
                      Click to upload
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      PNG, JPG, WebP (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {uploadError && (
            <p className="mt-2 text-sm font-semibold text-red-700">{uploadError}</p>
          )}

          <div className="mt-3">
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Or paste an image URL:
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#23271A] focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] shadow-2xs"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-[#E5DFD7]/60">
          <Button type="submit" disabled={saving || uploading}>
            {saving ? "Saving..." : isNew ? "Create Product" : "Update Product"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  originalPrice: number;
  discountPrice: number;
  stock: number;
  imageUrl: string | null;
  category: { name: string };
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.size} product(s)?`
      )
    )
      return;

    setDeleting(true);
    try {
      const ids = Array.from(selectedIds);
      await Promise.all(
        ids.map((id) => fetch(`/api/products/${id}`, { method: "DELETE" }))
      );
      setProducts(products.filter((p) => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
    } catch {
      alert("Failed to delete some products");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const allSelected =
    filteredProducts.length > 0 && selectedIds.size === filteredProducts.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#23271A] tracking-tight">Products</h1>
          <p className="text-sm text-stone-600 mt-1">
            Manage your skincare and wellness catalog, inventory, and pricing.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/products/new")}>
          Add Product
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#23271A] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] shadow-2xs transition-all"
        />
      </div>

      {selectedIds.size > 0 && (
        <div className="mb-4 p-3.5 bg-[#FAF7F2] border border-[#B35E2B]/30 rounded-lg flex items-center justify-between shadow-2xs">
          <span className="text-sm font-semibold text-[#8A481F]">
            {selectedIds.size} product(s) selected
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Selected"}
          </Button>
        </div>
      )}

      {loading ? (
        <p className="text-stone-600 text-center py-8">Loading products...</p>
      ) : error ? (
        <p className="text-red-700 font-medium text-center py-8">
          Failed to load products. Please check your database connection.
        </p>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-xs border border-[#E5DFD7] p-12 text-center">
          <p className="text-stone-600 font-medium">No products found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-[#E5DFD7] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#E5DFD7] bg-[#F4EFEB] text-xs uppercase tracking-wider text-[#444C38] font-bold">
                  <th scope="col" className="px-6 py-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-[#E5DFD7] text-[#B35E2B] focus:ring-[#B35E2B] cursor-pointer"
                    />
                  </th>
                  <th scope="col" className="px-6 py-4 w-20">Image</th>
                  <th scope="col" className="px-6 py-4 min-w-[200px]">Product Name</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4 text-right">Original Price</th>
                  <th scope="col" className="px-6 py-4 text-right">Sale Price</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]/60">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-[#FAF7F2] transition-colors duration-150 ${
                      selectedIds.has(product.id) ? "bg-[#FAF7F2]" : ""
                    }`}
                  >
                    <td className="px-6 py-4.5 align-middle text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 rounded border-[#E5DFD7] text-[#B35E2B] focus:ring-[#B35E2B] cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4.5 align-middle">
                      <div className="w-12 h-12 bg-[#FAF7F2] rounded-lg overflow-hidden border border-[#E5DFD7] flex items-center justify-center shrink-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-stone-400 text-lg">📦</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4.5 align-middle">
                      <p className="font-bold text-[#23271A] leading-snug">
                        {product.name}
                      </p>
                    </td>
                    <td className="px-6 py-4.5 align-middle">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#565E37]/10 text-[#47522D] border border-[#565E37]/20">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 align-middle text-right text-stone-500 line-through text-xs font-medium tabular-nums">
                      {formatPrice(product.originalPrice)}
                    </td>
                    <td className="px-6 py-4.5 align-middle text-right font-bold text-emerald-700 tabular-nums text-sm">
                      {formatPrice(product.discountPrice)}
                    </td>
                    <td className="px-6 py-4.5 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/products/${product.id}`)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3B4426] bg-[#565E37]/10 border border-[#565E37]/30 hover:bg-[#47522D] hover:text-white hover:border-[#47522D] shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-150 cursor-pointer group"
                          title="Edit product"
                        >
                          <svg className="w-3.5 h-3.5 text-[#47522D] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteOne(product.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 border border-red-200/80 hover:bg-red-700 hover:text-white hover:border-red-700 shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-150 cursor-pointer group"
                          title="Delete product"
                        >
                          <svg className="w-3.5 h-3.5 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

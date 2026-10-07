"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductList from "@/components/shop/ProductList";
import ViewToggle from "@/components/shop/ViewToggle";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  details: string;
  originalPrice: number;
  discountPrice: number;
  categoryId: string;
  imageUrl: string | null;
  stock: number;
  category: Category;
}

export default function HomePageClient({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: Category[];
}) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "grid";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.details.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, search, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#23271A]">
            Wellness and Skincare
          </h1>
        </div>
        <ViewToggle />
      </div>

      {/* ── Search & Category Filter Bar ─────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          {/* Search Input Field */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products by name or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#23271A] placeholder:text-stone-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Dropdown Option */}
          <div className="relative sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <select
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9.5 pr-10 py-2.5 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#2D3319] font-medium shadow-2xs appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] transition-all"
            >
              <option value="">All Categories ({initialProducts.length})</option>
              {initialCategories.map((cat) => {
                const count = initialProducts.filter((p) => p.categoryId === cat.id).length;
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({count})
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Filter Bar & Results Feedback */}
        {(search || selectedCategory) && (
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-stone-700">
            <span className="font-medium text-stone-500">Filtered by:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#565E37]/10 border border-[#565E37]/25 text-[#353E20] font-medium">
                Keyword: &ldquo;{search}&rdquo;
                <button
                  onClick={() => setSearch("")}
                  className="hover:text-[#B35E2B] transition-colors cursor-pointer"
                  aria-label="Remove search filter"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#565E37]/10 border border-[#565E37]/25 text-[#353E20] font-medium">
                Category: {initialCategories.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory("")}
                  className="hover:text-[#B35E2B] transition-colors cursor-pointer"
                  aria-label="Remove category filter"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
              }}
              className="text-stone-500 hover:text-[#23271A] underline ml-1 cursor-pointer text-xs"
            >
              Reset all
            </button>
            <span className="ml-auto text-stone-500 font-normal tabular-nums">
              Showing {filteredProducts.length} of {initialProducts.length} products
            </span>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="w-12 h-12 mx-auto mb-3 text-gray-300">
            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="font-semibold text-gray-900">No products found</p>
          <p className="text-sm mt-1 text-gray-500 max-w-sm mx-auto">
            {search || selectedCategory
              ? "Try adjusting your search terms or selecting a different category."
              : "Check back shortly as freshly cataloged formulations are added."}
          </p>
        </div>
      ) : view === "list" ? (
        <ProductList products={filteredProducts} />
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  );
}

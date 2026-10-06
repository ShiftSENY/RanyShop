"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import ProductQuickView from "@/components/shop/ProductQuickView";

interface Product {
  id: string;
  name: string;
  slug: string;
  details: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string | null;
  stock: number;
  category: { name: string };
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={() => setQuickView(product)}
          />
        ))}
      </div>
      <ProductQuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}

function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.discountPrice,
      imageUrl: product.imageUrl,
      stock: product.stock,
      quantity,
    });
    setQuantity(1);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.discountPrice,
      imageUrl: product.imageUrl,
      stock: product.stock,
      quantity,
    });
    setQuantity(1);
    router.push("/checkout");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col group">
      {/* ── Image ── */}
      <button
        type="button"
        onClick={onQuickView}
        aria-label={`View details for ${product.name}`}
        className="block relative overflow-hidden flex-shrink-0 w-full text-left cursor-pointer bg-gray-50"
        style={{ paddingBottom: "75%" }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/70 group-hover:opacity-80 transition-opacity">
            <span className="text-2xl">📦</span>
          </div>
        )}
      </button>

      {/* ── Info block ── */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Category pill */}
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium self-start bg-[#3AB7BA]/10 text-[#1a6f72]">
          {product.category.name}
        </span>

        {/* Product name */}
        <button
          type="button"
          onClick={onQuickView}
          className="block mt-2 text-left w-full cursor-pointer"
        >
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1a6f72] transition-colors">
            {product.name}
          </h3>
        </button>

        {/* Pricing row */}
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xs text-gray-400 line-through tabular-nums font-normal">
            {formatPrice(product.originalPrice)}
          </span>
          <span className="text-sm font-bold text-emerald-600 tabular-nums">
            {formatPrice(product.discountPrice)}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── CTA row ── */}
        <div className="mt-3 flex items-center gap-1.5">
          {/* Qty stepper */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50 flex-shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
            >
              −
            </button>
            <span className="w-5 text-center text-xs font-semibold text-gray-900 tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              aria-label="Increase quantity"
              className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Cart icon */}
          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            title="Add to cart"
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>

          {/* Buy now */}
          <Button
            onClick={handleBuyNow}
            size="sm"
            className="flex-1 text-xs py-1 h-7 min-h-0 font-medium"
          >
            BUY
          </Button>
        </div>
      </div>
    </div>
  );
}

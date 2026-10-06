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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
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
  const [justAdded, setJustAdded] = useState(false);
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
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
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
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* ── Image Area ── */}
      <button
        type="button"
        onClick={onQuickView}
        aria-label={`View details for ${product.name}`}
        className="block relative aspect-4/3 w-full overflow-hidden flex-shrink-0 text-left cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#3AB7BA]"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100/70 group-hover:opacity-80 transition-opacity">
            <span className="text-2xl sm:text-3xl">📦</span>
          </div>
        )}

      </button>

      {/* ── Card Content ── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        {/* Top Info Group */}
        <div>
          <div className="flex items-center justify-between gap-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-[#3AB7BA]/10 text-[#1a6f72]">
              {product.category.name}
            </span>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] sm:text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {product.stock} left
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onQuickView}
            className="block mt-1.5 text-left w-full cursor-pointer focus:outline-none group/title"
          >
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover/title:text-[#1a6f72] transition-colors">
              {product.name}
            </h3>
          </button>

          {/* Pricing Row */}
          <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-[11px] sm:text-xs text-gray-400 line-through tabular-nums font-normal">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-xs sm:text-sm font-bold text-emerald-600 tabular-nums">
              {formatPrice(product.discountPrice)}
            </span>
          </div>
        </div>

        {/* ── Action Controls Row ── */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-1 sm:gap-1.5">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/80 h-8 flex-shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              className="w-5 sm:w-6 h-full flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-200/70 active:bg-gray-200 transition-colors cursor-pointer"
            >
              −
            </button>
            <span className="w-4.5 sm:w-5 text-center text-[11px] sm:text-xs font-semibold text-gray-900 tabular-nums select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              aria-label="Increase quantity"
              className="w-5 sm:w-6 h-full flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-200/70 active:bg-gray-200 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button (Icon only) */}
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            title="Add to cart"
            className="w-8 h-8 flex-shrink-0 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            {justAdded ? (
              <svg
                className="w-4 h-4 text-emerald-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-700"
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
            )}
          </button>

          {/* Buy Now Button */}
          <Button
            type="button"
            onClick={handleBuyNow}
            size="sm"
            className="flex-1 h-8 min-h-0 min-w-0 text-xs font-medium tracking-normal px-2"
          >
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
}

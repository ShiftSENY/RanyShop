"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export interface QuickViewProduct {
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

interface ProductQuickViewProps {
  product: QuickViewProduct | null;
  onClose: () => void;
}

export default function ProductQuickView({
  product,
  onClose,
}: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

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
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-3xl rounded-xl border border-[#E5DFD7] bg-white overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 border border-[#E5DFD7] hover:bg-[#FAF7F2] transition-colors text-stone-700 cursor-pointer shadow-2xs"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-square md:aspect-auto md:min-h-[340px] flex items-center justify-center overflow-hidden bg-[#FAF7F2]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-stone-400">
                <span className="text-4xl mb-2">📦</span>
                <span className="text-xs font-medium text-stone-500">
                  No image available
                </span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#565E37]/10 text-[#47522D] border border-[#565E37]/20">
                {product.category.name}
              </span>
              <h2 className="mt-2.5 text-xl sm:text-2xl font-bold tracking-tight text-[#23271A] leading-snug">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-sm text-stone-400 line-through tabular-nums font-normal">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-2xl font-bold text-emerald-700 tabular-nums">
                  {formatPrice(product.discountPrice)}
                </span>
              </div>

              <p className="mt-4 text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {product.details}
              </p>

            </div>

            <div className="mt-6 pt-4 border-t border-[#E5DFD7]/60 flex items-center gap-3">
              <div className="flex items-center border border-[#E5DFD7] rounded-lg overflow-hidden bg-[#FAF7F2]/60 flex-shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-stone-700 hover:bg-[#E5DFD7]/70 hover:text-[#23271A] transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold text-[#23271A] tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  aria-label="Increase quantity"
                  className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-stone-700 hover:bg-[#E5DFD7]/70 hover:text-[#23271A] transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1 font-medium">
                {added ? "Added to Cart!" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

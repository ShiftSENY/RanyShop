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

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <>
      <div className="space-y-3">
        {products.map((product) => (
          <ProductRow
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

function ProductRow({
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
    <div className="bg-white rounded-lg border border-[#E5DFD7] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      {/* Thumbnail + info */}
      <div className="flex gap-4 items-center flex-1 min-w-0">
        <button
          type="button"
          onClick={onQuickView}
          aria-label={`View details for ${product.name}`}
          className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#E5DFD7] overflow-hidden group cursor-pointer bg-[#FAF7F2]"
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-2xl">📦</span>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#565E37]/10 text-[#47522D] border border-[#565E37]/20">
            {product.category.name}
          </span>
          <button
            type="button"
            onClick={onQuickView}
            className="block mt-1 text-left w-full cursor-pointer group"
          >
            <h3 className="font-semibold text-[#23271A] truncate group-hover:text-[#47522D] transition-colors text-base">
              {product.name}
            </h3>
          </button>
          <p className="text-xs text-stone-500 line-clamp-1 leading-relaxed mt-0.5">
            {product.details}
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xs text-stone-400 line-through tabular-nums font-normal">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-sm font-bold text-emerald-700 tabular-nums">
              {formatPrice(product.discountPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Qty + CTA */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto w-full sm:w-auto justify-end">
        <div className="flex items-center border border-[#E5DFD7] rounded-lg overflow-hidden bg-[#FAF7F2]/60">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            className="px-2.5 py-1 text-sm font-semibold text-stone-700 hover:bg-[#E5DFD7]/70 hover:text-[#23271A] transition-colors cursor-pointer"
          >
            −
          </button>
          <span className="px-2.5 py-1 text-xs font-semibold min-w-6 text-center text-[#23271A] tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            aria-label="Increase quantity"
            className="px-2.5 py-1 text-sm font-semibold text-stone-700 hover:bg-[#E5DFD7]/70 hover:text-[#23271A] transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          title="Add to cart"
          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-[#E5DFD7] text-stone-700 hover:bg-[#FAF7F2] hover:text-[#23271A] transition-colors cursor-pointer shadow-2xs"
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
        <Button onClick={handleBuyNow} size="sm" className="text-xs py-1.5 px-4 font-medium tracking-normal">
          Buy now
        </Button>
      </div>
    </div>
  );
}

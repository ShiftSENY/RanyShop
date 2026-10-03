"use client";

import { useState } from "react";
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      {/* Thumbnail + info */}
      <div className="flex gap-4 items-center flex-1 min-w-0">
        <button
          type="button"
          onClick={onQuickView}
          aria-label={`View details for ${product.name}`}
          className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 overflow-hidden group cursor-pointer bg-gray-50"
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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#3AB7BA]/10 text-[#1a6f72]">
            {product.category.name}
          </span>
          <button
            type="button"
            onClick={onQuickView}
            className="block mt-1 text-left w-full cursor-pointer group"
          >
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#1a6f72] transition-colors text-base">
              {product.name}
            </h3>
          </button>
          <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed mt-0.5">
            {product.details}
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xs text-gray-400 line-through tabular-nums font-normal">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-sm font-bold text-emerald-600 tabular-nums">
              {formatPrice(product.discountPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Qty + CTA */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto w-full sm:w-auto justify-end">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            className="px-2.5 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
          >
            −
          </button>
          <span className="px-2.5 py-1 text-xs font-semibold min-w-6 text-center text-gray-900 tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            aria-label="Increase quantity"
            className="px-2.5 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
        <Button onClick={handleAddToCart} size="sm" className="text-xs py-1.5 px-4 font-medium">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

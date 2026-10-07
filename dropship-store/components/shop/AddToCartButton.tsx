"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string | null;
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-[#2D3319]">
          Quantity:
        </label>
        <div className="flex items-center border border-[#E5DFD7] rounded-lg overflow-hidden bg-[#FAF7F2]/60">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            className="px-4 py-2 text-base font-semibold text-stone-700 hover:bg-[#E5DFD7]/70 hover:text-[#23271A] transition-colors cursor-pointer"
          >
            −
          </button>
          <span className="px-4 py-2 text-sm font-semibold min-w-8 text-center text-[#23271A] tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            aria-label="Increase quantity"
            className="px-4 py-2 text-base font-semibold text-stone-700 hover:bg-[#E5DFD7]/70 hover:text-[#23271A] transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
      <Button
        onClick={handleAddToCart}
        size="lg"
        className="w-full font-medium"
      >
        {added ? "Added to Cart!" : "Add to Cart"}
      </Button>
    </div>
  );
}

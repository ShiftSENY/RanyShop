"use client";

import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer text-sm"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-2 block">📦</span>
              <p className="text-sm font-medium text-gray-600">
                Your cart is empty
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Add products to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3.5 p-3 rounded-lg border border-gray-200 bg-gray-50/50"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-xl">📦</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm font-bold text-emerald-600 mt-0.5 tabular-nums">
                      {formatPrice(item.price)}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                          }
                          className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-gray-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Math.min(item.stock, item.quantity + 1)
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 text-xs font-medium hover:text-red-800 ml-auto transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 sm:p-5 space-y-3 bg-gray-50/50">
            <div className="flex justify-between font-bold text-base text-gray-900">
              <span>Total:</span>
              <span className="text-emerald-600 tabular-nums">
                {formatPrice(getTotal())}
              </span>
            </div>
            <Link href="/checkout" onClick={onClose} className="block">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
            <Button onClick={clearCart} variant="ghost" className="w-full text-xs text-gray-500 hover:text-gray-700">
              Clear Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

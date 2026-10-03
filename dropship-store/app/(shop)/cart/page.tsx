"use client";

import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-4xl mb-3 block">📦</span>
          <h1 className="text-2xl font-bold mb-2 text-gray-900 tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Explore our curated products to add items to your cart.
          </p>
          <Link href="/">
            <Button className="w-full">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 flex gap-4 items-center shadow-sm"
            >
              <div className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-50 border border-gray-200 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base truncate">
                  {item.name}
                </h3>
                <p className="font-bold text-emerald-600 text-sm mt-0.5 tabular-nums">
                  {formatPrice(item.price)}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                      }
                      className="px-2.5 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-2.5 py-1 text-xs font-semibold text-gray-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.min(item.stock, item.quantity + 1)
                        )
                      }
                      className="px-2.5 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-600 text-xs font-medium hover:text-red-800 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-base tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Items ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </span>
              <span className="font-semibold text-gray-900 tabular-nums">
                {formatPrice(getTotal())}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-gray-900">
              <span>Total</span>
              <span className="text-emerald-600 tabular-nums">
                {formatPrice(getTotal())}
              </span>
            </div>
          </div>
          <Link href="/checkout" className="block mt-5">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
          <Button onClick={clearCart} variant="ghost" className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700">
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

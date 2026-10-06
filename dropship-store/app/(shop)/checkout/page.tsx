"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<{
    orderKey: string;
    totalAmount: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyAccepted) {
      setErrorMessage(
        "Please review and accept the formulation integrity policy before placing your order."
      );
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          paymentMethod: "QR_CODE",
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: getTotal(),
          totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
        }),
      });

      if (response.ok) {
        const order = await response.json();
        // Keep the cart until the buyer confirms the QR step,
        // then show the seller's payment QR code.
        setPlacedOrder({
          orderKey: order.orderKey,
          totalAmount: order.totalAmount,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(
          errorData.error ||
            "Unable to place order at this moment. Please verify your details and try again."
        );
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      setErrorMessage(
        "Network connectivity issue. Please check your connection and try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQrDone = () => {
    clearCart();
    router.push("/orders");
  };

  const inputCls =
    "w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#3AB7BA] focus:border-[#3AB7BA] shadow-2xs";

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold mb-3 text-gray-900 tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Add items to your cart before proceeding to checkout.
          </p>
          <Button onClick={() => router.push("/")} className="w-full">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 tracking-tight">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-7 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Shipping Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 09171234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Unit / House No., Street, Barangay, City, Province, Postal Code"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Policy confirmation */}
          <div className="rounded-lg border border-[#3AB7BA]/30 bg-[#3AB7BA]/5 p-6 sm:p-7">
            <div className="flex items-center gap-2.5 mb-2.5">
              <svg
                className="w-5 h-5 flex-shrink-0 text-[#1a6f72]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 className="text-base font-bold text-gray-900">
                Formulation Integrity &amp; Final-Sale Policy
              </h3>
            </div>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              To guarantee the highest standards of botanical purity, potency, and hygiene,
              each formulation is freshly inspected, prepared, and sealed upon confirmation.
              Once processed, orders cannot be cancelled or returned (unless delivery fails).
              Please verify your contact and delivery address carefully.
            </p>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={policyAccepted}
                onChange={(e) => {
                  setPolicyAccepted(e.target.checked);
                  if (e.target.checked) setErrorMessage(null);
                }}
                className="mt-0.5 h-4 w-4 rounded text-[#3AB7BA] focus:ring-[#3AB7BA] border-gray-300 cursor-pointer"
              />
              <span className="text-sm font-semibold text-gray-900">
                I understand and accept the formulation integrity and final-sale terms.
              </span>
            </label>
          </div>

        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-900">
            Order Summary
          </h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate max-w-[160px]">
                  {item.name} <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-gray-900 tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3.5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-900 tabular-nums">{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-emerald-600 tabular-nums">{formatPrice(getTotal())}</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium flex items-start gap-2">
              <svg
                className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-6"
            size="lg"
            disabled={!policyAccepted || isProcessing}
          >
            {isProcessing ? "Processing Order..." : "Complete Order"}
          </Button>

          <p className="text-[11px] text-center mt-2.5 text-gray-500">
            After completing, the seller&apos;s payment QR code will appear — scan it to pay.
          </p>

          {!policyAccepted && (
            <p className="text-[11px] text-center mt-2.5 text-gray-400">
              Please confirm the formulation integrity policy above to place your order.
            </p>
          )}
        </div>
      </form>

      {/* Seller payment QR modal */}
      {placedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Seller payment QR code"
        >
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
          <div className="relative w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-xl p-6 text-center">
            <h2 className="text-lg font-bold text-gray-900">
              Order {placedOrder.orderKey} placed!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Scan the seller&apos;s QR code below to pay{" "}
              <span className="font-semibold text-gray-900 tabular-nums">
                {formatPrice(placedOrder.totalAmount)}
              </span>
            </p>
            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
              <img
                src="/seller-qr.jpg"
                alt="Seller payment QR code"
                className="w-full h-auto object-contain"
              />
            </div>
            <Button onClick={handleQrDone} size="lg" className="w-full mt-5">
              Done — View My Orders
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

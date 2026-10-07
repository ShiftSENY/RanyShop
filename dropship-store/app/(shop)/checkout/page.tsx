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
    "w-full px-3.5 py-2.5 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#23271A] placeholder:text-stone-400 outline-none transition-all focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] shadow-2xs";

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg border border-[#E5DFD7] shadow-sm">
          <h1 className="text-2xl font-bold mb-3 text-[#23271A] tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-stone-500 mb-6">
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
      <h1 className="text-2xl font-bold mb-8 text-[#23271A] tracking-tight">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Details */}
          <div className="bg-white rounded-lg border border-[#E5DFD7] p-6 sm:p-7 shadow-sm">
            <h2 className="text-lg font-bold text-[#23271A] mb-4">
              Shipping Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#2D3319] mb-1.5">
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
                <label className="block text-sm font-semibold text-[#2D3319] mb-1.5">
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
                <label className="block text-sm font-semibold text-[#2D3319] mb-1.5">
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
          <div className="rounded-lg border border-[#B35E2B]/30 bg-[#FAF7F2] p-6 sm:p-7">
            <div className="flex items-center gap-2.5 mb-2.5">
              <svg
                className="w-5 h-5 flex-shrink-0 text-[#B35E2B]"
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
              <h3 className="text-base font-bold text-[#23271A]">
                Formulation Integrity &amp; Final-Sale Policy
              </h3>
            </div>
            <p className="text-sm text-stone-700 mb-4 leading-relaxed">
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
                className="mt-0.5 h-4 w-4 rounded text-[#B35E2B] focus:ring-[#B35E2B] border-[#E5DFD7] cursor-pointer"
              />
              <span className="text-sm font-semibold text-[#23271A]">
                I understand and accept the formulation integrity and final-sale terms.
              </span>
            </label>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border border-[#E5DFD7] p-6 sm:p-7 shadow-sm">
            <h2 className="text-lg font-bold text-[#23271A] mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3.5 p-4 border border-[#B35E2B] bg-[#FAF7F2] rounded-lg ring-1 ring-[#B35E2B] select-none">
                <input
                  type="radio"
                  checked
                  disabled
                  className="h-4 w-4 text-[#B35E2B] focus:ring-[#B35E2B] border-[#E5DFD7] cursor-default"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#23271A] text-sm">
                    QR Code
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Scan the seller&apos;s QR code to pay after checkout
                  </p>
                </div>
              </div>
              {(
                [
                  { method: "E-Wallet", desc: "Maya, GoTyme, PayPal, etc." },
                  {
                    method: "Bank Transfer",
                    desc: "Direct bank deposit or transfer",
                  },
                ] as const
              ).map((option) => (
                <div
                  key={option.method}
                  aria-disabled="true"
                  className="flex items-center gap-3.5 p-4 border border-[#E5DFD7] rounded-lg bg-[#FAF7F2]/50 cursor-not-allowed select-none"
                >
                  <input
                    type="radio"
                    disabled
                    className="h-4 w-4 text-stone-300 border-[#E5DFD7] cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-stone-500 text-sm">
                      {option.method}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {option.desc}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-amber-800 bg-amber-100 border border-amber-200 rounded-full px-2.5 py-1 whitespace-nowrap">
                    Coming soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-[#E5DFD7] p-6 h-fit shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-[#23271A]">
            Order Summary
          </h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-stone-600 truncate max-w-[160px]">
                  {item.name} <span className="text-stone-400">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-[#23271A] tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E5DFD7]/60 pt-3.5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span className="font-semibold text-[#23271A] tabular-nums">{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Shipping</span>
              <span className="font-semibold text-emerald-700">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-[#23271A] pt-2 border-t border-[#E5DFD7]/60">
              <span>Total</span>
              <span className="text-emerald-700 tabular-nums">{formatPrice(getTotal())}</span>
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

          <p className="text-[11px] text-center mt-2.5 text-stone-500">
            After completing, the seller&apos;s payment QR code will appear — scan it to pay.
          </p>

          {!policyAccepted && (
            <p className="text-[11px] text-center mt-2.5 text-stone-400">
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
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs" aria-hidden="true" />
          <div className="relative w-full max-w-sm bg-white rounded-xl border border-[#E5DFD7] shadow-xl p-6 text-center max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-[#23271A]">
              Order {placedOrder.orderKey} placed!
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Scan the seller&apos;s QR code below to pay{" "}
              <span className="font-semibold text-[#23271A] tabular-nums">
                {formatPrice(placedOrder.totalAmount)}
              </span>
            </p>
            <div className="mt-4 border border-[#E5DFD7] rounded-lg overflow-hidden">
              <img
                src="/seller-qr.jpg"
                alt="Seller payment QR code"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-left">
              <p className="text-xs font-semibold text-amber-800">
                After your payment succeeds:
              </p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Please send a screenshot of your proof of payment to our
                Facebook page so we can verify and ship your order.
              </p>
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

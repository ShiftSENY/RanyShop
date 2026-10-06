"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/store";
import CartDrawer from "@/components/shop/CartDrawer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [user, setUser] = useState<{
    name?: string | null;
    email?: string | null;
  } | null>(null);

  useEffect(() => {
    getSession().then((session) => setUser(session?.user ?? null));
  }, []);

  const firstName =
    user?.name?.trim().split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Account";

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-full flex flex-col bg-gray-50">
      {/* ── Header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/RanyShop_LOGO.svg"
                alt="RanyShop"
                className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-[#1a6f72] transition-colors">
                RanyShop
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-[#1a6f72] transition-colors"
              >
                Products
              </Link>
              <Link
                href="/orders"
                className="text-sm font-medium text-gray-600 hover:text-[#1a6f72] transition-colors"
              >
                My Orders
              </Link>
            </nav>

            {/* Cart + Login */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-[#1a6f72] transition-colors cursor-pointer rounded-lg hover:bg-gray-100"
                aria-label="Shopping Cart"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 text-white text-[11px] font-semibold w-4.5 h-4.5 rounded-full flex items-center justify-center bg-[#3AB7BA] tabular-nums shadow-2xs">
                    {totalItems}
                  </span>
                )}
              </button>
              {user ? (
                <>
                  <span className="text-sm font-medium text-gray-700 px-3 py-1.5">
                    Logged in as {firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-700 hover:text-[#1a6f72] transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-[#1a6f72] transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="py-7 mt-auto border-t border-gray-800 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-normal tracking-wide">
          © 2026 RanyShop.
        </div>
      </footer>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

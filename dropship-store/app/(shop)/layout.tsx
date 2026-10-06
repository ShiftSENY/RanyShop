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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0 min-w-0">
              <img
                src="/RanyShop_LOGO.svg"
                alt="RanyShop"
                className="h-7 sm:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105 flex-shrink-0"
              />
              <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 group-hover:text-[#1a6f72] transition-colors whitespace-nowrap">
                RanyShop
              </span>
            </Link>

            {/* Nav links (Desktop/Tablet) */}
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

            {/* Actions: Mobile Orders link, Cart, User Info & Auth */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {/* Mobile "My Orders" icon link */}
              <Link
                href="/orders"
                className="md:hidden p-2 text-gray-600 hover:text-[#1a6f72] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="My Orders"
                title="My Orders"
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
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </Link>

              {/* Shopping Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-[#1a6f72] transition-colors cursor-pointer rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3AB7BA]"
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
                  <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] sm:text-[11px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center bg-[#3AB7BA] tabular-nums shadow-2xs">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="h-4 w-px bg-gray-200 mx-0.5 sm:mx-1" aria-hidden="true" />

              {/* User State */}
              {user ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="hidden sm:flex items-center text-xs text-gray-500 font-normal">
                    <span className="hidden lg:inline mr-1">Logged in as</span>
                    <span className="font-semibold text-gray-800 max-w-[100px] md:max-w-[140px] truncate" title={user.name || user.email || ""}>
                      {firstName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#1a6f72] hover:bg-gray-100 transition-colors px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#1a6f72] hover:bg-gray-100 transition-colors px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg"
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

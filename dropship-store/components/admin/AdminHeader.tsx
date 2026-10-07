"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-[#1C2114] text-white border-b border-[#2D3319] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B35E2B] rounded-lg py-1 transition-opacity"
            >
              <img
                src="/RanyShop_b-g_LOGO.png"
                alt="RanyShop"
                className="h-8.5 w-auto object-contain transition-transform group-hover:scale-105 rounded-md"
              />
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  RanyShop
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B35E2B]/25 text-amber-200 border border-[#B35E2B]/40">
                  Admin
                </span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-[#2D3319] text-white shadow-2xs font-semibold border border-[#47522D]"
                      : "text-stone-300 hover:bg-[#2D3319]/80 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#2D3319] border border-[#2D3319] transition-colors"
            >
              <span>View Store</span>
              <svg className="w-3.5 h-3.5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <div className="h-4 w-px bg-[#2D3319]" aria-hidden="true" />
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-xs font-semibold text-stone-300 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/15 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error || !result.ok) {
        setError(
          result?.error === "CredentialsSignin"
            ? "Invalid email or password"
            : "Something went wrong. Please try again later."
        );
        setIsLoading(false);
        return;
      }

      // Confirm the session cookie was actually saved before leaving.
      // Without this, a failed sign-in silently navigates and the
      // route guard bounces straight back to this login page.
      const session = await getSession();
      if (session?.user) {
        // Full page load so the fresh session cookie is present
        // when the guarded dashboard route is requested.
        window.location.href = "/admin/dashboard";
      } else {
        setError("Login could not be completed. Please try again later.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Admin login failed:", err);
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1C2114] py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-[#23271A] p-8 rounded-2xl border border-[#2D3319] shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#B35E2B]/20 text-[#B35E2B] flex items-center justify-center mx-auto mb-3 border border-[#B35E2B]/30 font-bold text-xl">
            R
          </div>
          <h1 className="text-2xl font-bold text-[#FAF7F2] tracking-tight">RanyShop Admin</h1>
          <h2 className="mt-1.5 text-sm text-[#D8D2C5]">
            Sign in to manage your storefront
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-950/80 border border-red-800 text-red-200 p-3.5 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#FAF7F2] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ranyshop.com"
                className="w-full px-3.5 py-2.5 bg-[#1C2114] border border-[#2D3319] rounded-xl text-[#FAF7F2] placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#FAF7F2] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#1C2114] border border-[#2D3319] rounded-xl text-[#FAF7F2] placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#B35E2B] hover:bg-[#984E22] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-md transition-all duration-150 cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

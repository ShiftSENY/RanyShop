"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const isRegister = searchParams.get("register") === "true";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isRegister) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error || !result.ok) {
        if (isRegister && result?.error === "CredentialsSignin") {
          setError("Registration successful. Please sign in.");
          router.push("/login");
        } else if (result?.error === "CredentialsSignin") {
          setError("Invalid email or password");
        } else {
          setError("Something went wrong. Please try again later.");
        }
        setIsLoading(false);
        return;
      }

      // Confirm the session cookie was actually saved before leaving.
      // Without this, a failed sign-in silently navigates and the
      // route guard bounces straight back to this login page.
      const session = await getSession();
      if (session?.user) {
        // Full page load so the fresh session cookie is present
        // when the destination route is requested.
        window.location.href = redirect;
      } else {
        setError("Login could not be completed. Please try again later.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider);
    setError("");
    try {
      await signIn(provider, { callbackUrl: redirect });
    } catch (err) {
      console.error("Social login failed:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setSocialLoading(null);
    }
  };

  const inputCls =
    "w-full px-3.5 py-2.5 bg-white border border-[#E5DFD7] rounded-lg text-sm text-[#23271A] placeholder:text-stone-400 outline-none transition-all focus:ring-2 focus:ring-[#B35E2B] focus:border-[#B35E2B] shadow-2xs";

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 bg-[#FAF7F2]">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl border border-[#E5DFD7] shadow-sm space-y-7">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center group">
            <img src="/RanyShop_b-g_LOGO.png" alt="RanyShop" className="h-12 w-auto object-contain transition-transform group-hover:scale-105 rounded-md" />
            <span className="text-xl font-bold mt-2 text-[#23271A] tracking-tight">
              RanyShop
            </span>
          </Link>
          <h1 className="mt-3 text-xl font-bold tracking-tight text-[#23271A]">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {isRegister ? "Join to easily track orders and faster checkout." : "Sign in to access your orders and account."}
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          {/* Google */}
          <button
            onClick={() => handleSocialLogin("google")}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#E5DFD7] rounded-lg text-sm font-medium text-stone-700 hover:bg-[#FAF7F2] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {socialLoading === "google" ? <span>Signing in...</span> : <span>Continue with Google</span>}
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleSocialLogin("facebook")}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#1877F2] text-white rounded-lg text-sm font-medium hover:bg-[#166FE5] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {socialLoading === "facebook" ? <span>Signing in...</span> : <span>Continue with Facebook</span>}
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5DFD7]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-stone-500 font-medium">
                Or with email
              </span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-[#2D3319] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maria Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-[#2D3319] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2D3319] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 font-medium"
              size="lg"
              disabled={isLoading || socialLoading !== null}
            >
              {isLoading
                ? isRegister
                  ? "Creating account..."
                  : "Signing in..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-500 pt-2 border-t border-[#E5DFD7]/60">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#B35E2B] hover:text-[#984E22] transition-colors"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/login?register=true"
                className="font-semibold text-[#B35E2B] hover:text-[#984E22] transition-colors"
              >
                Register here
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

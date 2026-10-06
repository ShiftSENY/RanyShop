import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Single route guard, built on Auth.js' own session reader.
// (Do NOT use getToken() from next-auth/jwt here: it defaults to the
// non-secure cookie name, so on HTTPS it can never see the
// `__Secure-authjs.session-token` cookie and every login loops.)
export default auth((req) => {
  const { nextUrl } = req;
  const role = (req.auth?.user as { role?: string } | undefined)?.role;

  if (
    nextUrl.pathname.startsWith("/admin") &&
    nextUrl.pathname !== "/admin/login"
  ) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
  }

  if (
    nextUrl.pathname.startsWith("/checkout") ||
    nextUrl.pathname.startsWith("/orders")
  ) {
    if (!req.auth) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("redirect", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*", "/orders/:path*"],
};

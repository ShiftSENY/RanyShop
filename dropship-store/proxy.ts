import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    // Must match the secret fallback in lib/auth.ts, otherwise the
    // proxy can never decrypt the session and every login loops.
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/checkout") || pathname.startsWith("/orders")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*", "/orders/:path*"],
};


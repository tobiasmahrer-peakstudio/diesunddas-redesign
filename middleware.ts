import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken, isAuthConfigured } from "@/lib/auth";

/**
 * Protects /admin routes: without a valid session cookie, visitors
 * are redirected to /admin/login.
 */
export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  // Before ADMIN_PASSWORD/SESSION_SECRET are set there is no session
  // to check yet — let /admin through so its own "not configured"
  // notice is reachable, instead of an unusable redirect loop.
  if (!isAuthConfigured()) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = await verifySessionToken(token);

  if (isAdminRoute && !isLoginRoute && !authenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && authenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

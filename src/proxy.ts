import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//  Public routes (no login needed)
const PUBLIC_ROUTES = ["/login"];

//  Routes that require login
const PROTECTED_ROUTES = ["/dashboard"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //  Get JWT token from cookies
  const token = req.cookies.get("access_token")?.value;

  //  Is route protected?
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  //  Is route public?
  const isPublic = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Not logged in → trying to access protected page
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  //  Logged in → trying to access login again
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

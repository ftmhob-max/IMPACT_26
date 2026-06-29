import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/reset-password",
  "/api/auth/sync-user",
];

const ADMIN_PATHS = ["/admin"];
const AUTH_PAGES = new Set(["/sign-in", "/sign-up", "/reset-password"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const next = () => {
    const response = NextResponse.next();
    if (AUTH_PAGES.has(pathname)) {
      response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    }
    return response;
  };

  // Allow public paths and static assets
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/icon.svg" ||
    pathname === "/impact-logo.svg"
  ) {
    return next();
  }

  // Check for session cookie (set by /api/auth/sync-user after login)
  const session = request.cookies.get("__session")?.value;
  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

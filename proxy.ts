import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Not a security boundary. Every /portal and /admin page and every /api/portal, /api/admin route handler MUST call requireRole().

// Keep same-origin check in sync with lib/env.ts validation.
const rawSignInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
const signInPath =
  rawSignInUrl &&
  rawSignInUrl.startsWith("/") &&
  !rawSignInUrl.startsWith("//") &&
  !rawSignInUrl.startsWith("/\\")
    ? rawSignInUrl
    : "/sign-in";

export default clerkMiddleware(async (auth, req) => {
  const { pathname, search } = req.nextUrl;
  const isProtected =
    pathname === "/portal" ||
    pathname.startsWith("/portal/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (isProtected) {
    const { userId } = await auth();
    if (!userId) {
      const returnTo = `${pathname}${search}`;
      const url = new URL(signInPath, req.url);
      url.searchParams.set("returnTo", returnTo);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};

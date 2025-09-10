import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Κανόνες: 
 * - Αν UNDER_CONSTRUCTION === "true" -> μπλοκάρουμε ό,τι δεν είναι asset/API.
 * - Αν υπάρχει cookie "uc_ok=1" -> παράκαμψη (βλέπεις κανονικά το site).
 * - Εξαιρέσεις: /api, /_next, /static, /favicon, /robots, /sitemap, /under-construction, /__unlock, /__lock
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  const isUC = process.env.UNDER_CONSTRUCTION === "true";
  const hasBypassCookie = req.cookies.get("uc_ok")?.value === "1";

  // Επιτρέπουμε paths που δεν πρέπει να μπλοκάρουν
  const allowed =
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/under-construction") ||
    pathname.startsWith("/__unlock") ||
    pathname.startsWith("/__lock");

  if (isUC && !hasBypassCookie && !allowed) {
    // Redirect στη σελίδα Under Construction
    const dest = new URL("/under-construction", req.url);
    return NextResponse.rewrite(dest, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  return NextResponse.next();
}

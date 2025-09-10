import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Πιάνει τα πάντα εκτός _next (assets) για να μη σπάσει το dev
export const config = { matcher: ["/((?!_next).*)"] };

export function middleware(req: NextRequest) {
  // ΔΕΝ κάνουμε redirect. Μόνο ένα header για απόδειξη.
  const res = NextResponse.next();
  res.headers.set("x-middleware-hit", "yes");
  return res;
}

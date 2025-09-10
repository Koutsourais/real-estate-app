import { NextResponse } from "next/server";

// Παράδειγμα URL: /__unlock?key=TO_MYSTIKO_SOU
export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "";
  if (!process.env.UC_KEY || key !== process.env.UC_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = NextResponse.redirect(new URL("/", url));
  res.cookies.set("uc_ok", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 ώρες
  });
  return res;
}



import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/", url));
  res.cookies.set("uc_ok", "", { path: "/", maxAge: 0 });
  return res;
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, token } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // 🔧 reCAPTCHA OPTIONAL (έως ότου το ρυθμίσεις)
    const requireRecaptcha = process.env.REQUIRE_RECAPTCHA === "true";
    if (requireRecaptcha) {
      const secret = process.env.RECAPTCHA_SECRET_KEY;
      if (!secret) {
        return NextResponse.json({ ok: false, error: "Server misconfigured: RECAPTCHA_SECRET_KEY" }, { status: 500 });
      }
      if (!token) {
        return NextResponse.json({ ok: false, error: "Missing reCAPTCHA token" }, { status: 400 });
      }
      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
        cache: "no-store",
      });
      const verifyJson = await verifyRes.json();
      if (!verifyJson?.success) {
        return NextResponse.json({ ok: false, error: "reCAPTCHA failed" }, { status: 400 });
      }
    }

    // (προαιρετικό) SMTP με nodemailer ... αλλιώς απλά απάντησε επιτυχία
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

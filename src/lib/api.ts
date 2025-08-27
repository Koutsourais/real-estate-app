import { NextResponse } from "next/server";

const WP_API = "https://koutsourais.com/wp-json/wp/v2/real_estate"; // βάση WP endpoint

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") || "";
  const ad_type = searchParams.get("ad_type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // Φέρνουμε "αρκετά" entries από WP (αν μεγαλώσει ο όγκος, θα κάνουμε paginate εδώ)
  const url = `${WP_API}?per_page=100`; // μπορείς να αυξήσεις/μειώσεις
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: "WP fetch failed" }, { status: 500 });
  }
  const items = await res.json();

  // Φιλτράρουμε server-side με βάση ACF
  const filtered = (items as any[]).filter((p) => {
    const acf = p?.acf ?? {};
    const priceNum = Number(String(acf.price ?? "0").replace(/[^\d.]/g, ""));
    const passRegion = region ? acf.region === region : true;
    const passAdType = ad_type ? acf.ad_type === ad_type : true;
    const passMin = minPrice ? priceNum >= Number(minPrice) : true;
    const passMax = maxPrice ? priceNum <= Number(maxPrice) : true;
    return passRegion && passAdType && passMin && passMax;
  });

  return NextResponse.json(filtered);
}

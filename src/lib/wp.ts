const WP_API = "https://koutsourais.com/wp-json/realestate/v1/search";
type MediaItem = {
  id: number;
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export async function fetchPropertyMedia(postId: number): Promise<MediaItem[]> {
  const url = `https://koutsourais.com/wp-json/wp/v2/media?parent=${postId}&per_page=100`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data
    .map((m: any) => ({
      id: m.id,
      url: m?.media_details?.sizes?.large?.source_url || m?.source_url,
      alt: m?.alt_text || m?.title?.rendered || "",
      width: m?.media_details?.sizes?.large?.width || m?.media_details?.width,
      height: m?.media_details?.sizes?.large?.height || m?.media_details?.height,
    }))
    .filter((x: MediaItem) => !!x.url);
}

export async function fetchFromWP(params: Record<string, any>) {
  const sp = new URLSearchParams();
  [
    "region","ad_type","real_estate_type",
    "minPrice","maxPrice","minArea","maxArea",
    "orderby","order","sort",
    "page","per_page","search",
  ].forEach((k) => {
    const v = params[k];
    if (v !== undefined && v !== null && String(v) !== "") sp.set(k, String(v));
  });

  const res = await fetch(`${WP_API}?${sp.toString()}`, { cache: "no-store" });
  const items = await res.json();
  const total = Number(res.headers.get("X-WP-Total") || "0");
  const totalPages = Number(res.headers.get("X-WP-TotalPages") || "1");
  return { items, total, totalPages };
}
// ---- fetch single by slug (ενημέρωση) ----
export async function fetchPropertyBySlug(slug: string) {
  const url = `https://koutsourais.com/wp-json/wp/v2/real_estate?slug=${encodeURIComponent(slug)}&_embed=1`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const arr = await res.json();
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const item = arr[0];

  const acfImageUrl = item?.acf?.image?.url || null;
  let featuredUrl: string | null = null;
  try {
    const media = item?._embedded?.["wp:featuredmedia"]?.[0];
    featuredUrl = media?.source_url || null;
  } catch {}

  // Φωτογραφίες που ανήκουν στο post (attachments)
  const attachments = await fetchPropertyMedia(item.id);

  // Πρώτη θέση: ACF image ή featured (αν υπάρχουν)
  const primary: MediaItem[] = [];
  if (acfImageUrl) primary.push({ id: -1, url: acfImageUrl, alt: item?.acf?.image?.alt || "", width: 1600, height: 1200 });
  else if (featuredUrl) primary.push({ id: -2, url: featuredUrl, alt: item?.title?.rendered || "", width: 1600, height: 1200 });

  // Αποφυγή διπλότυπου URL
  const urls = new Set(primary.map(i => i.url));
  const images = [...primary, ...attachments.filter(a => !urls.has(a.url))];

  return {
    raw: item,
    id: item.id,
    slug: item.slug,
    title: item?.title?.rendered || "",
    contentHtml: item?.content?.rendered || "",
    acf: item?.acf || {},
    images, // <<< επιστρέφουμε ΟΛΕΣ τις φωτό
  };
}

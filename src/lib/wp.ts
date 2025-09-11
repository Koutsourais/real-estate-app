// src/lib/wp.ts

const WP_SEARCH_API = "https://koutsourais.com/wp-json/realestate/v1/search";

export type MediaItem = {
  id: number;
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

// --- helper: χαρτογράφηση ad_type ώστε να δέχεται είτε ελληνικά είτε slugs ---
function normalizeAdType(input?: string): string | undefined {
  if (!input) return undefined;
  const v = String(input).trim().toLowerCase();
  if (v === "sale" || v === "πωληση" || v === "πώληση") return "Πώληση";
  if (v === "rent" || v === "ενοικιαση" || v === "ενοικίαση") return "Ενοικίαση";
  // διαφορετικά, στείλε ό,τι πήρες (αν ήδη είναι σωστή ελληνική τιμή)
  return input;
}

// ===== Gallery από attachments ενός post =====
export async function fetchPropertyMedia(postId: number): Promise<MediaItem[]> {
  const url = `https://koutsourais.com/wp-json/wp/v2/media?parent=${postId}&per_page=50&_fields=id,source_url,alt_text,media_details,title`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data
    .map((m: any) => {
      const large = m?.media_details?.sizes?.large;
      return {
        id: m.id,
        url: large?.source_url || m?.source_url,
        alt: m?.alt_text || m?.title?.rendered || "",
        width: large?.width || m?.media_details?.width,
        height: large?.height || m?.media_details?.height,
      } as MediaItem;
    })
    .filter((x: MediaItem) => !!x.url);
}

// ===== Λίστα ακινήτων με pagination/filters/sort =====
type FetchParams = Record<string, string | undefined>;

export async function fetchFromWP(params: FetchParams) {
  const sp = new URLSearchParams();

  // --- canonical sort από το plugin ---
  // Δεκτά: price-asc | price-desc | area-asc | area-desc | date-desc
  if (params.sort) sp.set("sort", params.sort);

  // --- φίλτρα ---
  if (params.region) sp.set("region", params.region);

  // ad_type: δέξου Πώληση/Ενοικίαση ή sale/rent και στείλε την σωστή τιμή στο WP
  const adType = normalizeAdType(params.ad_type);
  if (adType) sp.set("ad_type", adType);

  if (params.real_estate_type) sp.set("real_estate_type", params.real_estate_type);
  if (params.minPrice) sp.set("minPrice", params.minPrice);
  if (params.maxPrice) sp.set("maxPrice", params.maxPrice);
  if (params.minArea) sp.set("minArea", params.minArea);
  if (params.maxArea) sp.set("maxArea", params.maxArea);
  if (params.search) sp.set("search", params.search);

  // --- pagination defaults (ευθυγραμμισμένα με plugin: default 12) ---
  sp.set("page", params.page ? String(params.page) : "1");
  sp.set("per_page", params.per_page ? String(params.per_page) : "12");

  // --- Συμβατότητα με ΠΑΛΙΑ order/orderby (αν δεν ήρθε sort) ---
  if (!params.sort) {
    if (params.orderby) sp.set("orderby", params.orderby);
    if (params.order) sp.set("order", params.order);
  }

  const url = `${WP_SEARCH_API}?${sp.toString()}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    // Μην σκάει το UI
    return { items: [], total: 0, totalPages: 1 };
  }

  const data = await res.json();
  const total = Number(res.headers.get("X-WP-Total") || "0");
  const totalPages = Number(res.headers.get("X-WP-TotalPages") || "1");

  return {
    items: Array.isArray(data) ? data : [],
    total,
    totalPages,
  };
}

// ===== Λεπτομέρεια ακινήτου με slug =====
export async function fetchPropertyBySlug(slug: string) {
  const url = `https://koutsourais.com/wp-json/wp/v2/real_estate?slug=${encodeURIComponent(
    slug
  )}&_embed=1`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const arr = await res.json();
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const item = arr[0];

  // ACF κύρια εικόνα
  const acfImageUrl: string | null = item?.acf?.image?.url || null;

  // featured image (από _embed)
  let featuredUrl: string | null = null;
  try {
    const media = item?._embedded?.["wp:featuredmedia"]?.[0];
    featuredUrl = media?.source_url || null;
  } catch {
    /* noop */
  }

  // Συλλογή attachments (gallery)
  const attachments = await fetchPropertyMedia(item.id);

  // Επιλογή κύριας εικόνας
  const primary: MediaItem[] = [];
  if (acfImageUrl) {
    primary.push({
      id: -1,
      url: acfImageUrl,
      alt: item?.acf?.image?.alt || item?.title?.rendered || "",
      width: 1600,
      height: 1200,
    });
  } else if (featuredUrl) {
    primary.push({
      id: -2,
      url: featuredUrl,
      alt: item?.title?.rendered || "",
      width: 1600,
      height: 1200,
    });
  }

  // Μην διπλοπεράσουμε ίδια URL
  const seen = new Set(primary.map((x) => x.url));
  const images = [...primary, ...attachments.filter((a) => !seen.has(a.url))];

  // Αφαιρούμε <img> από το content (προαιρετικό)
  const contentHtml: string = item?.content?.rendered || "";
  const contentHtmlNoImages = contentHtml.replace(/<img[^>]*>/gi, "");

  return {
    raw: item,
    id: item.id,
    slug: item.slug,
    title: item?.title?.rendered || "",
    contentHtml,           // πλήρες
    contentHtmlNoImages,   // χωρίς <img>
    acf: item?.acf || {},
    imageUrl: images.length ? images[0].url : null, // κύρια
    images,                // gallery
  };
}

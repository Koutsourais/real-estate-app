// src/components/home/HomeFeatured.tsx
import Link from "next/link";
import Image from "next/image";
import { fetchFromWP } from "@/lib/wp";

function normalizedSlug(s: string) {
  try { return encodeURIComponent(decodeURIComponent(s)); }
  catch { return encodeURIComponent(s); }
}

function formatPrice(p?: string | number) {
  if (p === undefined || p === null || p === "") return null;
  const n = Number(String(p).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) return null;
  return n.toLocaleString("el-GR") + " €";
}

export default async function HomeFeatured() {
  // Φέρνουμε 3 νεότερα με ad_type=Πώληση
  const { items } = await fetchFromWP({
    ad_type: "Πώληση",
    sort: "date-desc",
    per_page: "3",
    page: "1",
  });

  if (!Array.isArray(items) || items.length === 0) {
    return null; // αν δεν έχει τίποτα, κρύψτο διακριτικά
  }

  return (
    <section className="container-safe my-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Ενδεικτικά ακίνητα</h2>
        <Link href="/sales" className="text-sm text-blue-600 hover:underline">
          Δες όλα →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it: any) => {
          const acf = it?.acf ?? {};
          const img = acf?.image;
          const price = formatPrice(acf?.price);
          const title = it?.title?.rendered || "Ακίνητο";
          const slug = normalizedSlug(it?.slug || String(it?.id || ""));

          return (
            <article
              key={it.id}
              className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition"
            >
              <Link href={`/real-estate/${slug}`} className="block">
                <div className="aspect-[4/3] w-full bg-gray-100 relative">
                  {img?.url ? (
                    <Image
                      src={img.url}
                      alt={img.alt || title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                      Χωρίς εικόνα
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <h3 className="font-medium line-clamp-1">
                  <Link href={`/real-estate/${slug}`} className="hover:text-blue-600">
                    {title}
                  </Link>
                </h3>

                <div className="mt-1 text-sm text-gray-600 line-clamp-1">
                  {acf?.region || "—"}
                </div>

                {price && (
                  <div className="text-green-700 font-semibold mt-1">{price}</div>
                )}

                <div className="mt-2">
                  <Link
                    href={`/real-estate/${slug}`}
                    className="text-sm text-blue-600 underline"
                  >
                    Περισσότερα
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

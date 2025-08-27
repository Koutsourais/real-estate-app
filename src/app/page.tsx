// MAIN

import Image from "next/image";
import Link from "next/link";
import { fetchFromWP } from "@/lib/wp";
import TopBar from "@/components/TopBar";
import FiltersSidebar from "@/components/FiltersSidebar";

type Search = {
  region?: string;
  ad_type?: string;
  real_estate_type?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  orderby?: string; // price | area | date
  order?: string;   // ASC | DESC
  page?: string;
  per_page?: string;
  view?: string;    // list | grid
};

function buildQS(params: Record<string, string | undefined>, overrides?: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  const merged = { ...params, ...(overrides || {}) };
  Object.entries(merged).forEach(([k, v]) => {
    if (v && v !== "") sp.set(k, v);
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// 🔧 helper: βγάζει <img> από HTML + καθαρίζει κενές παραγράφους
function stripImagesFromHtml(html: string) {
  if (!html) return "";
  let out = html.replace(/<img[^>]*>/gi, "");
  // καθάρισε <figure> με εικόνες (αν βάζει Gutenberg)
  out = out.replace(/<figure[\s\S]*?<\/figure>/gi, "");
  // καθάρισε άδειες παραγράφους
  out = out.replace(/<p>\s*<\/p>/g, "");
  return out;
}

export default async function HomePage({ searchParams }: { searchParams: Search }) {
  const { items, total, totalPages } = await fetchFromWP(searchParams || {});
  const currentPage = Number(searchParams.page || 1);

  const viewMode = searchParams.view === "grid" ? "grid" : "list";

  return (
    <main className="p-6">
      {/* Top Bar */}
      <TopBar />

      {/* Κάτω τμήμα: Sidebar + List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar (αριστερά) */}
        <div className="md:col-span-3">
          <FiltersSidebar />
        </div>

        {/* Λίστα (δεξιά) */}
        <div className="md:col-span-9">
          {(items as any[]).length === 0 ? (
            <p>Δεν βρέθηκαν ακίνητα με τα επιλεγμένα φίλτρα.</p>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid gap-6 grid-cols-1"
              }
            >
              {(items as any[]).map((property) => {
                const acf = property?.acf ?? {};
                const img = acf?.image ?? null;
                const price =
                  typeof acf.price !== "undefined" && acf.price !== ""
                    ? Number(String(acf.price).replace(/[^\d.]/g, "")).toLocaleString("el-GR")
                    : null;

                // 🔸 κόψιμο εικόνων από το content για να μη βγαίνουν στις κάρτες
                const cleanExcerpt = property.content?.rendered
                  ? stripImagesFromHtml(property.content.rendered)
                  : "";

                return (
                  <div
                    key={property.id}
                    className={`bg-white border rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden 
                      ${viewMode === "grid" ? "flex flex-col" : "flex flex-col md:flex-row"}
                    `}
                  >
                    {/* Εικόνα από ACF μόνο (όχι από editor/attachments) */}
                    {img?.url && (
                      <div
                        className={
                          viewMode === "grid"
                            ? "w-full h-48 overflow-hidden"
                            : "w-full md:w-[200px] h-[200px] md:h-auto flex-shrink-0 overflow-hidden"
                        }
                      >
                        <Image
                          src={img.url}
                          alt={img.alt || property.title?.rendered || "Ακίνητο"}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Περιεχόμενο */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          <Link href={`/real-estate/${normalizedSlug(property.slug)}`} className="hover:text-blue-600 transition-colors">
                            {property.title?.rendered || "Χωρίς τίτλο"}
                          </Link>
                        </h2>
                        {price && <p className="text-2xl font-bold text-green-600 mb-2">{price} €</p>}
                        <div className="text-sm text-gray-600 space-y-1">
                          {acf.region && <p>📍 {acf.region}</p>}
                          {acf.ad_type && <p>🏷️ {acf.ad_type}</p>}
                          {acf.real_estate_type && <p>🏠 {acf.real_estate_type}</p>}
                          {acf.area && <p>📐 {acf.area} m²</p>}
                        </div>

                        {/* περιγραφή ΧΩΡΙΣ εικόνες + line-clamp */}
                        {cleanExcerpt && (
                          <div
                            className="prose prose-sm text-gray-700 mt-3 line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: cleanExcerpt }}
                          />
                        )}
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/real-estate/${normalizedSlug(property.slug)}`}
                          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Δείτε περισσότερα →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <Link
                aria-disabled={currentPage <= 1}
                className={`px-4 py-2 border rounded ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                href={buildQS(
                  searchParams as Record<string, string | undefined>,
                  { page: String(Math.max(1, currentPage - 1)) }
                )}
              >
                ← Προηγούμενη
              </Link>

              <span className="text-sm text-gray-600">
                Σελίδα {currentPage} από {totalPages} • {total.toLocaleString("el-GR")} ακίνητα
              </span>

              <Link
                aria-disabled={currentPage >= totalPages}
                className={`px-4 py-2 border rounded ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                href={buildQS(
                  searchParams as Record<string, string | undefined>,
                  { page: String(Math.min(totalPages, currentPage + 1)) }
                )}
              >
                Επόμενη →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function normalizedSlug(s: string) {
  try {
    return encodeURIComponent(decodeURIComponent(s));
  } catch {
    return encodeURIComponent(s);
  }
}

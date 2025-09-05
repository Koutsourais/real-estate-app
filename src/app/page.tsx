// src/app/page.tsx
// MAIN
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { fetchFromWP } from "@/lib/wp";
import TopBar from "@/components/TopBar";
import FiltersSidebar from "@/components/FiltersSidebar";

// Χάρτης μόνο client-side
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

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

function buildQS(
  params: Record<string, string | undefined>,
  overrides?: Record<string, string | undefined>
) {
  const sp = new URLSearchParams();
  const merged = { ...params, ...(overrides || {}) };
  Object.entries(merged).forEach(([k, v]) => {
    if (v && v !== "") sp.set(k, v);
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export default async function HomePage({ searchParams }: { searchParams: Search }) {
  // SSR fetch από WP
  const { items, total, totalPages } = await fetchFromWP(searchParams || {});
  const currentPage = Number(searchParams.page || 1);

  // view mode
  const viewMode = searchParams.view === "grid" ? "grid" : "list";
  const isGrid = viewMode === "grid";

  return (
    <main className="p-6 container-safe">
      {/* Top Bar */}
      <TopBar />

      {/* Layout με sidebar + λίστα */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        {/* Sidebar */}
        <div className="md:col-span-3">
          <FiltersSidebar />
        </div>

        {/* Δεξιά στήλη: Λίστα + Χάρτης */}
        <div className="md:col-span-9">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Λίστα */}
            <div className="lg:col-span-2">
              {(items as any[]).length === 0 ? (
                <p>Δεν βρέθηκαν ακίνητα με τα επιλεγμένα φίλτρα.</p>
              ) : (
                <div
                  className={
                    isGrid
                      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
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

                    return (
                      <div
                        key={property.id}
                        className={[
                          "bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden",
                          isGrid
                            ? "flex flex-col"
                            : "flex flex-col md:flex-row md:h-[160px]",
                        ].join(" ")}
                      >
                        {/* Εικόνα / Placeholder */}
                        <div
                          className={[
                            isGrid
                              ? "w-full h-36 overflow-hidden"
                              : "w-full h-[140px] md:h-full md:w-[200px] flex-shrink-0 overflow-hidden",
                          ].join(" ")}
                        >
                          {img?.url ? (
                            <Image
                              src={img.url}
                              alt={img.alt || property.title?.rendered || "Ακίνητο"}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                              Χωρίς εικόνα
                            </div>
                          )}
                        </div>

                        {/* Περιεχόμενο */}
                        <div
                          className={
                            isGrid
                              ? "p-4 flex flex-col gap-2"
                              : "p-4 md:p-4 flex flex-col justify-between flex-1 overflow-hidden"
                          }
                        >
                          <div>
                            <h2 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                              <Link
                                href={`/real-estate/${normalizedSlug(property.slug)}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {property.title?.rendered || "Χωρίς τίτλο"}
                              </Link>
                            </h2>

                            {price && (
                              <p className="text-lg font-bold text-green-600 mb-1">{price} €</p>
                            )}

                            <div className="text-xs text-gray-600 space-y-0.5">
                              {acf.region && <p className="line-clamp-1">📍 {acf.region}</p>}
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                {acf.ad_type && (
                                  <span className="line-clamp-1">🏷️ {acf.ad_type}</span>
                                )}
                                {acf.real_estate_type && (
                                  <span className="line-clamp-1">🏠 {acf.real_estate_type}</span>
                                )}
                                {acf.area && <span>📐 {acf.area} m²</span>}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2">
                            <Link
                              href={`/real-estate/${normalizedSlug(property.slug)}`}
                              className="inline-block bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-blue-700 transition"
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
                    className={`px-4 py-2 border rounded ${
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100"
                    }`}
                    href={buildQS(searchParams as Record<string, string | undefined>, {
                      page: String(Math.max(1, currentPage - 1)),
                    })}
                  >
                    ← Προηγούμενη
                  </Link>

                  <span className="text-sm text-gray-600">
                    Σελίδα {currentPage} από {totalPages} •{" "}
                    {total.toLocaleString("el-GR")} ακίνητα
                  </span>

                  <Link
                    aria-disabled={currentPage >= totalPages}
                    className={`px-4 py-2 border rounded ${
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100"
                    }`}
                    href={buildQS(searchParams as Record<string, string | undefined>, {
                      page: String(Math.min(totalPages, currentPage + 1)),
                    })}
                  >
                    Επόμενη →
                  </Link>
                </div>
              )}
            </div>

            {/* Χάρτης: δίνουμε ΟΛΑ τα items και αφήνουμε το MapView να βάλει pins μόνο όπου έχει coordinates */}
            <div className="lg:col-span-1">
              <MapView items={items as any[]} />
            </div>
          </div>
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

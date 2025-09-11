// src/components/ListingsPageShell.tsx
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import FiltersSidebar from "@/components/FiltersSidebar";
import { fetchFromWP } from "@/lib/wp";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type Search = {
  region?: string;
  ad_type?: string;
  real_estate_type?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  sort?: string;       // price-asc | price-desc | area-asc | area-desc | date-desc
  orderby?: string;    // legacy
  order?: string;      // legacy
  page?: string;
  per_page?: string;
  view?: string;       // list | grid
  search?: string;
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

function normalizedSlug(s: string) {
  try {
    return encodeURIComponent(decodeURIComponent(s));
  } catch {
    return encodeURIComponent(s);
  }
}

export default async function ListingsPageShell({
  searchParams,
  title,
  fixedAdType, // "Πώληση" | "Ενοικίαση" (προαιρετικό)
}: {
  searchParams: Search;
  title: string;
  fixedAdType?: string;
}) {
  // Κλειδώνουμε το ad_type όταν έχει δοθεί fixedAdType
  const effectiveParams: Record<string, string | undefined> = {
    ...searchParams,
    ...(fixedAdType ? { ad_type: fixedAdType } : {}),
  };

  // Fetch από WP με τα effective params
  const { items, total, totalPages } = await fetchFromWP(effectiveParams);
  const currentPage = Number(searchParams.page || 1);

  const viewMode = searchParams.view === "grid" ? "grid" : "list";
  const isGrid = viewMode === "grid";

  return (
    <>
      {/* Προαιρετικός τίτλος σελίδας */}
      <h1 className="mt-2 text-2xl font-semibold">{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        {/* Sidebar φίλτρων */}
        <div className="md:col-span-3">
          <FiltersSidebar hideAdType={!!fixedAdType} fixedAdType={fixedAdType} />
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

              {/* Pagination — κρατάει το fixed ad_type μέσα στο URL */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <Link
                    aria-disabled={currentPage <= 1}
                    className={`px-4 py-2 border rounded ${
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100"
                    }`}
                    href={buildQS(effectiveParams as any, {
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
                    href={buildQS(effectiveParams as any, {
                      page: String(Math.min(totalPages, currentPage + 1)),
                    })}
                  >
                    Επόμενη →
                  </Link>
                </div>
              )}
            </div>

            {/* Χάρτης (sticky) */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div className="h-[50vh] lg:h-[calc(100vh-12rem)] rounded-xl overflow-hidden border">
                  <MapView items={items as any[]} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

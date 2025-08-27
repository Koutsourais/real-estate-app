// src/app/page.tsx

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

// Ασφαλές απόσπασμα περιγραφής (χωρίς img)
function excerptFrom(contentHtml?: string, fallback?: string) {
  if (!contentHtml && !fallback) return "";
  const raw = contentHtml || fallback || "";
  // βγάζουμε εικόνες & scripts
  const noImgs = raw.replace(/<img[^>]*>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "");
  // αφαιρούμε tags & κόβουμε ~180 χαρακτήρες
  const text = noImgs.replace(/<[^>]+>/g, "").trim();
  return text.length > 180 ? text.slice(0, 180) + "…" : text;
}

export default async function HomePage({ searchParams }: { searchParams: Search }) {
  // SSR fetch από WP
  const { items, total, totalPages } = await fetchFromWP(searchParams || {});
  const currentPage = Number(searchParams.page || 1);

  // Ανάγνωση mode εμφάνισης
  const viewMode = searchParams.view === "grid" ? "grid" : "list";

  return (
    <main className="p-6 container-safe">
      {/* Top bar (αναζήτηση/ταξινόμηση/clear) */}
      <TopBar />

      {/* Μικρή action-bar επάνω από τα αποτελέσματα: toggle list/grid + count */}
      <div className="mt-4 mb-2 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Βρέθηκαν <span className="font-medium text-gray-900">{total}</span> ακίνητα
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-dark">Εμφάνιση:</span>
          <Link
            href={buildQS(searchParams as any, { view: "list", page: "1" })}
            className={`btn ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
            aria-pressed={viewMode === "list"}
          >
            Λίστα
          </Link>
          <Link
            href={buildQS(searchParams as any, { view: "grid", page: "1" })}
            className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
            aria-pressed={viewMode === "grid"}
          >
            Grid
          </Link>
        </div>
      </div>

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

                const snippet = excerptFrom(property?.content?.rendered);

                return (
                  <div
                    key={property.id}
                    className={`ui-card overflow-hidden transition hover:shadow-lg ${
                      viewMode === "grid" ? "flex flex-col" : "flex flex-col md:flex-row"
                    }`}
                  >
                    {/* Εικόνα */}
                    {img?.url && (
                      <div
                        className={
                          viewMode === "grid"
                            ? "w-full h-48 overflow-hidden"
                            : "w-full md:w-[220px] h-[180px] flex-shrink-0 overflow-hidden"
                        }
                      >
                        <Image
                          src={img.url}
                          alt={img.alt || property.title?.rendered || "Ακίνητο"}
                          width={440}
                          height={330}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Περιεχόμενο */}
                    <div className={`p-5 flex flex-col justify-between flex-1 ${viewMode === "grid" ? "text-center" : ""}`}>
                      <div>
                        <h2 className={`font-semibold text-secondary-dark mb-2 ${viewMode === "grid" ? "text-md" : "text-lg"}`}>
                          <Link
                            href={`/real-estate/${normalizedSlug(property.slug)}`}
                            className="hover:text-primary transition-colors"
                          >
                            {property.title?.rendered || "Χωρίς τίτλο"}
                          </Link>
                        </h2>

                        {price && (
                          <p className={`font-bold text-primary mb-2 ${viewMode === "grid" ? "text-lg" : "text-xl"}`}>
                            {price} €
                          </p>
                        )}

                        <div className={`text-sm text-gray-600 ${viewMode === "grid" ? "space-y-1" : "space-y-1"}`}>
                          {acf.region && <p>📍 {acf.region}</p>}
                          {acf.ad_type && <p>🏷️ {acf.ad_type}</p>}
                          {acf.real_estate_type && <p>🏠 {acf.real_estate_type}</p>}
                          {acf.area && <p>📐 {acf.area} m²</p>}
                        </div>

                        {/* μικρό απόσπασμα χωρίς εικόνες */}
                        {snippet && (
                          <p className={`mt-3 text-sm text-gray-700 ${viewMode === "grid" ? "line-clamp-3" : "line-clamp-2"}`}>
                            {snippet}
                          </p>
                        )}
                      </div>

                      <div className={`mt-4 ${viewMode === "grid" ? "mx-auto" : ""}`}>
                        <Link
                          href={`/real-estate/${normalizedSlug(property.slug)}`}
                          className="btn btn-primary"
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

          {/* Pagination (κρατάει τα φίλτρα) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <Link
                aria-disabled={currentPage <= 1}
                className={`btn btn-ghost ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                href={buildQS(searchParams as any, { page: String(Math.max(1, currentPage - 1)) })}
              >
                ← Προηγούμενη
              </Link>

              <span className="text-sm text-gray-600">
                Σελίδα {currentPage} από {totalPages} • {total.toLocaleString("el-GR")} ακίνητα
              </span>

              <Link
                aria-disabled={currentPage >= totalPages}
                className={`btn btn-ghost ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                href={buildQS(searchParams as any, { page: String(Math.min(totalPages, currentPage + 1)) })}
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

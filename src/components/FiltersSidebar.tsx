// src/components/FiltersSidebar.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useFilters } from "@/context/FiltersContext";
import { useEffect, useMemo } from "react";

export default function FiltersSidebar({
  hideAdType = false,
  fixedAdType, // π.χ. "Πώληση" ή "Ενοικίαση" για συμβατότητα με το υπάρχον URL σου
}: {
  hideAdType?: boolean;
  fixedAdType?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, setFilters } = useFilters();

  // --- sync context με URL
  useEffect(() => {
    const obj: Record<string, string> = {};
    searchParams?.forEach((v, k) => (obj[k] = v));
    setFilters(obj);
  }, [searchParams, setFilters]);

  // --- helper: φτιάξε νέο URL κρατώντας το τρέχον pathname (π.χ. /sales, /rentals)
  const pushWithParams = (params: URLSearchParams) => {
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  // --- ενημέρωσε/καθάρισε ένα query param & reset στη σελίδα 1
  const updateFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value && value !== "") params.set(name, value);
    else params.delete(name);
    params.delete("page");
    // αν υπάρχει fixedAdType, κλείδωσέ το πάντα
    if (fixedAdType) params.set("ad_type", fixedAdType);
    pushWithParams(params);
  };

  // --- όταν δίνεται fixedAdType, βεβαιώσου ότι υπάρχει στο URL (και κρύψε το φίλτρο)
  useEffect(() => {
    if (!fixedAdType) return;
    const params = new URLSearchParams(searchParams?.toString());
    const current = params.get("ad_type");
    if (current !== fixedAdType) {
      params.set("ad_type", fixedAdType);
      params.delete("page");
      pushWithParams(params);
    }
    // δεν βάζουμε dependency το searchParams για να μην κάνουμε loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedAdType, pathname]);

  // για checked στα checkbox (ένα-το-ένα όπως το είχες)
  const isTypeChecked = (t: string) => filters.real_estate_type === t;
  const isAdTypeChecked = (t: string) => filters.ad_type === t;

  return (
    <aside className="ui-card p-5 space-y-6 sticky top-28">
      <h2 className="text-lg font-semibold text-gray-800">Φίλτρα</h2>

      {/* Τιμή */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Τιμή (€)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Από"
            className="input"
            value={filters.minPrice || ""}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="Έως"
            className="input"
            value={filters.maxPrice || ""}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Εμβαδόν */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Εμβαδόν (m²)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Από"
            className="input"
            value={filters.minArea || ""}
            onChange={(e) => updateFilter("minArea", e.target.value)}
          />
          <input
            type="number"
            placeholder="Έως"
            className="input"
            value={filters.maxArea || ""}
            onChange={(e) => updateFilter("maxArea", e.target.value)}
          />
        </div>
      </div>

      {/* Τύπος Ακινήτου */}
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">Τύπος Ακινήτου</span>
        {["House", "Apartment", "Warehouse", "Plot"].map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isTypeChecked(t)}
              onChange={(e) =>
                updateFilter("real_estate_type", e.target.checked ? t : "")
              }
            />
            {t}
          </label>
        ))}
      </div>

      {/* Τύπος Αγγελίας (κρύβεται όταν hideAdType=true) */}
      {!hideAdType && (
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Τύπος Αγγελίας</span>
          {["Πώληση", "Ενοικίαση"].map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isAdTypeChecked(t)}
                onChange={(e) => updateFilter("ad_type", e.target.checked ? t : "")}
              />
              {t}
            </label>
          ))}
        </div>
      )}
    </aside>
  );
}

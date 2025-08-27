"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useFilters } from "@/context/FiltersContext";
import { useEffect } from "react";

export default function FiltersSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilters } = useFilters();

  // Αν filters είναι undefined -> fallback σε κενό object
  const safeFilters = filters || {};

  // Συγχρονισμός με το URL
  useEffect(() => {
    const obj: Record<string, string> = {};
    searchParams?.forEach((v, k) => (obj[k] = v));
    setFilters(obj);
  }, [searchParams, setFilters]);

  const updateFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value && value !== "") params.set(name, value);
    else params.delete(name);
    params.delete("page"); // reset σελίδας
    router.push(`/?${params.toString()}`);
  };

  return (
    <aside className="ui-card p-5 space-y-6 sticky top-28">
      <h2 className="text-lg font-semibold text-secondary-dark">Φίλτρα</h2>

      {/* Τιμή */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Τιμή (€)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Από"
            className="input"
            value={safeFilters.minPrice || ""}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="Έως"
            className="input"
            value={safeFilters.maxPrice || ""}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Εμβαδόν */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Εμβαδόν (m²)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Από"
            className="input"
            value={safeFilters.minArea || ""}
            onChange={(e) => updateFilter("minArea", e.target.value)}
          />
          <input
            type="number"
            placeholder="Έως"
            className="input"
            value={safeFilters.maxArea || ""}
            onChange={(e) => updateFilter("maxArea", e.target.value)}
          />
        </div>
      </div>

      {/* Τύπος Ακινήτου */}
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Τύπος Ακινήτου
        </span>
        {["House", "Apartment", "Warehouse", "Plot"].map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={safeFilters.real_estate_type === t}
              onChange={(e) =>
                updateFilter("real_estate_type", e.target.checked ? t : "")
              }
            />
            {t}
          </label>
        ))}
      </div>

      {/* Τύπος Αγγελίας */}
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Τύπος Αγγελίας
        </span>
        {["Πώληση", "Ενοικίαση"].map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={safeFilters.ad_type === t}
              onChange={(e) =>
                updateFilter("ad_type", e.target.checked ? t : "")
              }
            />
            {t}
          </label>
        ))}
      </div>
    </aside>
  );
}

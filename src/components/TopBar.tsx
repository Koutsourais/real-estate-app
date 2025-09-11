// src/components/TopBar.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

type SuggestItem = {
  id: number;
  slug: string;
  title?: { rendered?: string };
  acf?: {
    region?: string;
    price?: string | number;
    image?: { url?: string; alt?: string };
  };
};

function debounce<T extends (...args: any[]) => void>(fn: T, ms = 350) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export default function TopBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ---- Local UI state
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState("date-desc"); // price-asc|price-desc|area-asc|area-desc|date-desc
  const [view, setView] = useState<"list" | "grid">("list");

  // ---- Suggestions (by region)
  const [suggestions, setSuggestions] = useState<SuggestItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ---- Sync URL -> UI
  useEffect(() => {
    const urlRegion = searchParams?.get("region") || "";
    setRegion(urlRegion);

    const urlSort = searchParams?.get("sort") || "date-desc";
    setSort(urlSort);

    const urlView = (searchParams?.get("view") as "list" | "grid") || "list";
    setView(urlView);
  }, [searchParams]);

  // ---- Helper: push preserving current route (/, /sales, /rentals, …)
  const pushWithParams = useCallback(
    (params: URLSearchParams) => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname]
  );

  // ---- Helper: set a single query param (and reset page)
  const setParam = useCallback(
    (name: string, value?: string | null) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (value && value !== "") params.set(name, value);
      else params.delete(name);
      // sort is canonical → καθάρισε legacy order/orderby
      if (name === "sort") {
        params.delete("order");
        params.delete("orderby");
      }
      params.delete("page");
      pushWithParams(params);
    },
    [searchParams, pushWithParams]
  );

  // ---- Clear all (μένεις στο ίδιο route)
  const handleClear = () => {
    setRegion("");
    setSort("date-desc");
    setView("list");
    setSuggestions([]);
    setOpen(false);
    router.push(pathname); // καθαρό URL στο ίδιο route
  };

  // ---- Live suggestions for region
  const fetchSuggestions = useMemo(
    () =>
      debounce(async (term: string) => {
        if (!term || term.trim().length < 2) {
          setSuggestions([]);
          setLoading(false);
          return;
        }
        try {
          setLoading(true);
          const url = `https://koutsourais.com/wp-json/realestate/v1/search?region=${encodeURIComponent(
            term
          )}&per_page=8`;
          const res = await fetch(url, { cache: "no-store" });
          const data = (await res.json()) as SuggestItem[];
          setSuggestions(Array.isArray(data) ? data : []);
        } catch {
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 350),
    []
  );

  useEffect(() => {
    setLoading(true);
    fetchSuggestions(region);
    setOpen(!!region && region.trim().length >= 2);
  }, [region, fetchSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="sticky top-16 z-40 bg-white border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      {/* Καθαρισμός */}
      <button
        type="button"
        className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
        onClick={handleClear}
      >
        Καθαρισμός
      </button>

      {/* Περιοχή με προτάσεις */}
      <div className="relative flex-1 max-w-xl">
        <input
          ref={inputRef}
          type="text"
          placeholder="Περιοχή (π.χ. Αθήνα, Πλάκα)…"
          className="input w-full"
          value={region}
          onChange={(e) => {
            const v = e.target.value;
            setRegion(v);
            setParam("region", v || null); // apply immediately
          }}
          onFocus={() => {
            if (region && region.trim().length >= 2) setOpen(true);
          }}
          aria-expanded={open}
          aria-controls="region-suggestions"
          aria-autocomplete="list"
          role="combobox"
        />

        {open && (
          <div
            id="region-suggestions"
            ref={dropdownRef}
            className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-auto"
          >
            {loading && (
              <div className="p-3 text-sm text-gray-500">Αναζήτηση…</div>
            )}
            {!loading && suggestions.length === 0 && (
              <div className="p-3 text-sm text-gray-500">
                Δεν βρέθηκαν αποτελέσματα
              </div>
            )}

            {!loading &&
              suggestions.map((it) => {
                const title = it?.title?.rendered || "Χωρίς τίτλο";
                const reg = it?.acf?.region || "";
                const price =
                  it?.acf?.price !== undefined && it?.acf?.price !== ""
                    ? Number(String(it.acf!.price).replace(/[^\d.]/g, "")).toLocaleString("el-GR")
                    : null;

                return (
                  <Link
                    key={it.id}
                    href={`/real-estate/${encodeURIComponent(it.slug)}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {title}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {reg} {price ? `• ${price} €` : ""}
                      </div>
                    </div>
                  </Link>
                );
              })}

            {!loading && suggestions.length > 0 && (
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t"
                onClick={() => setOpen(false)}
              >
                Προβολή όλων αποτελεσμάτων για “{region}”
              </button>
            )}
          </div>
        )}
      </div>

      {/* Εναλλαγή προβολής: List / Grid */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-pressed={view === "list"}
          className={`px-3 py-2 rounded border text-sm ${
            view === "list" ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"
          }`}
          onClick={() => {
            setView("list");
            setParam("view", "list");
          }}
        >
          Λίστα
        </button>
        <button
          type="button"
          aria-pressed={view === "grid"}
          className={`px-3 py-2 rounded border text-sm ${
            view === "grid" ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"
          }`}
          onClick={() => {
            setView("grid");
            setParam("view", "grid");
          }}
        >
          Grid
        </button>
      </div>

      {/* Ταξινόμηση (συμβατό με plugin: ?sort=...) */}
      <label className="sr-only" htmlFor="sort-select">Ταξινόμηση</label>
      <select
        id="sort-select"
        className="select text-sm"
        value={sort}
        onChange={(e) => {
          const val = e.target.value;
          setSort(val);
          setParam("sort", val);
        }}
      >
        <option value="date-desc">Νεότερα</option>
        <option value="price-asc">Τιμή ↑</option>
        <option value="price-desc">Τιμή ↓</option>
        <option value="area-asc">Εμβαδόν ↑</option>
        <option value="area-desc">Εμβαδόν ↓</option>
      </select>
    </div>
  );
}

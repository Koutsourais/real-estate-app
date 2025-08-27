"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFilters } from "@/context/FiltersContext";
import Link from "next/link";

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

export default function TopBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearFilters } = useFilters();

  // controlled inputs
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState("date-desc");

  // live suggestions
  const [q, setQ] = useState(""); // what user types
  const [suggestions, setSuggestions] = useState<SuggestItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // sync από URL
  useEffect(() => {
    const urlRegion = searchParams?.get("region") || "";
    setRegion(urlRegion);
    setQ(urlRegion);
    const orderby = searchParams?.get("orderby") || "date";
    const order = (searchParams?.get("order") || "desc").toLowerCase();
    setSort(`${orderby}-${order}`);
  }, [searchParams]);

  // helper: update URL param + reset στη σελίδα 1
  const updateFilter = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (value && value !== "") params.set(name, value);
      else params.delete(name);
      params.delete("page");
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  // clear όλα (και sidebar μέσω context)
  const handleClear = () => {
    setRegion("");
    setQ("");
    setSort("date-desc");
    setSuggestions([]);
    setOpen(false);
    clearFilters(); // καθαρίζει και URL + sidebar
  };

  // debounce helper
  const debounce = (fn: (...args: any[]) => void, ms = 400) => {
    let t: any;
    return (...args: any[]) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

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
      }, 400),
    []
  );

  // τρέχει σε κάθε αλλαγή q
  useEffect(() => {
    setLoading(true);
    fetchSuggestions(q);
    setOpen(!!q && q.trim().length >= 2);
  }, [q, fetchSuggestions]);

  // κλείσιμο dropdown όταν πατάς έξω
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
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="sticky top-16 z-40">
      <div className="ui-card p-4">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-3">
          {/* Καθαρισμός */}
          <button
            className="btn btn-ghost min-w-[140px]"
            onClick={handleClear}
            aria-label="Καθαρισμός φίλτρων"
            title="Καθαρισμός φίλτρων"
          >
            Καθαρισμός
          </button>

          {/* Αναζήτηση περιοχής + dropdown */}
          <div className="relative flex-1 max-w-2xl">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Αναζήτηση περιοχής…"
                className="input pr-10"
                value={q}
                onChange={(e) => {
                  const v = e.target.value;
                  setQ(v);
                  setRegion(v);
                  // εφαρμόζουμε άμεσα το φίλτρο (SSR refresh)
                  updateFilter("region", v);
                }}
                onFocus={() => {
                  if (q && q.trim().length >= 2) setOpen(true);
                }}
              />
              {/* μικρό εικονίδιο αναζήτησης */}
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-dark/60"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M21 21l-4.35-4.35m1.35-5.15a6.5 6.5 0 11-13.001.001A6.5 6.5 0 0118 11.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Dropdown results */}
            {open && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-card max-h-96 overflow-auto"
              >
                {loading && (
                  <div className="p-3 text-sm text-secondary-dark">Αναζήτηση…</div>
                )}
                {!loading && suggestions.length === 0 && (
                  <div className="p-3 text-sm text-secondary-dark">Δεν βρέθηκαν αποτελέσματα</div>
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
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        onClick={() => setOpen(false)}
                      >
                        {/* Προαιρετικά thumbnail:
                        {it.acf?.image?.url && (
                          <img
                            src={it.acf.image.url}
                            alt={it.acf.image.alt || title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )} */}
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{title}</div>
                          <div className="text-xs text-secondary-dark truncate">
                            {reg} {price ? `• ${price} €` : ""}
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                {/* Προβολή όλων με το τρέχον query */}
                {!loading && suggestions.length > 0 && (
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-blue-50 border-t border-gray-100"
                    onClick={() => {
                      // ήδη ενημερώνουμε το region στο URL με onChange – εδώ απλά κλείνουμε το dropdown
                      setOpen(false);
                    }}
                  >
                    Προβολή όλων αποτελεσμάτων για “{q}”
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Ταξινόμηση */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-secondary-dark">
              Ταξινόμηση:
            </label>
            <select
              id="sort"
              className="input py-2"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                const [orderby, order] = e.target.value.split("-");
                updateFilter("orderby", orderby);
                updateFilter("order", order.toUpperCase());
              }}
            >
              <option value="price-asc">Τιμή ↑</option>
              <option value="price-desc">Τιμή ↓</option>
              <option value="area-asc">Εμβαδόν ↑</option>
              <option value="area-desc">Εμβαδόν ↓</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

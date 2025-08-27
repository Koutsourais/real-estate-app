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

  // controlled state
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState("date-desc");

  // suggestions state
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // --- Sync από URL ---
  useEffect(() => {
    const urlRegion = searchParams?.get("region") || "";
    setRegion(urlRegion);
    setQ(urlRegion);

    const orderby = searchParams?.get("orderby") || "date";
    const order = (searchParams?.get("order") || "DESC").toLowerCase();
    setSort(`${orderby}-${order}`);
  }, [searchParams]);

  // --- Helper: update URL param ---
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

  // --- Clear ---
  const handleClear = () => {
    setRegion("");
    setQ("");
    setSort("date-desc");
    setSuggestions([]);
    setOpen(false);
    clearFilters();
  };

  // --- Debounce ---
  const debounce = (fn: (...args: any[]) => void, ms = 400) => {
    let t: any;
    return (...args: any[]) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  // --- Fetch suggestions ---
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

  useEffect(() => {
    setLoading(true);
    fetchSuggestions(q);
    setOpen(!!q && q.trim().length >= 2);
  }, [q, fetchSuggestions]);

  // --- Κλείσιμο dropdown ---
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
    <div className="sticky top-16 z-40 bg-white border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      {/* Καθαρισμός */}
      <button
        className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
        onClick={handleClear}
      >
        Καθαρισμός
      </button>

      {/* Αναζήτηση περιοχής */}
      <div className="relative flex-1 max-w-xl">
        <input
          ref={inputRef}
          type="text"
          placeholder="Αναζήτηση..."
          className="border px-3 py-2 rounded w-full"
          value={q}
          onChange={(e) => {
            const v = e.target.value;
            setQ(v);
            setRegion(v);
            updateFilter("region", v);
          }}
          onFocus={() => {
            if (q && q.trim().length >= 2) setOpen(true);
          }}
        />

        {/* Dropdown results */}
        {open && (
          <div
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
                    ? Number(
                      String(it.acf!.price).replace(/[^\d.]/g, "")
                    ).toLocaleString("el-GR")
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
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t"
                onClick={() => setOpen(false)}
              >
                Προβολή όλων αποτελεσμάτων για “{q}”
              </button>
            )}
          </div>
        )}
      </div>

      {/* Ταξινόμηση */}
      <select
        className="border px-3 py-2 rounded text-sm"
        value={sort}
        onChange={(e) => {
          const val = e.target.value;
          setSort(val);
          const [orderby, order] = val.split("-");
          const params = new URLSearchParams(searchParams?.toString());
          params.set("orderby", orderby);
          params.set("order", order.toUpperCase());
          params.delete("page");
          router.push("/?" + params.toString());
        }}
      >
        <option value="date-desc">Ημ/νία (Νεότερα)</option>
        <option value="date-asc">Ημ/νία (Παλαιότερα)</option>
        <option value="price-asc">Τιμή ↑</option>
        <option value="price-desc">Τιμή ↓</option>
        <option value="area-asc">Εμβαδόν ↑</option>
        <option value="area-desc">Εμβαδόν ↓</option>
      </select>
      <div className="flex gap-2">
        <button
          onClick={() => updateFilter("view", "list")}
          className={`border px-3 py-2 rounded text-sm ${searchParams?.get("view") === "list" || !searchParams?.get("view")
              ? "bg-gray-200"
              : ""
            }`}
        >
          📃
        </button>
        <button
          onClick={() => updateFilter("view", "grid")}
          className={`border px-3 py-2 rounded text-sm ${searchParams?.get("view") === "grid" ? "bg-gray-200" : ""
            }`}
        >
          ⬛
        </button>
      </div>
    </div>
  );
}

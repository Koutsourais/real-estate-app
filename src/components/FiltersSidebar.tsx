"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useFilters } from "@/context/FiltersContext";

export default function FiltersSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetFlag } = useFilters(); // διαβάζουμε το flag για καθάρισμα

  // controlled states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");

  // checklists (πολλαπλές επιλογές ως comma-separated στο URL)
  const [adTypes, setAdTypes] = useState<string[]>([]);
  const [reTypes, setReTypes] = useState<string[]>([]);

  // sync από URL → state (π.χ. όταν κάνεις back/forward ή έρχεσαι από link)
  useEffect(() => {
    setMinPrice(searchParams?.get("minPrice") || "");
    setMaxPrice(searchParams?.get("maxPrice") || "");
    setMinArea(searchParams?.get("minArea") || "");
    setMaxArea(searchParams?.get("maxArea") || "");
    setAdTypes((searchParams?.get("ad_type") || "").split(",").filter(Boolean));
    setReTypes((searchParams?.get("real_estate_type") || "").split(",").filter(Boolean));
  }, [searchParams]);

  // reset άμεσο όταν αλλάζει το global resetFlag
  useEffect(() => {
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setAdTypes([]);
    setReTypes([]);
  }, [resetFlag]);

  const updateParam = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (value && value !== "") params.set(name, value);
      else params.delete(name);
      // reset στη σελίδα 1 σε κάθε αλλαγή
      params.delete("page");
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleMulti = (name: "ad_type" | "real_estate_type", list: string[], value: string, setList: (v: string[]) => void) => {
    const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
    setList(next);
    updateParam(name, next.join(","));
  };

  return (
    <aside className="bg-white border rounded-xl p-4 sticky top-40 h-fit">
      <h3 className="font-semibold mb-4">Φίλτρα</h3>

      {/* Τιμή */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Τιμή (€)</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Από"
            className="border rounded-lg px-2 py-1"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              updateParam("minPrice", e.target.value);
            }}
          />
          <input
            type="number"
            placeholder="Έως"
            className="border rounded-lg px-2 py-1"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              updateParam("maxPrice", e.target.value);
            }}
          />
        </div>
      </div>

      {/* Εμβαδόν */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Εμβαδόν (m²)</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Από"
            className="border rounded-lg px-2 py-1"
            value={minArea}
            onChange={(e) => {
              setMinArea(e.target.value);
              updateParam("minArea", e.target.value);
            }}
          />
          <input
            type="number"
            placeholder="Έως"
            className="border rounded-lg px-2 py-1"
            value={maxArea}
            onChange={(e) => {
              setMaxArea(e.target.value);
              updateParam("maxArea", e.target.value);
            }}
          />
        </div>
      </div>

      {/* Τύπος Αγγελίας */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Τύπος Αγγελίας</p>
        {["Πώληση", "Ενοικίαση"].map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={adTypes.includes(t)}
              onChange={() => toggleMulti("ad_type", adTypes, t, setAdTypes)}
            />
            <span>{t}</span>
          </label>
        ))}
      </div>

      {/* Τύπος Ακινήτου */}
      <div>
        <p className="text-sm font-medium mb-2">Τύπος Ακινήτου</p>
        {["Διαμέρισμα", "Μονοκατοικία", "Οικόπεδο"].map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={reTypes.includes(t)}
              onChange={() => toggleMulti("real_estate_type", reTypes, t, setReTypes)}
            />
            <span>{t}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}

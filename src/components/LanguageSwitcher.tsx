// src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const LANGS = [
  { code: "el", label: "Ελληνικά", emoji: "🇬🇷" },
  { code: "en", label: "English",  emoji: "🇬🇧" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lang = searchParams.get("lang") || "el";

  const paramsObj = useMemo(() => {
    const p: Record<string, string> = {};
    searchParams.forEach((v, k) => (p[k] = v));
    return p;
  }, [searchParams]);

  function setLang(nextLang: string) {
    const sp = new URLSearchParams(paramsObj);
    sp.set("lang", nextLang);
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">Language</span>
      <select
        className="border rounded-md px-2 py-1 bg-white text-gray-800"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label="Change language"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.emoji} {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}

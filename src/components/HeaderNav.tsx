// src/components/HeaderNav.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function HeaderNav() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "el";

  const qs = (extra?: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams?.toString());
    sp.set("lang", lang);
    if (extra) Object.entries(extra).forEach(([k, v]) => sp.set(k, v));
    const s = sp.toString();
    return s ? `?${s}` : "";
  };

  return (
    <nav className="container mx-auto flex justify-between items-center h-16 px-4">
      <h1 className="text-xl font-bold">Real Estate</h1>
      <ul className="flex items-center gap-4">
        <li><Link href={`/${qs()}`} className="hover:underline">Αρχική</Link></li>
        <li><Link href={`/sales${qs()}`} className="hover:underline">Αγορά Ακινήτου</Link></li>
        <li><Link href={`/rentals${qs()}`} className="hover:underline">Ενοικίαση Ακινήτου</Link></li>
        <li><Link href={`/sell${qs()}`} className="hover:underline">Πώληση Ακινήτου</Link></li>
        <li><Link href={`/contact${qs()}`} className="hover:underline">Επικοινωνία</Link></li>
        <li className="pl-2 border-l">
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
}

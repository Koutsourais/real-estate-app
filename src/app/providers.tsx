// src/app/providers.tsx
"use client";

import { FiltersProvider } from "@/context/FiltersContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <FiltersProvider>{children}</FiltersProvider>;
}

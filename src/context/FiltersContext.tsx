"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type FiltersContextType = {
  resetFlag: number;            // αλλάζει σε κάθε reset
  clearFilters: () => void;     // καλεί reset + καθάρισμα URL
};

const FiltersContext = createContext<FiltersContextType | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [resetFlag, setResetFlag] = useState(0);
  const router = useRouter();

  const clearFilters = useCallback(() => {
    setResetFlag((f) => f + 1);  // trigger reset στους consumers
    router.push("/");            // καθάρισε και το URL
  }, [router]);

  return (
    <FiltersContext.Provider value={{ resetFlag, clearFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}

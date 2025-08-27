"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Filters = Record<string, string>;

type FiltersContextType = {
  filters: Filters;
  setFilters: (f: Filters) => void;
  clearFilters: () => void;
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<Filters>({});

  const setFilters = (f: Filters) => setFiltersState(f);
  const clearFilters = () => setFiltersState({});

  return (
    <FiltersContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) {
    throw new Error("useFilters must be used inside <FiltersProvider>");
  }
  return ctx;
}

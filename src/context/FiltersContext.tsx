// src/context/FiltersContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type Filters = Record<string, string>;

type Ctx = {
  filters: Filters;
  setFilters: (updater: Filters | ((prev: Filters) => Filters)) => void;
  clearAll: () => void;
};

const FiltersContext = createContext<Ctx>({
  filters: {},
  setFilters: () => {},
  clearAll: () => {},
});

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, _setFilters] = useState<Filters>({});

  const setFilters = useCallback(
    (updater: Filters | ((prev: Filters) => Filters)) => {
      _setFilters((prev) =>
        typeof updater === "function" ? (updater as any)(prev) : updater
      );
    },
    []
  );

  const clearAll = useCallback(() => {
    _setFilters({});
  }, []);

  return (
    <FiltersContext.Provider value={{ filters, setFilters, clearAll }}>
      {children}
    </FiltersContext.Provider>
  );
}

export const useFilters = () => useContext(FiltersContext);

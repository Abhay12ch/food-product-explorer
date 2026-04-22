"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { FilterState, SortOption } from "@/types";

interface ExplorerContextValue extends FilterState {
  setSearchTerm: (term: string) => void;
  setCategory: (cat: string) => void;
  setSortBy: (sort: SortOption) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const defaults: FilterState = {
  searchTerm: "",
  category: "",
  sortBy: "default",
  page: 1,
};

const ExplorerContext = createContext<ExplorerContextValue | undefined>(
  undefined
);

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FilterState>(defaults);

  const setSearchTerm = useCallback(
    (term: string) => setState((s) => ({ ...s, searchTerm: term, page: 1 })),
    []
  );
  const setCategory = useCallback(
    (cat: string) => setState((s) => ({ ...s, category: cat, page: 1 })),
    []
  );
  const setSortBy = useCallback(
    (sort: SortOption) => setState((s) => ({ ...s, sortBy: sort })),
    []
  );
  const setPage = useCallback(
    (page: number) => setState((s) => ({ ...s, page })),
    []
  );
  const resetFilters = useCallback(() => setState(defaults), []);

  return (
    <ExplorerContext.Provider
      value={{
        ...state,
        setSearchTerm,
        setCategory,
        setSortBy,
        setPage,
        resetFilters,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
}

export function useExplorer(): ExplorerContextValue {
  const ctx = useContext(ExplorerContext);
  if (!ctx) throw new Error("useExplorer must be used inside ExplorerProvider");
  return ctx;
}

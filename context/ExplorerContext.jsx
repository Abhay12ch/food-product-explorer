"use client";

import { createContext, useContext, useState, useCallback } from "react";

const defaults = {
  searchTerm: "",
  category: "",
  sortBy: "default",
  page: 1,
};

const ExplorerContext = createContext(undefined);

export function ExplorerProvider({ children }) {
  const [state, setState] = useState(defaults);

  const setSearchTerm = useCallback(
    (term) => setState((s) => ({ ...s, searchTerm: term, page: 1 })),
    []
  );
  const setCategory = useCallback(
    (cat) => setState((s) => ({ ...s, category: cat, page: 1 })),
    []
  );
  const setSortBy = useCallback(
    (sort) => setState((s) => ({ ...s, sortBy: sort })),
    []
  );
  const setPage = useCallback(
    (page) => setState((s) => ({ ...s, page })),
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

export function useExplorer() {
  const ctx = useContext(ExplorerContext);
  if (!ctx) throw new Error("useExplorer must be used inside ExplorerProvider");
  return ctx;
}

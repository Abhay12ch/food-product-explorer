"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useExplorer } from "@/context/ExplorerContext";
import { fetchCategories } from "@/lib/api";

const SORT_OPTIONS = [
  { value: "default", label: "Relevance" },
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "grade-asc", label: "Grade A → E" },
  { value: "grade-desc", label: "Grade E → A" },
];

const TOP_CATEGORIES = [
  "Beverages", "Snacks", "Dairy", "Cereals", "Meats",
  "Fruits", "Vegetables", "Frozen foods", "Breads", "Sweets",
  "Sauces", "Pastas", "Canned foods", "Biscuits", "Chocolates",
];

export default function Controls() {
  const { searchTerm, category, sortBy, setSearchTerm, setCategory, setSortBy, resetFilters } = useExplorer();
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setCatLoading(true);
    fetchCategories()
      .then((data) => {
        const filtered = data.tags
          .filter((t) => t.products > 1000 && t.name)
          .sort((a, b) => b.products - a.products)
          .slice(0, 50);
        setCategories(filtered);
      })
      .catch(() => setCategories([]))
      .finally(() => setCatLoading(false));
  }, []);

  const handleSearch = useCallback(
    (value) => {
      setLocalSearch(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setSearchTerm(value), 400);
    },
    [setSearchTerm]
  );

  const hasFilters = searchTerm || category || sortBy !== "default";

  return (
    <div id="controls-panel" className="w-full space-y-4">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input id="search-input" type="text" placeholder="Search by product name or barcode…" value={localSearch} onChange={(e) => handleSearch(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-12 pr-4 text-sm text-slate-100 placeholder-slate-500 backdrop-blur-xl transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        {localSearch && (
          <button onClick={() => handleSearch("")} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-200 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <select id="category-select" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-200 backdrop-blur-xl transition-all duration-300 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
            <option value="" className="bg-slate-900 text-slate-200">All Categories</option>
            {categories.length > 0
              ? categories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="bg-slate-900 text-slate-200">
                    {cat.name} ({cat.products.toLocaleString()})
                  </option>
                ))
              : TOP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-slate-200">{cat}</option>
                ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative flex-1">
          <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-200 backdrop-blur-xl transition-all duration-300 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-slate-900 text-slate-200">{o.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {hasFilters && (
          <button id="reset-filters-btn" onClick={() => { resetFilters(); setLocalSearch(""); }} className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-xs font-medium text-rose-300 transition-all hover:bg-rose-500/20 hover:border-rose-500/40">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/25">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              &quot;{searchTerm}&quot;
            </span>
          )}
          {category && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-300 ring-1 ring-violet-500/25">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              {category}
            </span>
          )}
          {sortBy !== "default" && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/25">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
              {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

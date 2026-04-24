"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useExplorer } from "@/context/ExplorerContext";
import {
  searchByName,
  fetchByCategory,
  fetchProductByBarcode,
  isBarcode,
} from "@/lib/api";
import type { Product, SortOption } from "@/types";
import ProductCard from "@/components/ProductCard";
import Controls from "@/components/Controls";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 24;

/* ─── Client-side sort ─── */
function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  if (sortBy === "default") return products;

  const gradeOrder: Record<string, number> = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
  };

  return [...products].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return (a.product_name || "").localeCompare(b.product_name || "");
      case "name-desc":
        return (b.product_name || "").localeCompare(a.product_name || "");
      case "grade-asc": {
        const ga =
          gradeOrder[(a.nutrition_grades || a.nutrition_grade_fr || "z").toLowerCase()] ?? 9;
        const gb =
          gradeOrder[(b.nutrition_grades || b.nutrition_grade_fr || "z").toLowerCase()] ?? 9;
        return ga - gb;
      }
      case "grade-desc": {
        const ga =
          gradeOrder[(a.nutrition_grades || a.nutrition_grade_fr || "z").toLowerCase()] ?? 9;
        const gb =
          gradeOrder[(b.nutrition_grades || b.nutrition_grade_fr || "z").toLowerCase()] ?? 9;
        return gb - ga;
      }
      default:
        return 0;
    }
  });
}

export default function HomeContent() {
  const { searchTerm, category, sortBy, page, setPage } = useExplorer();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref to track the current fetch operation and avoid race conditions
  const fetchIdRef = useRef(0);

  /* Fetch products based on current filters */
  const fetchProducts = useCallback(
    async (pageNum: number, append = false) => {
      const currentFetchId = ++fetchIdRef.current;

      setLoading(true);
      setError(null);

      try {
        // Barcode search
        if (searchTerm && isBarcode(searchTerm)) {
          const data = await fetchProductByBarcode(searchTerm.trim());
          // Abort if a newer fetch was started
          if (currentFetchId !== fetchIdRef.current) return;
          if (data.status === 1 && data.product) {
            setProducts([{ ...data.product, code: data.code }]);
            setTotalCount(1);
          } else {
            setProducts([]);
            setTotalCount(0);
          }
          return;
        }

        // Category filter
        if (category && !searchTerm) {
          try {
            const data = await fetchByCategory(category, pageNum, PAGE_SIZE);
            if (currentFetchId !== fetchIdRef.current) return;
            if (append) {
              setProducts((prev) => [...prev, ...data.products]);
            } else {
              setProducts(data.products);
            }
            setTotalCount(data.count);
            return;
          } catch {
            // Fallback: use category name as a search term if the
            // category endpoint fails (OpenFoodFacts rate-limits it frequently)
            if (currentFetchId !== fetchIdRef.current) return;
            const data = await searchByName(category, pageNum, PAGE_SIZE);
            if (currentFetchId !== fetchIdRef.current) return;
            if (append) {
              setProducts((prev) => [...prev, ...data.products]);
            } else {
              setProducts(data.products);
            }
            setTotalCount(data.count);
            return;
          }
        }

        // Name search (or default homepage products)
        const term = searchTerm || "a";
        const data = await searchByName(term, pageNum, PAGE_SIZE);
        if (currentFetchId !== fetchIdRef.current) return;
        if (append) {
          setProducts((prev) => [...prev, ...data.products]);
        } else {
          setProducts(data.products);
        }
        setTotalCount(data.count);
      } catch (err) {
        if (currentFetchId !== fetchIdRef.current) return;
        // Don't clear existing products on error — just show the error banner
        // so users can still see previously loaded products
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (currentFetchId === fetchIdRef.current) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    },
    [searchTerm, category]
  );

  /* Re-fetch on filter changes */
  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, category]);

  /* Load more handler */
  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  }, [page, setPage, fetchProducts]);

  /* Client-side sorted view */
  const sorted = useMemo(
    () => sortProducts(products, sortBy),
    [products, sortBy]
  );

  const hasMore = products.length < totalCount;

  return (
    <>
      {/* Controls */}
      <Controls />

      {/* Error state */}
      {error && (
        <div className="mt-8 flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/[0.06] px-5 py-4 text-sm text-rose-300">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </div>
          <button
            onClick={() => fetchProducts(1, false)}
            className="ml-4 flex-shrink-0 rounded-lg bg-rose-500/20 px-4 py-1.5 text-xs font-medium text-rose-200 transition-colors hover:bg-rose-500/30"
          >
            Retry
          </button>
        </div>
      )}

      {/* Initial loading skeleton */}
      {initialLoad && loading && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]"
            >
              <div className="aspect-square bg-white/[0.04] rounded-t-2xl" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
                <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
                <div className="h-3 w-full rounded bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !initialLoad && sorted.length === 0 && !error && (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08]">
            <svg className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-200">
            No products found
          </h3>
          <p className="max-w-sm text-sm text-slate-500">
            Try adjusting your search terms or removing filters to find what
            you&apos;re looking for.
          </p>
        </div>
      )}

      {/* Product grid */}
      {sorted.length > 0 && (
        <div
          id="product-grid"
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {sorted.map((product) => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {sorted.length > 0 && (
        <Pagination
          onLoadMore={handleLoadMore}
          loading={loading && !initialLoad}
          hasMore={hasMore}
          totalCount={totalCount}
          currentCount={products.length}
        />
      )}
    </>
  );
}

"use client";

import { useRef, useEffect } from "react";

export default function Pagination({ onLoadMore, loading, hasMore, totalCount, currentCount }) {
  const sentinelRef = useRef(null);

  /* Intersection Observer for infinite scroll */
  useEffect(() => {
    if (!hasMore || loading) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <div id="pagination-section" className="mt-10 flex flex-col items-center gap-4">
      {totalCount > 0 && (
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium text-slate-300">{currentCount.toLocaleString()}</span> of <span className="font-medium text-slate-300">{totalCount.toLocaleString()}</span> products
        </p>
      )}
      {totalCount > 0 && (
        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/[0.05]">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out" style={{ width: `${Math.min((currentCount / totalCount) * 100, 100)}%` }} />
        </div>
      )}
      {loading && (
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <div className="relative h-5 w-5">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-500" />
            <div className="absolute inset-0.5 animate-spin rounded-full border-2 border-transparent border-b-violet-400" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
          </div>
          Loading more products…
        </div>
      )}
      {hasMore && !loading && (
        <button id="load-more-btn" onClick={onLoadMore} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-8 py-3 text-sm font-medium text-slate-200 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)]">
          <span className="relative z-10 flex items-center gap-2">
            Load More Products
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </button>
      )}
      {!hasMore && currentCount > 0 && (
        <p className="text-xs text-slate-500">✦ You&apos;ve reached the end ✦</p>
      )}
      <div ref={sentinelRef} className="h-px w-full" />
    </div>
  );
}

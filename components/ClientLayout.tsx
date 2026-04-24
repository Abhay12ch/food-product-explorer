"use client";

import { useState } from "react";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#06080f]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 transition-shadow duration-300 group-hover:shadow-indigo-500/40">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-100">
                Food<span className="text-indigo-400">Explorer</span>
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
                Powered by OpenFoodFacts
              </p>
            </div>
          </a>

          <nav className="flex items-center gap-2">
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-200"
            >
              OpenFoodFacts ↗
            </a>
            <CartButton onClick={() => setCartOpen(true)} />
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#06080f]/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-500">
            Data sourced from{" "}
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400/70 hover:text-indigo-400 transition-colors"
            >
              OpenFoodFacts
            </a>{" "}
            — the free, open food products database.
          </p>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

"use client";

import { useCart } from "@/context/CartContext";

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { totalItems } = useCart();

  return (
    <button
      id="cart-button"
      onClick={onClick}
      aria-label={`Shopping cart with ${totalItems} items`}
      className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] transition-all duration-300 hover:bg-indigo-500/10 hover:ring-indigo-500/30 hover:shadow-[0_0_16px_rgba(99,102,241,0.15)]"
    >
      <svg
        className="h-5 w-5 text-slate-300 transition-colors group-hover:text-indigo-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>

      {/* Animated item count badge */}
      {totalItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-indigo-500/30 animate-in">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}

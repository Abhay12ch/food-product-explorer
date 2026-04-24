"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

/* ─── Nutrition-grade colour mapping ─── */
const gradeColors = {
  a: "from-emerald-500 to-green-400",
  b: "from-lime-400 to-yellow-300",
  c: "from-yellow-400 to-amber-400",
  d: "from-orange-400 to-orange-500",
  e: "from-red-500 to-rose-500",
};

const gradeBg = {
  a: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  b: "bg-lime-400/15 text-lime-300 ring-lime-400/30",
  c: "bg-yellow-400/15 text-yellow-300 ring-yellow-400/30",
  d: "bg-orange-400/15 text-orange-300 ring-orange-400/30",
  e: "bg-red-500/15 text-red-400 ring-red-500/30",
};

export default function ProductCard({ product }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.code);

  const name = product.product_name || "Unknown Product";
  const grade = (
    product.nutrition_grades ||
    product.nutrition_grade_fr ||
    ""
  ).toLowerCase();
  const img = product.image_url || product.image_front_url || "";
  const category = product.categories?.split(",")[0]?.trim() || "Uncategorized";
  const ingredients =
    product.ingredients_text || product.ingredients_text_en || "";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link
      href={`/product/${product.code}`}
      id={`product-card-${product.code}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_16px_48px_rgba(99,102,241,0.15)] hover:border-indigo-500/30 hover:-translate-y-1"
    >
      {/* Shimmer border on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[conic-gradient(from_var(--shimmer-angle,0deg),transparent_0%,rgba(129,140,248,0.1)_10%,transparent_20%)]" />

      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60">
        {img ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={img}
            alt={name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Nutrition grade badge */}
        {grade && (
          <div className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm uppercase ring-1 ${gradeBg[grade] || "bg-slate-500/15 text-slate-400 ring-slate-500/30"}`}>
            {grade.toUpperCase()}
          </div>
        )}

        {/* Add to Cart overlay button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-xl transition-all duration-300 ${
            inCart
              ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30 opacity-100"
              : "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/30 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
        >
          {inCart ? (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              In Cart
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add to Cart
            </>
          )}
        </button>

        {/* Gradient overlay */}
        {grade && (
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradeColors[grade] || "from-slate-500 to-slate-400"}`} />
        )}
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-slate-100 transition-colors group-hover:text-indigo-300">
          {name}
        </h3>
        <span className="inline-flex w-fit items-center rounded-lg bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300 ring-1 ring-indigo-500/20">
          {category}
        </span>
        {ingredients && (
          <p className="mt-auto line-clamp-2 text-xs leading-relaxed text-slate-400">
            {ingredients}
          </p>
        )}
      </div>
    </Link>
  );
}

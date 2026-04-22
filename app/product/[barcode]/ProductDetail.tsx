"use client";

import Link from "next/link";
import type { Product } from "@/types";

/* ─── Nutrition-grade colour mapping ─── */
const gradeConfig: Record<
  string,
  { bg: string; text: string; label: string; ring: string }
> = {
  a: {
    bg: "from-emerald-500 to-green-400",
    text: "text-emerald-400",
    label: "Excellent",
    ring: "ring-emerald-500/30",
  },
  b: {
    bg: "from-lime-400 to-yellow-300",
    text: "text-lime-300",
    label: "Good",
    ring: "ring-lime-400/30",
  },
  c: {
    bg: "from-yellow-400 to-amber-400",
    text: "text-yellow-300",
    label: "Average",
    ring: "ring-yellow-400/30",
  },
  d: {
    bg: "from-orange-400 to-orange-500",
    text: "text-orange-300",
    label: "Poor",
    ring: "ring-orange-400/30",
  },
  e: {
    bg: "from-red-500 to-rose-500",
    text: "text-red-400",
    label: "Bad",
    ring: "ring-red-500/30",
  },
};

/* ─── Nutrition row component ─── */
function NutritionRow({
  label,
  value,
  unit = "g",
  maxValue,
}: {
  label: string;
  value?: number;
  unit?: string;
  maxValue: number;
}) {
  if (value === undefined || value === null) return null;
  const pct = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono text-xs font-medium text-slate-200">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Label badge component ─── */
function LabelBadge({ label }: { label: string }) {
  const lower = label.toLowerCase();
  let color = "bg-slate-500/15 text-slate-300 ring-slate-500/25";

  if (lower.includes("vegan"))
    color = "bg-green-500/15 text-green-300 ring-green-500/25";
  else if (lower.includes("vegetarian"))
    color = "bg-lime-500/15 text-lime-300 ring-lime-500/25";
  else if (lower.includes("gluten-free") || lower.includes("no gluten"))
    color = "bg-amber-500/15 text-amber-300 ring-amber-500/25";
  else if (lower.includes("organic") || lower.includes("bio"))
    color = "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25";
  else if (lower.includes("fair"))
    color = "bg-cyan-500/15 text-cyan-300 ring-cyan-500/25";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ring-1 ${color}`}
    >
      {label}
    </span>
  );
}

/* ─── Main detail component ─── */
interface ProductDetailProps {
  product: Product | null;
  error: string | null;
  barcode: string;
}

export default function ProductDetail({
  product,
  error,
  barcode,
}: ProductDetailProps) {
  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/20">
            <svg
              className="h-12 w-12 text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Product Not Found
          </h2>
          <p className="max-w-md text-sm text-slate-400">
            {error ||
              `We couldn't find a product with barcode "${barcode}" in the OpenFoodFacts database.`}
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-500/15 px-6 py-3 text-sm font-medium text-indigo-300 ring-1 ring-indigo-500/25 transition-all hover:bg-indigo-500/25"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Explorer
          </Link>
        </div>
      </div>
    );
  }

  const name = product.product_name || "Unknown Product";
  const grade = (
    product.nutrition_grades ||
    product.nutrition_grade_fr ||
    ""
  ).toLowerCase();
  const gc = gradeConfig[grade];
  const img = product.image_url || product.image_front_url || "";
  const ingredients =
    product.ingredients_text || product.ingredients_text_en || "";
  const n = product.nutriments;
  const labels = product.labels
    ? product.labels
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/"
        id="back-to-home"
        className="group mb-8 inline-flex items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-2 text-sm text-slate-400 ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.06] hover:text-slate-200"
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Explorer
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Left column: Image ── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-1">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60">
            {img ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={img}
                alt={name}
                className="absolute inset-0 h-full w-full object-contain p-8"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg
                  className="h-24 w-24 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            {/* Grade badge overlay */}
            {gc && (
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl bg-black/40 px-3 py-2 backdrop-blur-xl">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${gc.bg} text-sm font-bold text-white shadow-lg`}
                >
                  {grade.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Nutri-Score
                  </p>
                  <p className={`text-[10px] font-medium ${gc.text}`}>
                    {gc.label}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: Product info ── */}
        <div className="space-y-6">
          {/* Title & meta */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
              {name}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              {product.brands && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1 ring-1 ring-white/[0.08]">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  {product.brands}
                </span>
              )}
              {product.quantity && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1 ring-1 ring-white/[0.08]">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                  {product.quantity}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1 font-mono text-xs ring-1 ring-white/[0.08]">
                {barcode}
              </span>
            </div>
          </div>

          {/* Category */}
          {product.categories && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.categories
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean)
                  .slice(0, 6)
                  .map((c) => (
                    <span
                      key={c}
                      className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/20"
                    >
                      {c}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Labels */}
          {labels.length > 0 && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Labels & Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {labels.slice(0, 10).map((l) => (
                  <LabelBadge key={l} label={l} />
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {ingredients && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ingredients
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {ingredients}
              </p>
            </div>
          )}

          {/* Nutritional Values */}
          {n && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Nutrition Facts{" "}
                <span className="text-slate-600">(per 100g)</span>
              </h3>
              <div className="space-y-4">
                <NutritionRow
                  label="Energy"
                  value={n.energy_kcal_100g}
                  unit="kcal"
                  maxValue={900}
                />
                <NutritionRow
                  label="Fat"
                  value={n.fat_100g}
                  maxValue={100}
                />
                <NutritionRow
                  label="Saturated Fat"
                  value={n.saturated_fat_100g}
                  maxValue={50}
                />
                <NutritionRow
                  label="Carbohydrates"
                  value={n.carbohydrates_100g}
                  maxValue={100}
                />
                <NutritionRow
                  label="Sugars"
                  value={n.sugars_100g}
                  maxValue={100}
                />
                <NutritionRow
                  label="Proteins"
                  value={n.proteins_100g}
                  maxValue={100}
                />
                <NutritionRow
                  label="Fiber"
                  value={n.fiber_100g}
                  maxValue={50}
                />
                <NutritionRow
                  label="Salt"
                  value={n.salt_100g}
                  maxValue={10}
                />
              </div>
            </div>
          )}

          {/* Nutri-Score breakdown */}
          {grade && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Nutri-Score
              </h3>
              <div className="flex items-center gap-2">
                {["a", "b", "c", "d", "e"].map((g) => {
                  const isActive = g === grade;
                  const cfg = gradeConfig[g];
                  return (
                    <div
                      key={g}
                      className={`flex h-12 flex-1 items-center justify-center rounded-xl text-sm font-bold uppercase transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-br ${cfg.bg} text-white shadow-lg ring-2 ${cfg.ring} scale-110`
                          : "bg-white/[0.04] text-slate-500 ring-1 ring-white/[0.06]"
                      }`}
                    >
                      {g.toUpperCase()}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { fetchWithRetry } from "@/lib/fetchWithRetry";

const BASE = "https://world.openfoodfacts.org";

/* Hardcoded popular categories so the UI always has something even if the
   massive categories.json call fails (it's ~40 MB and frequently times out). */
const FALLBACK_CATEGORIES = [
  { id: "en:beverages", name: "Beverages", url: "", products: 200000 },
  { id: "en:snacks", name: "Snacks", url: "", products: 120000 },
  { id: "en:dairies", name: "Dairies", url: "", products: 110000 },
  { id: "en:cereals-and-potatoes", name: "Cereals and potatoes", url: "", products: 85000 },
  { id: "en:meats", name: "Meats", url: "", products: 65000 },
  { id: "en:fruits-and-vegetables-based-foods", name: "Fruits and vegetables based foods", url: "", products: 55000 },
  { id: "en:plant-based-foods-and-beverages", name: "Plant-based foods and beverages", url: "", products: 150000 },
  { id: "en:frozen-foods", name: "Frozen foods", url: "", products: 40000 },
  { id: "en:breads", name: "Breads", url: "", products: 50000 },
  { id: "en:sweet-snacks", name: "Sweet snacks", url: "", products: 95000 },
  { id: "en:sauces", name: "Sauces", url: "", products: 40000 },
  { id: "en:pastas", name: "Pastas", url: "", products: 25000 },
  { id: "en:canned-foods", name: "Canned foods", url: "", products: 30000 },
  { id: "en:biscuits-and-cakes", name: "Biscuits and cakes", url: "", products: 55000 },
  { id: "en:chocolates", name: "Chocolates", url: "", products: 45000 },
  { id: "en:cheeses", name: "Cheeses", url: "", products: 35000 },
  { id: "en:yogurts", name: "Yogurts", url: "", products: 30000 },
  { id: "en:meals", name: "Meals", url: "", products: 70000 },
  { id: "en:spreads", name: "Spreads", url: "", products: 35000 },
  { id: "en:breakfasts", name: "Breakfasts", url: "", products: 40000 },
];

export async function GET() {
  try {
    const url = `${BASE}/categories.json`;
    const res = await fetchWithRetry(url, { retries: 1, timeoutMs: 8000 });
    if (!res.ok) {
      // Return fallback on HTTP error
      return NextResponse.json(
        { count: FALLBACK_CATEGORIES.length, tags: FALLBACK_CATEGORIES },
        { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    // Return fallback categories instead of an error
    return NextResponse.json(
      { count: FALLBACK_CATEGORIES.length, tags: FALLBACK_CATEGORIES },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  }
}

import type {
  SearchResponse,
  ProductDetailResponse,
  CategoriesResponse,
  Product,
} from "@/types";

/* ────────────────────────────────────────────
   Dual-mode API: server-side calls OpenFoodFacts
   directly; client-side goes through /api proxy
   routes to avoid CORS.
   ──────────────────────────────────────────── */

const EXT = "https://world.openfoodfacts.org";

function isServer() {
  return typeof window === "undefined";
}

/** Fetch with retry (up to 2 retries on 5xx / network errors) */
async function resilientFetch(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return res;
      // Retry on 5xx
      if (res.status >= 500 && i < retries) {
        await new Promise((r) => setTimeout(r, 800 * (i + 1)));
        continue;
      }
      return res; // Return non-retryable error response
    } catch (err) {
      clearTimeout(timeout);
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
  throw new Error("Fetch failed after retries");
}

/* ────────────────────────────────────────────
   Search by product name
   ──────────────────────────────────────────── */
export async function searchByName(
  term: string,
  page = 1,
  pageSize = 24
): Promise<SearchResponse> {
  const url = isServer()
    ? `${EXT}/cgi/search.pl?search_terms=${encodeURIComponent(term)}&json=true&page=${page}&page_size=${pageSize}`
    : `/api/search?term=${encodeURIComponent(term)}&page=${page}&page_size=${pageSize}`;

  const res = await resilientFetch(url);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

/* ────────────────────────────────────────────
   Fetch a single product by barcode
   ──────────────────────────────────────────── */
export async function fetchProductByBarcode(
  barcode: string
): Promise<ProductDetailResponse> {
  const url = isServer()
    ? `${EXT}/api/v0/product/${barcode}.json`
    : `/api/product/${barcode}`;

  const res = await resilientFetch(url);
  if (!res.ok) throw new Error(`Product fetch failed: ${res.status}`);
  return res.json();
}

/* ────────────────────────────────────────────
   Fetch products by category
   ──────────────────────────────────────────── */
export async function fetchByCategory(
  category: string,
  page = 1,
  pageSize = 24
): Promise<{ products: Product[]; count: number }> {
  const url = isServer()
    ? `${EXT}/category/${encodeURIComponent(category)}.json?page=${page}&page_size=${pageSize}`
    : `/api/category/${encodeURIComponent(category)}?page=${page}&page_size=${pageSize}`;

  const res = await resilientFetch(url);
  if (!res.ok) throw new Error(`Category fetch failed: ${res.status}`);
  const data = await res.json();
  return { products: data.products ?? [], count: data.count ?? 0 };
}

/* ────────────────────────────────────────────
   Fetch popular categories
   ──────────────────────────────────────────── */
export async function fetchCategories(): Promise<CategoriesResponse> {
  const url = isServer() ? `${EXT}/categories.json` : `/api/categories`;

  const res = await resilientFetch(url);
  if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
  return res.json();
}

/* ────────────────────────────────────────────
   Detect barcode vs name search
   ──────────────────────────────────────────── */
export function isBarcode(term: string): boolean {
  return /^\d{8,14}$/.test(term.trim());
}

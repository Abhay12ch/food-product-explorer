/* ────────────────────────────────────────────
   Dual-mode API: server-side calls OpenFoodFacts
   directly; client-side goes through /api proxy
   routes to avoid CORS.
   ──────────────────────────────────────────── */

const EXT = "https://world.openfoodfacts.org";

function isServer() {
  return typeof window === "undefined";
}

/** Fetch with retry (1 retry on 5xx / network errors to avoid rate-limit escalation) */
async function resilientFetch(url, retries = 1) {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return res;
      // Retry on 5xx
      if (res.status >= 500 && i < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      return res; // Return non-retryable error response
    } catch (err) {
      clearTimeout(timeout);
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("Fetch failed after retries");
}

/* ────────────────────────────────────────────
   Search by product name
   ──────────────────────────────────────────── */
export async function searchByName(term, page = 1, pageSize = 24) {
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
export async function fetchProductByBarcode(barcode) {
  const url = isServer()
    ? `${EXT}/api/v0/product/${barcode}.json`
    : `/api/product/${barcode}`;

  const res = await resilientFetch(url);
  if (!res.ok) throw new Error(`Product fetch failed: ${res.status}`);
  return res.json();
}

/* ────────────────────────────────────────────
   Fetch products by category
   Uses the search endpoint with category tag filter
   instead of the flaky /category/ endpoint.
   ──────────────────────────────────────────── */
export async function fetchByCategory(category, page = 1, pageSize = 24) {
  const url = isServer()
    ? `${EXT}/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}&json=true&page=${page}&page_size=${pageSize}`
    : `/api/category/${encodeURIComponent(category)}?page=${page}&page_size=${pageSize}`;

  const res = await resilientFetch(url);
  if (!res.ok) throw new Error(`Category fetch failed: ${res.status}`);
  const data = await res.json();
  return { products: data.products ?? [], count: data.count ?? 0 };
}

/* ────────────────────────────────────────────
   Fetch popular categories
   ──────────────────────────────────────────── */
export async function fetchCategories() {
  const url = isServer() ? `${EXT}/categories.json` : `/api/categories`;

  const res = await resilientFetch(url);
  if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
  return res.json();
}

/* ────────────────────────────────────────────
   Detect barcode vs name search
   ──────────────────────────────────────────── */
export function isBarcode(term) {
  return /^\d{8,14}$/.test(term.trim());
}

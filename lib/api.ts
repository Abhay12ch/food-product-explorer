import type {
  SearchResponse,
  ProductDetailResponse,
  CategoriesResponse,
  Product,
} from "@/types";

/* ────────────────────────────────────────────
   OpenFoodFacts API base URL
   ──────────────────────────────────────────── */
const BASE = "https://world.openfoodfacts.org";

/* ────────────────────────────────────────────
   Search by product name
   ──────────────────────────────────────────── */
export async function searchByName(
  term: string,
  page = 1,
  pageSize = 24
): Promise<SearchResponse> {
  const url = `${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(
    term
  )}&json=true&page=${page}&page_size=${pageSize}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

/* ────────────────────────────────────────────
   Fetch a single product by barcode
   ──────────────────────────────────────────── */
export async function fetchProductByBarcode(
  barcode: string
): Promise<ProductDetailResponse> {
  const url = `${BASE}/api/v0/product/${barcode}.json`;
  const res = await fetch(url);
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
  const url = `${BASE}/category/${encodeURIComponent(
    category
  )}.json?page=${page}&page_size=${pageSize}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Category fetch failed: ${res.status}`);
  const data = await res.json();
  return { products: data.products ?? [], count: data.count ?? 0 };
}

/* ────────────────────────────────────────────
   Fetch popular categories
   ──────────────────────────────────────────── */
export async function fetchCategories(): Promise<CategoriesResponse> {
  const url = `${BASE}/categories.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
  return res.json();
}

/* ────────────────────────────────────────────
   Detect barcode vs name search
   ──────────────────────────────────────────── */
export function isBarcode(term: string): boolean {
  return /^\d{8,14}$/.test(term.trim());
}

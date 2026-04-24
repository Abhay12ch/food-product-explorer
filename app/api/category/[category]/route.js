import { NextResponse } from "next/server";
import { fetchWithRetry, validatePage, validatePageSize } from "@/lib/fetchWithRetry";

const BASE = "https://world.openfoodfacts.org";

const cache = new Map();
const CACHE_TTL = 120_000;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key, data) {
  if (cache.size > 50) { const oldest = cache.keys().next().value; if (oldest) cache.delete(oldest); }
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request, { params }) {
  const { category } = await params;
  const { searchParams } = request.nextUrl;
  const page = validatePage(searchParams.get("page"));
  const pageSize = validatePageSize(searchParams.get("page_size"));

  const cacheKey = `cat:${category}:${page}:${pageSize}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  }

  try {
    const url = `${BASE}/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}&json=true&page=${page}&page_size=${pageSize}`;
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      return NextResponse.json({ error: `OpenFoodFacts returned ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    const result = { products: data.products ?? [], count: data.count ?? 0 };
    setCache(cacheKey, result);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Category fetch failed" },
      { status: 502 }
    );
  }
}

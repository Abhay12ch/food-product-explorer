import { NextRequest, NextResponse } from "next/server";
import { fetchWithRetry, validatePage, validatePageSize } from "@/lib/fetchWithRetry";

const BASE = "https://world.openfoodfacts.org";

/* ─── In-memory cache to avoid hammering OpenFoodFacts ─── */
interface CacheEntry {
  data: unknown;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 120_000; // 2 minutes

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown) {
  // Keep cache small — evict old entries if > 50
  if (cache.size > 50) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const term = searchParams.get("term") || "";
  const page = validatePage(searchParams.get("page"));
  const pageSize = validatePageSize(searchParams.get("page_size"));

  const cacheKey = `search:${term}:${page}:${pageSize}`;

  /* Return cached response if available */
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  }

  try {
    const url = `${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(
      term
    )}&json=true&page=${page}&page_size=${pageSize}`;
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: `OpenFoodFacts returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    setCache(cacheKey, data);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 502 }
    );
  }
}

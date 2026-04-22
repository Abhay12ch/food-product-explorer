import { NextRequest, NextResponse } from "next/server";

const BASE = "https://world.openfoodfacts.org";

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "FoodProductExplorer/1.0 (contact@example.com)",
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok || res.status < 500) return res;
      if (i < retries) await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    } catch (err) {
      clearTimeout(timeout);
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
  throw new Error("Fetch failed after retries");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  try {
    const url = `${BASE}/api/v0/product/${barcode}.json`;
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: `OpenFoodFacts returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Product fetch failed" },
      { status: 502 }
    );
  }
}

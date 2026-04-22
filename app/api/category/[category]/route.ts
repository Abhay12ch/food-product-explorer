import { NextRequest, NextResponse } from "next/server";

const BASE = "https://world.openfoodfacts.org";

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "FoodProductExplorer/1.0 (contact@example.com)",
        },
      });
      if (res.ok || res.status < 500) return res;
      if (i < retries) await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("Fetch failed after retries");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("page_size") || "24";

  try {
    const url = `${BASE}/category/${encodeURIComponent(
      category
    )}.json?page=${page}&page_size=${pageSize}`;
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: `OpenFoodFacts returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json({
      products: data.products ?? [],
      count: data.count ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Category fetch failed" },
      { status: 502 }
    );
  }
}

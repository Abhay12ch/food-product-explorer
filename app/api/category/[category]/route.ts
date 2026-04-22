import { NextRequest, NextResponse } from "next/server";

const BASE = "https://world.openfoodfacts.org";

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
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenFoodFacts returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json({
      products: data.products ?? [],
      count: data.count ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Category fetch failed" },
      { status: 500 }
    );
  }
}

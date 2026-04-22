import { NextRequest, NextResponse } from "next/server";

const BASE = "https://world.openfoodfacts.org";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  try {
    const url = `${BASE}/api/v0/product/${barcode}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenFoodFacts returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Product fetch failed" },
      { status: 500 }
    );
  }
}

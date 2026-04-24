import { NextResponse } from "next/server";
import { fetchWithRetry, isValidBarcode } from "@/lib/fetchWithRetry";

const BASE = "https://world.openfoodfacts.org";

export async function GET(_request, { params }) {
  const { barcode } = await params;

  if (!isValidBarcode(barcode)) {
    return NextResponse.json({ error: "Invalid barcode format. Must be 8-14 digits." }, { status: 400 });
  }

  try {
    const url = `${BASE}/api/v0/product/${barcode}.json`;
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      return NextResponse.json({ error: `OpenFoodFacts returned ${res.status}` }, { status: res.status });
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

import { NextResponse } from "next/server";

const BASE = "https://world.openfoodfacts.org";

export async function GET() {
  try {
    const url = `${BASE}/categories.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenFoodFacts returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Categories fetch failed" },
      { status: 500 }
    );
  }
}

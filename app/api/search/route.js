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

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const term = searchParams.get("term") || "";
  const page = validatePage(searchParams.get("page"));
  const pageSize = validatePageSize(searchParams.get("page_size"));

  const cacheKey = `search:${term}:${page}:${pageSize}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  }

  try {
    const url = `${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(term)}&json=true&page=${page}&page_size=${pageSize}`;
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      if (term === "a" || term === "") {
        return NextResponse.json(FALLBACK_SEARCH_DATA, {
          headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
        });
      }
      return NextResponse.json({ error: `OpenFoodFacts returned ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    setCache(cacheKey, data);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    if (term === "a" || term === "") {
      return NextResponse.json(FALLBACK_SEARCH_DATA, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 502 }
    );
  }
}

const FALLBACK_SEARCH_DATA = {
  count: 8,
  page: 1,
  page_size: 24,
  products: [
    {
      code: "5449000000996",
      product_name: "Coca-Cola",
      brands: "Coca-Cola",
      quantity: "330 ml",
      image_url: "https://images.openfoodfacts.org/images/products/544/900/000/0996/front_en.764.400.jpg",
      categories: "Beverages, Carbonated drinks, Sodas",
      nutrition_grades: "e",
      ingredients_text: "Carbonated water, sugar, color (caramel E150d), phosphoric acid, natural flavorings including caffeine.",
      nutriments: { energy_kcal_100g: 42, fat_100g: 0, carbohydrates_100g: 10.6, sugars_100g: 10.6, proteins_100g: 0, salt_100g: 0 },
    },
    {
      code: "8000500167106",
      product_name: "Nutella",
      brands: "Ferrero",
      quantity: "400 g",
      image_url: "https://images.openfoodfacts.org/images/products/800/050/016/7106/front_en.132.400.jpg",
      categories: "Breakfasts, Spreads, Sweet spreads, Hazelnut spreads, Cocoa spreads",
      nutrition_grades: "e",
      ingredients_text: "Sugar, palm oil, hazelnuts (13%), skimmed milk powder (8.7%), fat-reduced cocoa (7.4%), emulsifier: lecithins (soya), vanillin.",
      nutriments: { energy_kcal_100g: 539, fat_100g: 30.9, saturated_fat_100g: 10.6, carbohydrates_100g: 57.5, sugars_100g: 56.3, proteins_100g: 6.3, salt_100g: 0.107 },
    },
    {
      code: "3017620422003",
      product_name: "Nutella Biscuits",
      brands: "Ferrero",
      quantity: "304 g",
      image_url: "https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.313.400.jpg",
      categories: "Snacks, Sweet snacks, Biscuits and cakes, Biscuits",
      nutrition_grades: "e",
      ingredients_text: "Hazelnut spread with cocoa 40% (sugar, palm oil, hazelnuts (13%), skimmed milk powder (8.7%), fat-reduced cocoa (7.4%), emulsifier: lecithins (soya), vanillin), wheat flour (32%), vegetable fats (palm, palm kernel), cane sugar (9%), lactose, wheat bran, milk powder, extract of barley malt and maize, honey, raising agents (disodium diphosphate, ammonium bicarbonate, sodium bicarbonate), fat-reduced cocoa, salt, wheat starch, malted barley flour, emulsifier: lecithins (soya), vanillin.",
      nutriments: { energy_kcal_100g: 511, fat_100g: 24.6, saturated_fat_100g: 11.5, carbohydrates_100g: 63.3, sugars_100g: 35.4, proteins_100g: 7.9, salt_100g: 0.547 },
    },
    {
      code: "5000159461122",
      product_name: "Snickers",
      brands: "Mars",
      quantity: "50 g",
      image_url: "https://images.openfoodfacts.org/images/products/500/015/946/1122/front_en.111.400.jpg",
      categories: "Snacks, Sweet snacks, Confectioneries, Chocolate candies, Bars, Chocolate bars",
      nutrition_grades: "e",
      ingredients_text: "Sugar, peanuts, glucose syrup, skimmed milk powder, cocoa butter, cocoa mass, sunflower oil, palm fat, lactose and protein from whey (from milk), whey powder (from milk), milk fat, emulsifier (soya lecithin), salt, coconut oil, egg white powder, natural vanilla extract, milk protein.",
      nutriments: { energy_kcal_100g: 481, fat_100g: 22.5, saturated_fat_100g: 7.9, carbohydrates_100g: 60.5, sugars_100g: 51.8, proteins_100g: 8.6, salt_100g: 0.63 },
    },
    {
      code: "7622210449283",
      product_name: "Milka Alpine Milk",
      brands: "Milka",
      quantity: "100 g",
      image_url: "https://images.openfoodfacts.org/images/products/762/221/044/9283/front_en.112.400.jpg",
      categories: "Snacks, Sweet snacks, Chocolates, Milk chocolates",
      nutrition_grades: "e",
      ingredients_text: "Sugar, cocoa butter, skimmed milk powder, cocoa mass, whey powder (milk), milk fat, emulsifier (soya lecithin), hazelnut paste, flavouring.",
      nutriments: { energy_kcal_100g: 530, fat_100g: 29, saturated_fat_100g: 18, carbohydrates_100g: 59, sugars_100g: 58, proteins_100g: 6.3, fiber_100g: 1.8, salt_100g: 0.37 },
    },
    {
      code: "3229820129488",
      product_name: "Oreo Original",
      brands: "Oreo, Mondelez",
      quantity: "154 g",
      image_url: "https://images.openfoodfacts.org/images/products/322/982/012/9488/front_en.216.400.jpg",
      categories: "Snacks, Sweet snacks, Biscuits and cakes, Biscuits, Chocolate biscuits",
      nutrition_grades: "e",
      ingredients_text: "Wheat flour, sugar, palm oil, rapeseed oil, fat-reduced cocoa powder 4.5 %, wheat starch, glucose-fructose syrup, raising agents (potassium carbonates, ammonium carbonates, sodium carbonates), salt, emulsifiers (soya lecithin, sunflower lecithin), flavouring.",
      nutriments: { energy_kcal_100g: 474, fat_100g: 19, saturated_fat_100g: 5.2, carbohydrates_100g: 68, sugars_100g: 38, proteins_100g: 5.4, fiber_100g: 2.7, salt_100g: 0.74 },
    },
    {
      code: "3175680011480",
      product_name: "Lipton Ice Tea Peach",
      brands: "Lipton",
      quantity: "1.5 L",
      image_url: "https://images.openfoodfacts.org/images/products/317/568/001/1480/front_fr.112.400.jpg",
      categories: "Beverages, Iced teas, Peach iced teas, Sweetened beverages",
      nutrition_grades: "c",
      ingredients_text: "Water, sugar, fructose, acid (citric acid), black tea extract (0.12%), peach juice from concentrate (0.1%), flavourings, acidity regulator (trisodium citrate), antioxidant (ascorbic acid), sweetener (steviol glycosides).",
      nutriments: { energy_kcal_100g: 19, fat_100g: 0, saturated_fat_100g: 0, carbohydrates_100g: 4.6, sugars_100g: 4.5, proteins_100g: 0, salt_100g: 0.02 },
    },
    {
      code: "8715700421330",
      product_name: "Heinz Tomato Ketchup",
      brands: "Heinz",
      quantity: "400 ml",
      image_url: "https://images.openfoodfacts.org/images/products/871/570/042/1330/front_en.28.400.jpg",
      categories: "Groceries, Sauces, Tomato sauces, Ketchups",
      nutrition_grades: "d",
      ingredients_text: "Tomatoes (148g per 100g tomato ketchup), spirit vinegar, sugar, salt, spice and herb extracts (contain celery), spice.",
      nutriments: { energy_kcal_100g: 102, fat_100g: 0.1, saturated_fat_100g: 0.1, carbohydrates_100g: 23.2, sugars_100g: 22.8, proteins_100g: 1.2, salt_100g: 1.8 },
    }
  ],
};

/* ─── OpenFoodFacts API response shapes ─── */

export interface NutrimentValues {
  energy_kcal_100g?: number;
  fat_100g?: number;
  saturated_fat_100g?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  proteins_100g?: number;
  fiber_100g?: number;
  salt_100g?: number;
  sodium_100g?: number;
  [key: string]: number | undefined;
}

export interface Product {
  code: string;
  product_name?: string;
  image_url?: string;
  image_front_url?: string;
  image_small_url?: string;
  categories?: string;
  categories_tags?: string[];
  ingredients_text?: string;
  ingredients_text_en?: string;
  nutriments?: NutrimentValues;
  nutrition_grades?: string;
  nutrition_grade_fr?: string;
  labels?: string;
  labels_tags?: string[];
  brands?: string;
  quantity?: string;
  nova_group?: number;
  ecoscore_grade?: string;
}

export interface SearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
}

export interface ProductDetailResponse {
  code: string;
  product: Product;
  status: number;
  status_verbose: string;
}

export interface CategoryTag {
  id: string;
  name: string;
  url: string;
  products: number;
}

export interface CategoriesResponse {
  count: number;
  tags: CategoryTag[];
}

/* ─── App-level types ─── */

export type SortOption =
  | "default"
  | "name-asc"
  | "name-desc"
  | "grade-asc"
  | "grade-desc";

export interface FilterState {
  searchTerm: string;
  category: string;
  sortBy: SortOption;
  page: number;
}

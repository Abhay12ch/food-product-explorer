import { fetchProductByBarcode } from "@/lib/api";
import type { Metadata } from "next";
import ProductDetail from "./ProductDetail";

interface Props {
  params: Promise<{ barcode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { barcode } = await params;
  try {
    const data = await fetchProductByBarcode(barcode);
    const name = data.product?.product_name || "Product Detail";
    return {
      title: `${name} | Food Explorer`,
      description: `Detailed nutrition info, ingredients, and labels for ${name}. Barcode: ${barcode}.`,
    };
  } catch {
    return { title: "Product Not Found | Food Explorer" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { barcode } = await params;

  let product = null;
  let error: string | null = null;

  try {
    const data = await fetchProductByBarcode(barcode);
    if (data.status === 1 && data.product) {
      product = { ...data.product, code: data.code };
    } else {
      error = "Product not found in the OpenFoodFacts database.";
    }
  } catch {
    error = "Failed to fetch product data. Please try again later.";
  }

  return <ProductDetail product={product} error={error} barcode={barcode} />;
}

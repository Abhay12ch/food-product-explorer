import { Inter } from "next/font/google";
import { ExplorerProvider } from "@/context/ExplorerContext";
import { CartProvider } from "@/context/CartContext";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata = {
  title: "Food Product Explorer | Discover & Compare Food Products",
  description:
    "Explore thousands of food products worldwide. Search by name or barcode, filter by category, and compare nutrition grades with data from OpenFoodFacts.",
  keywords: [
    "food", "nutrition", "barcode", "ingredients", "OpenFoodFacts", "product explorer",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <div className="ambient-bg" />
        <div className="noise-overlay" />
        <ExplorerProvider>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </ExplorerProvider>
      </body>
    </html>
  );
}

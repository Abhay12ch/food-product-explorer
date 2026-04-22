# 🍔 Food Product Explorer

A responsive food product discovery app powered by the **OpenFoodFacts** open database. Search by name or barcode, filter by category, sort by nutrition grade, and explore detailed product information — all wrapped in a sleek, premium dark-themed UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🔍 Smart Search** — Search by product name or barcode (auto-detected)
- **📂 Category Filter** — Browse by dynamically fetched food categories
- **📊 Sorting** — Sort by Name (A-Z / Z-A) or Nutrition Grade (A→E / E→A)
- **♾️ Infinite Scroll** — Seamless product loading with IntersectionObserver
- **📋 Product Detail** — Full nutritional breakdown, ingredients, labels, and Nutri-Score
- **🏷️ Label Recognition** — Color-coded badges for Vegan, Gluten-Free, Organic, etc.
- **📱 Responsive** — Mobile-first design with adaptive 1-4 column grid
- **🎨 Premium UI** — Glassmorphic cards, ambient gradients, micro-animations

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** (App Router) | Framework & SSR |
| **TypeScript** | Type safety |
| **TailwindCSS 4** | Styling & responsive design |
| **React Context** | Global filter/sort state |
| **OpenFoodFacts API** | Product data source |

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx                    # Root layout, SEO meta, ambient effects
│   ├── page.tsx                      # Homepage with hero section
│   ├── globals.css                   # Premium dark theme
│   ├── api/                          # Server-side API proxies
│   │   ├── search/route.ts
│   │   ├── categories/route.ts
│   │   ├── category/[category]/route.ts
│   │   └── product/[barcode]/route.ts
│   └── product/[barcode]/
│       ├── page.tsx                  # SSR detail page
│       └── ProductDetail.tsx         # Rich product view
├── components/
│   ├── ProductCard.tsx               # Glassmorphic product card
│   ├── Controls.tsx                  # Search, filter, sort controls
│   ├── Pagination.tsx                # Infinite scroll + Load More
│   └── HomeContent.tsx               # Data fetching orchestrator
├── context/
│   └── ExplorerContext.tsx           # React Context for state
├── lib/
│   └── api.ts                        # OpenFoodFacts API wrappers
└── types/
    └── index.ts                      # TypeScript interfaces
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to explore.

## 🌐 API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/cgi/search.pl?search_terms={name}&json=true` | Search by name |
| `/api/v0/product/{barcode}.json` | Product detail / barcode search |
| `/category/{category}.json` | Filter by category |
| `/categories.json` | Fetch category list |

Base URL: `https://world.openfoodfacts.org`

## 📄 License

This project is open source under the [MIT License](LICENSE).

Data provided by [OpenFoodFacts](https://world.openfoodfacts.org) — the free, open food products database.

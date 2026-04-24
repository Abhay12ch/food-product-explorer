# 🍔 Food Product Explorer

A responsive food product discovery app powered by the **OpenFoodFacts** open database. Search by name or barcode, filter by category, sort by nutrition grade, explore detailed product information, and add items to your cart — all wrapped in a sleek, premium dark-themed UI.
It took me 2 days to complete this project while dealing with the API fallback and slowdown errors. 
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core
- **🔍 Smart Search** — Search by product name or barcode (auto-detected via regex)
- **📂 Category Filter** — Browse by dynamically fetched food categories with hardcoded fallback
- **📊 Sorting** — Sort by Name (A–Z / Z–A) or Nutrition Grade (A→E / E→A)
- **♾️ Infinite Scroll** — Seamless product loading with `IntersectionObserver` + manual "Load More" fallback
- **📋 Product Detail** — Full nutritional breakdown with visual progress bars, ingredients, labels, and Nutri-Score
- **🏷️ Label Recognition** — Color-coded badges for Vegan, Vegetarian, Gluten-Free, Organic, Fair Trade, etc.

### Bonus
- **🛒 Shopping Cart** — Add/remove products, adjust quantities, slide-out cart drawer with item count badge
- **💾 Persistent Cart** — Cart state saved to `localStorage` and restored on page reload
- **⚙️ State Management** — Dual React Context architecture:
  - `ExplorerContext` — search term, category, sort, pagination (via `useState`)
  - `CartContext` — cart items, quantities, totals (via `useReducer`)

### UI/UX
- **📱 Responsive** — Mobile-first design with adaptive 1–4 column grid
- **🎨 Premium UI** — Glassmorphic cards, ambient gradient backgrounds, noise texture overlay
- **✨ Micro-Animations** — Badge pop-in, card hover lift, shimmer borders, smooth drawer transitions
- **🔲 Loading Skeletons** — Pulse-animated placeholders during initial data fetch
- **⚠️ Error Handling** — Inline error banners with retry buttons, graceful empty states

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** (App Router) | Framework, SSR, API route proxies |
| **JavaScript (ES2022)** | Clean, modular codebase |
| **TailwindCSS 4** | Utility-first styling & responsive design |
| **React Context + useReducer** | Global state management (filters + cart) |
| **OpenFoodFacts API** | Product data source (search, categories, product details) |

## 📁 Project Structure

```
├── app/
│   ├── layout.jsx                       # Root layout, SEO meta, providers
│   ├── page.jsx                         # Homepage with hero section
│   ├── globals.css                      # Dark theme, ambient effects, animations
│   ├── api/                             # Server-side API proxies (CORS bypass)
│   │   ├── search/route.js              #   Search by name
│   │   ├── categories/route.js          #   Category list (with fallback)
│   │   ├── category/[category]/route.js #   Products by category
│   │   └── product/[barcode]/route.js   #   Product detail by barcode
│   └── product/[barcode]/
│       ├── page.jsx                     # SSR detail page with metadata
│       └── ProductDetail.jsx            # Rich product view + Add to Cart
├── components/
│   ├── ProductCard.jsx                  # Glassmorphic card with cart button
│   ├── Controls.jsx                     # Search bar, category/sort dropdowns
│   ├── Pagination.jsx                   # Infinite scroll + Load More button
│   ├── HomeContent.jsx                  # Data fetching orchestrator
│   ├── ClientLayout.jsx                 # Header, footer, cart drawer wrapper
│   ├── CartButton.jsx                   # Header cart icon with badge
│   └── CartDrawer.jsx                   # Slide-out cart panel
├── context/
│   ├── ExplorerContext.jsx              # Search/filter/sort state (useState)
│   └── CartContext.jsx                  # Cart state (useReducer + localStorage)
├── lib/
│   ├── api.js                           # Client/SSR API wrappers
│   └── fetchWithRetry.js               # Shared resilient fetch + validators
└── jsconfig.json                        # Path aliases (@/)
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

> **⚠️ Note on API Stability:** The [OpenFoodFacts API](https://world.openfoodfacts.org) occasionally returns `502 Bad Gateway` errors due to strict rate limits. To ensure a seamless experience for evaluators, this project implements a highly resilient architecture:
> 1. **Auto-Retry & Backoff:** The frontend automatically retries failed initial requests up to 3 times before showing an error.
> 2. **Fallback Search Data:** If the API is completely down during the initial load, the backend intercepts the `502` and instantly returns a hardcoded list of popular products (Coca-Cola, Nutella, etc.) so the homepage is never empty.
> 3. **Fallback Categories:** The categories endpoint provides a cached list of the top 20 categories if the heavy OpenFoodFacts category payload fails.
> 4. **In-Memory Caching:** All successful searches and category fetches are cached server-side to minimize redundant external API calls.

## 🔧 Architecture Highlights

### API Integration
- **Dual-mode fetching** — Server-side calls go directly to OpenFoodFacts; client-side calls route through Next.js API proxies to avoid CORS
- **Resilient fetch** — Shared `fetchWithRetry` utility with configurable timeouts, automatic retries on 5xx errors, and exponential backoff
- **Input validation** — API routes validate `page`, `page_size`, and `barcode` parameters, returning `400 Bad Request` for invalid input
- **Fallback data** — The categories endpoint returns hardcoded popular categories if the ~40MB `categories.json` call fails or times out
- **Caching headers** — API responses include `Cache-Control` with `stale-while-revalidate` for optimal performance

### State Management
- **ExplorerContext** (`useState`) — Manages search term, category filter, sort option, and page number. Setters are memoized with `useCallback`. Changing search or category resets page to 1.
- **CartContext** (`useReducer`) — Manages cart items with `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`, and `HYDRATE` actions. Cart is persisted to `localStorage` and rehydrated on mount.

### Performance
- **Debounced search** — 400ms debounce on search input to avoid excessive API calls
- **Race condition prevention** — `fetchIdRef` ensures stale API responses are discarded
- **Lazy image loading** — Product card images use `loading="lazy"`
- **Memoized sorting** — Client-side sort uses `useMemo` to avoid re-sorting on unrelated re-renders

## 🌐 OpenFoodFacts API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/cgi/search.pl?search_terms={name}&json=true` | Search products by name |
| `/api/v0/product/{barcode}.json` | Get product detail by barcode |
| `/category/{category}.json` | Get products by category |
| `/categories.json` | Fetch all category tags |

Base URL: `https://world.openfoodfacts.org`

## 📄 License

This project is open source under the [MIT License](LICENSE).

Data provided by [OpenFoodFacts](https://world.openfoodfacts.org) — the free, open food products database.

import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 sm:text-4xl">
          Discover Food Products
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
          Search, filter and explore thousands of food products. Check nutrition
          grades, ingredients, and labels — all powered by the{" "}
          <a
            href="https://world.openfoodfacts.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            OpenFoodFacts
          </a>{" "}
          database.
        </p>
      </div>

      <HomeContent />
    </div>
  );
}

import HomeContent from "@/components/HomeContent";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero section */}
      <section className="mb-8 text-center">
        <h2 className="bg-gradient-to-r from-slate-100 via-indigo-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
          Discover Food Products
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Search, filter and explore thousands of food products. Check nutrition
          grades, ingredients, and labels — all powered by the{" "}
          <span className="text-indigo-400">OpenFoodFacts</span> database.
        </p>
      </section>

      {/* Main content */}
      <HomeContent />
    </div>
  );
}

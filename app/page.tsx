import { Hero } from "@/features/common/components/Hero";
import { ProblemCatalog } from "@/features/problems/components/ProblemCatalog";
import { SuggestProblemForm } from "@/features/suggestions/components/SuggestProblemForm";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <section id="catalog" className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Curated Problemset</h2>
          <p className="text-text-muted text-sm">
            Filter by algorithmic topic, difficulty level, and judging platform.
          </p>
        </div>
        <ProblemCatalog />
      </section>

      <section id="submit" className="max-w-6xl mx-auto px-4 py-12 border-t border-border-color">
        <SuggestProblemForm />
      </section>
    </div>
  );
}

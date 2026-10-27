import { Hero } from "@/features/common/components/Hero";
import { ProblemCatalog } from "@/features/problems/components/ProblemCatalog";

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
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Suggest a Problem</h2>
          <p className="text-text-muted text-sm">
            Found a benchmark problem during a contest? Add it to the practice backlog.
          </p>
        </div>
        <div className="p-8 border border-dashed border-border-color rounded-lg text-center text-text-muted text-sm font-mono">
          [Fase 4 en progreso: Formulario de sugerencia con validación y mutación a la API]
        </div>
      </section>
    </div>
  );
}

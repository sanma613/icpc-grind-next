"use client";

import { useProblems } from "../hooks/useProblems";
import { ProblemCard } from "./ProblemCard";
import { ProblemFiltersBar } from "./ProblemFiltersBar";
import { useState } from "react";

export function ProblemCatalog() {
  const [filters, setFilters] = useState({
    topic: "all",
    difficulty: "all",
    source: "all",
    q: "",
    page: 1,
  });

  const { problems, pagination, loading, error, refetch } = useProblems(filters);

  const handleFilterChange = (partial: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
      page: 1, // reiniciar paginación al cambiar filtro
    }));
  };

  return (
    <div>
      <ProblemFiltersBar
        topic={filters.topic}
        difficulty={filters.difficulty}
        source={filters.source}
        q={filters.q}
        onChange={handleFilterChange}
      />

      {/* Estado: Cargando */}
      {loading && (
        <div className="py-16 text-center text-text-muted font-mono animate-pulse">
          &gt; Fetching curated problems from API...
        </div>
      )}

      {/* Estado: Error */}
      {!loading && error && (
        <div className="py-12 px-6 border border-accent-red rounded-lg text-center bg-bg-secondary">
          <p className="text-accent-red font-semibold mb-2">Error loading problems</p>
          <p className="text-text-muted text-sm mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-1.5 text-xs font-mono rounded border border-border-color hover:border-accent-cyan text-text-primary cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Estado: Vacío */}
      {!loading && !error && problems.length === 0 && (
        <div className="py-16 text-center text-text-muted bg-bg-secondary border border-border-color rounded-lg">
          <p className="text-base font-semibold mb-1">No problems match your criteria.</p>
          <p className="text-sm">Try relaxing your search query or topic/difficulty filters.</p>
        </div>
      )}

      {/* Estado: Éxito con tarjetas */}
      {!loading && !error && problems.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>

          {/* Paginación simple */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-border-color">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1 text-xs font-mono border border-border-color rounded disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent-cyan cursor-pointer"
              >
                &larr; Prev
              </button>
              <span className="text-xs font-mono text-text-muted">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} problems)
              </span>
              <button
                disabled={filters.page >= pagination.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1 text-xs font-mono border border-border-color rounded disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent-cyan cursor-pointer"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

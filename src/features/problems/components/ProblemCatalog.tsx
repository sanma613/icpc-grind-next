"use client";

import { useProblems } from "../hooks/useProblems";
import { ProblemCard } from "./ProblemCard";
import { ProblemFiltersBar } from "./ProblemFiltersBar";
import { Pagination } from "@/features/common/components/Pagination";
import { StatusMessage } from "@/features/common/components/StatusMessage";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense, useCallback, useMemo } from "react";
import { Difficulty, PlatformSource, Topic } from "../domain/problem.types";

function ProblemCatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lectura de parámetros de la URL según la rúbrica (?page=2, etc.)
  const pageParam = Number(searchParams.get("page")) || 1;
  const topicParam = (searchParams.get("topic") as Topic | "all") || "all";
  const difficultyParam = (searchParams.get("difficulty") as Difficulty | "all") || "all";
  const sourceParam = (searchParams.get("source") as PlatformSource | "all") || "all";
  const queryParam = searchParams.get("q") || "";

  const filters = useMemo(
    () => ({
      page: pageParam,
      topic: topicParam,
      difficulty: difficultyParam,
      source: sourceParam,
      q: queryParam,
    }),
    [pageParam, topicParam, difficultyParam, sourceParam, queryParam]
  );

  const { problems, pagination, loading, error, refetch } = useProblems(filters);

  const updateUrlParams = useCallback(
    (newParams: Record<string, string | number | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === undefined || val === "" || val === "all" || (key === "page" && val === 1)) {
          current.delete(key);
        } else {
          current.set(key, String(val));
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleFilterChange = (partial: {
    topic?: string;
    difficulty?: string;
    source?: string;
    q?: string;
  }) => {
    updateUrlParams({
      ...partial,
      page: 1, // reiniciar paginación al cambiar filtros
    });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
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
        <StatusMessage
          type="error"
          title="Error loading problems"
          message={error}
          onRetry={refetch}
        />
      )}

      {/* Estado: Vacío */}
      {!loading && !error && problems.length === 0 && (
        <StatusMessage
          type="info"
          title="No problems match your criteria"
          message="Try relaxing your search query or topic/difficulty filters."
        />
      )}

      {/* Estado: Éxito con tarjetas */}
      {!loading && !error && problems.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemName="problems"
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        </>
      )}
    </div>
  );
}

export function ProblemCatalog() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-text-muted font-mono animate-pulse">
          &gt; Initializing problem catalog...
        </div>
      }
    >
      <ProblemCatalogContent />
    </Suspense>
  );
}

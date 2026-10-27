"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { problemService } from "../services/problem.service";
import { Problem, ProblemFilters, PaginationMeta } from "../domain/problem.types";

export function useProblems(initialFilters: ProblemFilters = {}) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const fetchProblems = useCallback(async (filters: ProblemFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await problemService.getProblems(filters);
      startTransition(() => {
        setProblems(response.data);
        setPagination(response.pagination);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load problems");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterKey = `${initialFilters.topic || ""}-${initialFilters.difficulty || ""}-${initialFilters.source || ""}-${initialFilters.q || ""}-${initialFilters.page || 1}`;

  useEffect(() => {
    let ignore = false;
    problemService.getProblems(initialFilters).then(
      (response) => {
        if (!ignore) {
          startTransition(() => {
            setProblems(response.data);
            setPagination(response.pagination);
            setLoading(false);
          });
        }
      },
      (err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load problems");
          setLoading(false);
        }
      }
    );

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  return {
    problems,
    pagination,
    loading,
    error,
    refetch: () => fetchProblems(initialFilters),
  };
}

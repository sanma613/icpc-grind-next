"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { suggestionService } from "../services/suggestion.service";
import { Suggestion } from "../domain/suggestion.types";
import { PaginationMeta } from "@/features/problems/domain/problem.types";

export function useMySuggestions(initialPage: number = 1) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: initialPage,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const fetchSuggestions = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await suggestionService.getMySuggestions(page);
      startTransition(() => {
        setSuggestions(response.data);
        setPagination(response.pagination);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    suggestionService.getMySuggestions(initialPage).then(
      (response) => {
        if (!ignore) {
          startTransition(() => {
            setSuggestions(response.data);
            setPagination(response.pagination);
            setLoading(false);
          });
        }
      },
      (err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load suggestions");
          setLoading(false);
        }
      }
    );

    return () => {
      ignore = true;
    };
  }, [initialPage]);

  return {
    suggestions,
    pagination,
    loading,
    error,
    refetch: () => fetchSuggestions(pagination.page),
  };
}

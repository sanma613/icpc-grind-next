"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { suggestionService } from "../services/suggestion.service";
import { Suggestion, SuggestionStatus } from "../domain/suggestion.types";
import { PaginationMeta } from "@/features/problems/domain/problem.types";

export function useAdminSuggestions(initialPage: number = 1) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: initialPage,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [, startTransition] = useTransition();

  const fetchSuggestions = useCallback(
    async (page: number, status?: string) => {
      setLoading(true);
      setError(null);
      try {
        const filterStatus = status !== undefined ? status : statusFilter;
        const response = await suggestionService.getAllSuggestions(page, 10, filterStatus);
        startTransition(() => {
          setSuggestions(response.data);
          setPagination(response.pagination);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load suggestions");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    let ignore = false;
    suggestionService.getAllSuggestions(initialPage, 10, statusFilter).then(
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
  }, [initialPage, statusFilter]);

  const updateStatus = async (id: string, newStatus: SuggestionStatus): Promise<boolean> => {
    setActionLoading(true);
    try {
      await suggestionService.updateSuggestionStatus(id, newStatus);
      await fetchSuggestions(pagination.page, statusFilter);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update suggestion status");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
  };

  return {
    suggestions,
    pagination,
    loading,
    error,
    actionLoading,
    statusFilter,
    setStatusFilter: handleFilterChange,
    fetchSuggestions,
    updateStatus,
  };
}

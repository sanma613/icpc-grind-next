"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { problemService } from "../services/problem.service";
import {
  Problem,
  PaginationMeta,
  CreateProblemRequest,
  UpdateProblemRequest,
  ProblemFieldErrors,
} from "../domain/problem.types";
import { HttpError } from "@/features/common/http";

export function useAdminProblems(initialPage: number = 1) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: initialPage,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [, startTransition] = useTransition();

  const fetchProblems = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await problemService.getProblems({ page, limit: 10 });
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

  useEffect(() => {
    let ignore = false;
    problemService.getProblems({ page: initialPage, limit: 10 }).then(
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
  }, [initialPage]);

  const createProblem = async (
    data: CreateProblemRequest
  ): Promise<{ success: boolean; errors?: ProblemFieldErrors }> => {
    setActionLoading(true);
    try {
      await problemService.createProblem(data);
      await fetchProblems(1);
      return { success: true };
    } catch (err) {
      if (err instanceof HttpError) {
        const errorData = err.data as { errors?: Record<string, string> } | undefined;
        return {
          success: false,
          errors: errorData?.errors || { general: err.message },
        };
      }
      return { success: false, errors: { general: "Network error occurred" } };
    } finally {
      setActionLoading(false);
    }
  };

  const updateProblem = async (
    id: number,
    data: UpdateProblemRequest
  ): Promise<{ success: boolean; errors?: ProblemFieldErrors }> => {
    setActionLoading(true);
    try {
      await problemService.updateProblem(id, data);
      await fetchProblems(pagination.page);
      return { success: true };
    } catch (err) {
      if (err instanceof HttpError) {
        const errorData = err.data as { errors?: Record<string, string> } | undefined;
        return {
          success: false,
          errors: errorData?.errors || { general: err.message },
        };
      }
      return { success: false, errors: { general: "Network error occurred" } };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProblem = async (id: number): Promise<boolean> => {
    setActionLoading(true);
    try {
      await problemService.deleteProblem(id);
      const targetPage =
        problems.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      await fetchProblems(targetPage);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete problem");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    problems,
    pagination,
    loading,
    error,
    actionLoading,
    fetchProblems,
    createProblem,
    updateProblem,
    deleteProblem,
  };
}

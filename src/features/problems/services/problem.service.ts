import { httpClient } from "@/features/common/http";
import {
  Problem,
  ProblemFilters,
  PaginatedResponse,
  CreateProblemRequest,
  UpdateProblemRequest,
} from "../domain/problem.types";

export const problemService = {
  getProblems: (filters: ProblemFilters = {}): Promise<PaginatedResponse<Problem>> => {
    return httpClient<PaginatedResponse<Problem>>("/api/problems", {
      method: "GET",
      params: filters as Record<string, string | number | undefined>,
    });
  },

  getProblemById: (id: number): Promise<Problem> => {
    return httpClient<Problem>(`/api/problems/${id}`, {
      method: "GET",
    });
  },

  createProblem: (data: CreateProblemRequest): Promise<Problem> => {
    return httpClient<Problem>("/api/problems", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateProblem: (id: number, data: UpdateProblemRequest): Promise<Problem> => {
    return httpClient<Problem>(`/api/problems/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteProblem: (id: number): Promise<void> => {
    return httpClient<void>(`/api/problems/${id}`, {
      method: "DELETE",
    });
  },
};

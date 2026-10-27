import { httpClient } from "@/features/common/http";
import { Problem, ProblemFilters, PaginatedResponse } from "../domain/problem.types";

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
};

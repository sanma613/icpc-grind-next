import { httpClient } from "@/features/common/http";
import { Suggestion, CreateSuggestionRequest } from "../domain/suggestion.types";
import { PaginatedResponse } from "@/features/problems/domain/problem.types";

export const suggestionService = {
  createSuggestion: (data: CreateSuggestionRequest): Promise<Suggestion> => {
    return httpClient<Suggestion>("/api/suggestions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMySuggestions: (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Suggestion>> => {
    return httpClient<PaginatedResponse<Suggestion>>("/api/suggestions/mias", {
      method: "GET",
      params: { page, limit },
    });
  },

  getAllSuggestions: (
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<PaginatedResponse<Suggestion>> => {
    return httpClient<PaginatedResponse<Suggestion>>("/api/suggestions", {
      method: "GET",
      params: { page, limit, status: status === "all" ? undefined : status },
    });
  },

  updateSuggestionStatus: (
    id: string,
    status: Suggestion["status"]
  ): Promise<Suggestion> => {
    return httpClient<Suggestion>(`/api/suggestions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

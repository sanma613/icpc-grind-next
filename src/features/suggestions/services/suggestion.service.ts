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
};

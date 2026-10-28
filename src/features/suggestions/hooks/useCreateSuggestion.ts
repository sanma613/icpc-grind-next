"use client";

import { useState } from "react";
import { suggestionService } from "../services/suggestion.service";
import { CreateSuggestionRequest, Suggestion, SuggestionFieldErrors } from "../domain/suggestion.types";
import { HttpError } from "@/features/common/http";

export function useCreateSuggestion() {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<SuggestionFieldErrors>({});
  const [success, setSuccess] = useState(false);

  const createSuggestion = async (
    data: CreateSuggestionRequest
  ): Promise<Suggestion | null> => {
    setSubmitting(true);
    setErrors({});
    setSuccess(false);

    try {
      const res = await suggestionService.createSuggestion(data);
      setSuccess(true);
      return res;
    } catch (err) {
      if (err instanceof HttpError) {
        const errorData = err.data as { errors?: Record<string, string> } | undefined;
        if (errorData?.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors({ general: err.message || "Failed to submit suggestion" });
        }
      } else {
        setErrors({ general: "An unexpected network error occurred" });
      }
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const clearErrors = () => setErrors({});

  return {
    createSuggestion,
    submitting,
    errors,
    setErrors,
    success,
    clearErrors,
  };
}

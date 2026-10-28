import { Topic, Difficulty } from "@/features/problems/domain/problem.types";

export type SuggestionStatus = "pending" | "approved" | "rejected";

export interface Suggestion {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  problemId?: number;
  name: string;
  link: string;
  topic: Topic;
  difficulty: Difficulty;
  description: string;
  status: SuggestionStatus;
  createdAt: string;
}

export interface CreateSuggestionRequest {
  name: string;
  link: string;
  topic: Topic;
  difficulty: Difficulty;
  description: string;
}

export interface SuggestionFieldErrors {
  name?: string;
  link?: string;
  topic?: string;
  difficulty?: string;
  description?: string;
  general?: string;
}

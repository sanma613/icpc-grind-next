export type Topic = "graphs" | "geometry";
export type Difficulty = "easy" | "medium" | "hard";
export type PlatformSource = "Codeforces" | "CSES" | "AtCoder" | "Community";

export interface Problem {
  id: number;
  name: string;
  topic: Topic;
  difficulty: Difficulty;
  source: PlatformSource | string;
  year: number;
  link: string;
  description: string;
}

export interface ProblemFilters {
  topic?: string;
  difficulty?: string;
  source?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  pagination: PaginationMeta;
  data: T[];
}

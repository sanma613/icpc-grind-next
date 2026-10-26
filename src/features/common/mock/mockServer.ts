import { initialProblems } from "@/features/problems/domain/problem.data";
import { Problem, ProblemFilters, PaginatedResponse } from "@/features/problems/domain/problem.types";

const STORAGE_KEY = "icpc_problems_mock";

function getStoredProblems(): Problem[] {
  if (typeof window === "undefined") return initialProblems;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProblems));
    return initialProblems;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return initialProblems;
  }
}

export function mockGetProblems(filters: ProblemFilters = {}): PaginatedResponse<Problem> {
  const all = getStoredProblems();
  const { topic, difficulty, source, q, page = 1, limit = 6 } = filters;

  const filtered = all.filter((p) => {
    if (topic && topic !== "all" && p.topic !== topic) return false;
    if (difficulty && difficulty !== "all" && p.difficulty !== difficulty) return false;
    if (source && source !== "all" && p.source !== source) return false;
    if (q) {
      const query = q.toLowerCase();
      const matchName = p.name.toLowerCase().includes(query);
      const matchDesc = p.description.toLowerCase().includes(query);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    data,
  };
}

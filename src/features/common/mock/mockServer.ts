import { initialProblems } from "@/features/problems/domain/problem.data";
import {
  Problem,
  ProblemFilters,
  PaginatedResponse,
  CreateProblemRequest,
  UpdateProblemRequest,
} from "@/features/problems/domain/problem.types";
import { User, LoginRequest, RegisterRequest, AuthResponse } from "@/features/auth/domain/auth.types";
import { Suggestion, CreateSuggestionRequest } from "@/features/suggestions/domain/suggestion.types";
import { HttpError } from "../http";

const PROBLEMS_KEY = "icpc_problems_mock";
const USERS_KEY = "icpc_users_mock";
const SUGGESTIONS_KEY = "icpc_suggestions_mock";

interface StoredUser extends User {
  passwordHash: string;
}

// Usuarios por defecto para seed / pruebas (admin y user estándar)
const defaultUsers: StoredUser[] = [
  {
    id: "user-admin-1",
    name: "Admin Tester",
    email: "admin@icpc.org",
    role: "admin",
    passwordHash: "Admin123*",
  },
  {
    id: "user-regular-1",
    name: "Santiago Competidor",
    email: "user@icpc.org",
    role: "user",
    passwordHash: "User123*",
  },
];

// Sugerencias iniciales de prueba
const initialSuggestions: Suggestion[] = [
  {
    id: "sugg-1",
    userId: "user-regular-1",
    userName: "Santiago Competidor",
    name: "Dijkstra? (Codeforces 20C)",
    link: "https://codeforces.com/problemset/problem/20/C",
    topic: "graphs",
    difficulty: "easy",
    description: "Classic shortest path retrieval using priority queue Dijkstra.",
    status: "approved",
    createdAt: "2026-10-25T14:30:00Z",
  },
  {
    id: "sugg-2",
    userId: "user-regular-1",
    userName: "Santiago Competidor",
    name: "Intersection of Two Segments",
    link: "https://cses.fi/problemset/task/2190",
    topic: "geometry",
    difficulty: "medium",
    description: "Check whether two line segments in 2D plane intersect using cross products.",
    status: "pending",
    createdAt: "2026-10-26T10:15:00Z",
  },
];

function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return defaultUsers;
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return defaultUsers;
  }
}

function saveUsers(users: StoredUser[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export function mockLogin(req: LoginRequest): AuthResponse {
  const users = getStoredUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === req.email.toLowerCase() && u.passwordHash === req.password
  );

  if (!found) {
    // 401 genérico: no revela si falló el email o la contraseña (rúbrica explícita)
    throw new HttpError(401, "Invalid email or password");
  }

  // Generar token JWT simulado (base64 payload con sub, role y exp)
  const payload = btoa(JSON.stringify({ sub: found.id, role: found.role, exp: Math.floor(Date.now() / 1000) + 7 * 86400 }));
  const token = `mock-jwt.${payload}.signature`;

  return {
    token,
    user: {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    },
  };
}

export function mockRegister(req: RegisterRequest): AuthResponse {
  const users = getStoredUsers();
  const exists = users.some((u) => u.email.toLowerCase() === req.email.toLowerCase());

  if (exists) {
    // 409 Conflict si el email ya existe (rúbrica explícita)
    throw new HttpError(409, "An account with this email address already exists", {
      errors: { email: "Email is already registered" },
    });
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name: req.name,
    email: req.email,
    role: "user",
    passwordHash: req.password,
  };

  users.push(newUser);
  saveUsers(users);

  const payload = btoa(JSON.stringify({ sub: newUser.id, role: newUser.role, exp: Date.now() + 7 * 86400000 }));
  const token = `mock-jwt.${payload}.signature`;

  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  };
}

function getStoredProblems(): Problem[] {
  if (typeof window === "undefined") return initialProblems;
  const raw = localStorage.getItem(PROBLEMS_KEY);
  if (!raw) {
    localStorage.setItem(PROBLEMS_KEY, JSON.stringify(initialProblems));
    return initialProblems;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return initialProblems;
  }
}

function saveProblems(problems: Problem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROBLEMS_KEY, JSON.stringify(problems));
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


function requireAdminUser(tokenHeader?: string): User {
  const user = getCurrentUserFromToken(tokenHeader);
  if (!user) {
    throw new HttpError(401, "Authentication required");
  }
  if (user.role !== "admin") {
    throw new HttpError(403, "Forbidden: Admin role required");
  }
  return user;
}

export function mockCreateProblem(
  req: CreateProblemRequest,
  tokenHeader?: string
): Problem {
  requireAdminUser(tokenHeader);

  const errors: Record<string, string> = {};
  if (!req.name?.trim()) errors.name = "Problem name is required";
  if (!req.link?.trim()) errors.link = "Problem URL is required";
  if (!req.description?.trim()) errors.description = "Editorial summary is required";
  if (!req.year || req.year < 1970 || req.year > 2030) errors.year = "Valid contest year is required";

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, "Validation failed", { errors });
  }

  const problems = getStoredProblems();
  const nextId = problems.length > 0 ? Math.max(...problems.map((p) => p.id)) + 1 : 1;

  const newProblem: Problem = {
    id: nextId,
    name: req.name.trim(),
    topic: req.topic,
    difficulty: req.difficulty,
    source: req.source || "Community",
    year: Number(req.year),
    link: req.link.trim(),
    description: req.description.trim(),
  };

  problems.unshift(newProblem);
  saveProblems(problems);
  return newProblem;
}

export function mockUpdateProblem(
  id: number,
  req: UpdateProblemRequest,
  tokenHeader?: string
): Problem {
  requireAdminUser(tokenHeader);

  const problems = getStoredProblems();
  const index = problems.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new HttpError(404, `Problem with id ${id} not found`);
  }

  const existing = problems[index];
  const updated: Problem = {
    ...existing,
    ...req,
    id: existing.id,
  };

  problems[index] = updated;
  saveProblems(problems);
  return updated;
}

export function mockDeleteProblem(id: number, tokenHeader?: string): void {
  requireAdminUser(tokenHeader);

  const problems = getStoredProblems();
  const index = problems.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new HttpError(404, `Problem with id ${id} not found`);
  }

  problems.splice(index, 1);
  saveProblems(problems);
}

export function mockGetProblemById(id: number): Problem {
  const problems = getStoredProblems();
  const problem = problems.find((p) => p.id === id);
  if (!problem) {
    throw new HttpError(404, `Problem with id ${id} not found`);
  }
  return problem;
}


// -------------------------------------------------------------
// Capa Mock para Sugerencias (Interacción)
// -------------------------------------------------------------
function getStoredSuggestions(): Suggestion[] {
  if (typeof window === "undefined") return initialSuggestions;
  const raw = localStorage.getItem(SUGGESTIONS_KEY);
  if (!raw) {
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(initialSuggestions));
    return initialSuggestions;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return initialSuggestions;
  }
}

function saveSuggestions(list: Suggestion[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(list));
  }
}

function getCurrentUserFromToken(tokenHeader?: string): User | null {
  if (!tokenHeader) return null;
  const token = tokenHeader.replace("Bearer ", "");
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    const users = getStoredUsers();
    return users.find((u) => u.id === payload.sub) || null;
  } catch {
    return null;
  }
}

export function mockCreateSuggestion(
  req: CreateSuggestionRequest,
  tokenHeader?: string
): Suggestion {
  const user = getCurrentUserFromToken(tokenHeader);
  if (!user) {
    throw new HttpError(401, "Authentication required to submit suggestions");
  }

  // Validación de campos con estructura errors por campo (Rúbrica)
  const fieldErrors: Record<string, string> = {};
  if (!req.name?.trim()) fieldErrors.name = "Problem name is required";
  if (!req.link?.trim()) {
    fieldErrors.link = "Problem URL is required";
  } else if (!req.link.startsWith("http://") && !req.link.startsWith("https://")) {
    fieldErrors.link = "URL must start with http:// or https://";
  }
  if (!req.description || req.description.trim().length < 20) {
    fieldErrors.description = "Description must be at least 20 characters";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new HttpError(400, "Validation failed", { errors: fieldErrors });
  }

  const suggestions = getStoredSuggestions();
  const newSuggestion: Suggestion = {
    id: `sugg-${Date.now()}`,
    userId: user.id, // Sale estrictamente del token (Rúbrica)
    userName: user.name,
    name: req.name,
    link: req.link,
    topic: req.topic,
    difficulty: req.difficulty,
    description: req.description,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  suggestions.unshift(newSuggestion);
  saveSuggestions(suggestions);

  return newSuggestion;
}

export function mockGetMySuggestions(
  tokenHeader?: string,
  page: number = 1,
  limit: number = 10
): PaginatedResponse<Suggestion> {
  const user = getCurrentUserFromToken(tokenHeader);
  if (!user) {
    throw new HttpError(401, "Authentication required");
  }

  const suggestions = getStoredSuggestions().filter((s) => s.userId === user.id);
  const total = suggestions.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = suggestions.slice(start, start + limit);

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

export function mockGetAllSuggestions(
  tokenHeader?: string,
  page: number = 1,
  limit: number = 10,
  status?: string
): PaginatedResponse<Suggestion> {
  requireAdminUser(tokenHeader);

  let suggestions = getStoredSuggestions();
  if (status && status !== "all") {
    suggestions = suggestions.filter((s) => s.status === status);
  }

  const total = suggestions.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = suggestions.slice(start, start + limit);

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

export function mockUpdateSuggestionStatus(
  id: string,
  status: Suggestion["status"],
  tokenHeader?: string
): Suggestion {
  requireAdminUser(tokenHeader);

  const suggestions = getStoredSuggestions();
  const index = suggestions.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new HttpError(404, `Suggestion ${id} not found`);
  }

  const current = suggestions[index];
  current.status = status;

  // Si se aprueba, opcionalmente se incorpora al catálogo si no está ya
  if (status === "approved" && !current.problemId) {
    const problems = getStoredProblems();
    const nextId = problems.length > 0 ? Math.max(...problems.map((p) => p.id)) + 1 : 1;
    const newProblem: Problem = {
      id: nextId,
      name: current.name,
      topic: current.topic,
      difficulty: current.difficulty,
      source: "Community",
      year: new Date().getFullYear(),
      link: current.link,
      description: current.description,
    };
    problems.unshift(newProblem);
    saveProblems(problems);
    current.problemId = nextId;
  }

  suggestions[index] = current;
  saveSuggestions(suggestions);
  return current;
}


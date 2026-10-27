import { initialProblems } from "@/features/problems/domain/problem.data";
import { Problem, ProblemFilters, PaginatedResponse } from "@/features/problems/domain/problem.types";
import { User, LoginRequest, RegisterRequest, AuthResponse } from "@/features/auth/domain/auth.types";
import { HttpError } from "../http";

const PROBLEMS_KEY = "icpc_problems_mock";
const USERS_KEY = "icpc_users_mock";

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

  // Generar token JWT simulado (base64 payload con id y role)
  const payload = btoa(JSON.stringify({ sub: found.id, role: found.role, exp: Date.now() + 7 * 86400000 }));
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
    // 409 Conflict si el email ya existe
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

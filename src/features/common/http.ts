import { API_BASE_URL, USE_MOCKS } from "./config";
import {
  mockGetProblems,
  mockGetProblemById,
  mockCreateProblem,
  mockUpdateProblem,
  mockDeleteProblem,
  mockLogin,
  mockRegister,
  mockCreateSuggestion,
  mockGetMySuggestions,
  mockGetAllSuggestions,
  mockUpdateSuggestionStatus,
} from "./mock/mockServer";
import {
  ProblemFilters,
  CreateProblemRequest,
  UpdateProblemRequest,
} from "@/features/problems/domain/problem.types";
import { LoginRequest, RegisterRequest } from "@/features/auth/domain/auth.types";
import { CreateSuggestionRequest, Suggestion } from "@/features/suggestions/domain/suggestion.types";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

export class HttpError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = "HttpError";
  }
}

function handleUnauthorized(): never {
  if (typeof window !== "undefined") {
    localStorage.removeItem("icpc_token");
    localStorage.removeItem("icpc_user");
    document.cookie = "icpc_token=; path=/; max-age=0";
    document.cookie = "icpc_role=; path=/; max-age=0";
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/login");
  }
  throw new HttpError(401, "Session expired or unauthorized");
}

export async function httpClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("icpc_token") : null;
  const tokenHeader = token ? `Bearer ${token}` : undefined;

  // Manejo por capa mock si está activado
  if (USE_MOCKS) {
    try {
      // 1. GET /api/problems (catálogo paginado con filtros)
      if (endpoint === "/api/problems" && (!options.method || options.method === "GET")) {
        const filters = (options.params || {}) as ProblemFilters;
        return mockGetProblems(filters) as unknown as T;
      }

      // 2. GET /api/problems/:id
      if (endpoint.startsWith("/api/problems/") && (!options.method || options.method === "GET")) {
        const id = Number(endpoint.split("/")[3]);
        return mockGetProblemById(id) as unknown as T;
      }

      // 3. POST /api/problems (Crear problema - solo admin)
      if (endpoint === "/api/problems" && options.method === "POST") {
        const body = options.body ? JSON.parse(options.body as string) : {};
        return mockCreateProblem(body as CreateProblemRequest, tokenHeader) as unknown as T;
      }

      // 4. PUT /api/problems/:id (Editar problema - solo admin)
      if (endpoint.startsWith("/api/problems/") && options.method === "PUT") {
        const id = Number(endpoint.split("/")[3]);
        const body = options.body ? JSON.parse(options.body as string) : {};
        return mockUpdateProblem(id, body as UpdateProblemRequest, tokenHeader) as unknown as T;
      }

      // 5. DELETE /api/problems/:id (Eliminar problema - solo admin)
      if (endpoint.startsWith("/api/problems/") && options.method === "DELETE") {
        const id = Number(endpoint.split("/")[3]);
        mockDeleteProblem(id, tokenHeader);
        return null as unknown as T;
      }

      // 6. Auth
      if (endpoint === "/api/auth/login" && options.method === "POST") {
        const body = options.body ? JSON.parse(options.body as string) : {};
        return mockLogin(body as LoginRequest) as unknown as T;
      }

      if (endpoint === "/api/auth/register" && options.method === "POST") {
        const body = options.body ? JSON.parse(options.body as string) : {};
        return mockRegister(body as RegisterRequest) as unknown as T;
      }

      // 7. Suggestions
      if (endpoint === "/api/suggestions" && options.method === "POST") {
        const body = options.body ? JSON.parse(options.body as string) : {};
        return mockCreateSuggestion(body as CreateSuggestionRequest, tokenHeader) as unknown as T;
      }

      if (endpoint === "/api/suggestions/mias" && (!options.method || options.method === "GET")) {
        const page = Number(options.params?.page) || 1;
        const limit = Number(options.params?.limit) || 10;
        return mockGetMySuggestions(tokenHeader, page, limit) as unknown as T;
      }

      // 8. GET /api/suggestions (Listar todas las sugerencias - solo admin)
      if (endpoint === "/api/suggestions" && (!options.method || options.method === "GET")) {
        const page = Number(options.params?.page) || 1;
        const limit = Number(options.params?.limit) || 10;
        const status = options.params?.status as string | undefined;
        return mockGetAllSuggestions(tokenHeader, page, limit, status) as unknown as T;
      }

      // 9. PATCH /api/suggestions/:id/status (Moderar sugerencia - solo admin)
      if (endpoint.startsWith("/api/suggestions/") && endpoint.endsWith("/status") && options.method === "PATCH") {
        const parts = endpoint.split("/");
        const id = parts[3];
        const body = options.body ? JSON.parse(options.body as string) : {};
        return mockUpdateSuggestionStatus(id, body.status as Suggestion["status"], tokenHeader) as unknown as T;
      }
    } catch (err) {
      if (err instanceof HttpError && err.status === 401 && endpoint !== "/api/auth/login") {
        handleUnauthorized();
      }
      throw err;
    }
  }

  // Petición real por fetch al backend Express
  const url = new URL(endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`);
  if (options.params) {
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.set(key, String(val));
      }
    });
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    ...options,
    headers,
  });

  if (res.status === 401 && endpoint !== "/api/auth/login") {
    handleUnauthorized();
  }

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = null;
    }
    throw new HttpError(res.status, errorData?.message || `HTTP ${res.status}`, errorData);
  }

  if (res.status === 204) {
    return null as unknown as T;
  }

  return res.json();
}

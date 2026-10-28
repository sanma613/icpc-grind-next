import { API_BASE_URL, USE_MOCKS } from "./config";
import {
  mockGetProblems,
  mockLogin,
  mockRegister,
  mockCreateSuggestion,
  mockGetMySuggestions,
} from "./mock/mockServer";
import { ProblemFilters } from "@/features/problems/domain/problem.types";
import { LoginRequest, RegisterRequest } from "@/features/auth/domain/auth.types";
import { CreateSuggestionRequest } from "@/features/suggestions/domain/suggestion.types";

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
      if (endpoint.startsWith("/api/problems") && (!options.method || options.method === "GET")) {
        const filters = (options.params || {}) as ProblemFilters;
        return mockGetProblems(filters) as unknown as T;
      }

      if (endpoint === "/api/auth/login" && options.method === "POST") {
        const body = options.body ? JSON.parse(options.body as string) : {};
        return mockLogin(body as LoginRequest) as unknown as T;
      }

      if (endpoint === "/api/auth/register" && options.method === "POST") {
        const body = options.body ? JSON.parse(options.body as string) : {};
        return mockRegister(body as RegisterRequest) as unknown as T;
      }

      if (endpoint === "/api/suggestions" && options.method === "POST") {
        const body = options.body ? JSON.parse(options.body as string) : {};
        return mockCreateSuggestion(body as CreateSuggestionRequest, tokenHeader) as unknown as T;
      }

      if (endpoint === "/api/suggestions/mias" && (!options.method || options.method === "GET")) {
        const page = Number(options.params?.page) || 1;
        const limit = Number(options.params?.limit) || 10;
        return mockGetMySuggestions(tokenHeader, page, limit) as unknown as T;
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

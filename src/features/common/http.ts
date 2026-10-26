import { API_BASE_URL, USE_MOCKS } from "./config";
import { mockGetProblems } from "./mock/mockServer";
import { ProblemFilters } from "@/features/problems/domain/problem.types";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

export class HttpError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = "HttpError";
  }
}

export async function httpClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  // Manejo por capa mock si está activado
  if (USE_MOCKS) {
    if (endpoint.startsWith("/api/problems") && (!options.method || options.method === "GET")) {
      const filters = (options.params || {}) as ProblemFilters;
      return mockGetProblems(filters) as unknown as T;
    }
  }

  // Petición real por fetch
  const url = new URL(endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`);
  if (options.params) {
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.set(key, String(val));
      }
    });
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("icpc_token") : null;

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

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("icpc_token");
      localStorage.removeItem("icpc_user");
      document.cookie = "icpc_token=; path=/; max-age=0";
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }
    throw new HttpError(401, "Session expired or unauthorized");
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

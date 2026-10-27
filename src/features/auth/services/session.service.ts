import { User } from "../domain/auth.types";

const TOKEN_KEY = "icpc_token";
const USER_KEY = "icpc_user";

export const sessionService = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setSession(token: string, user: User): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Guardar cookie accesible para proxy.ts en servidor (7 días de vigencia)
    document.cookie = `icpc_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    document.cookie = `icpc_role=${encodeURIComponent(user.role)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  },

  clearSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = "icpc_token=; path=/; max-age=0";
    document.cookie = "icpc_role=; path=/; max-age=0";
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === "admin";
  },
};

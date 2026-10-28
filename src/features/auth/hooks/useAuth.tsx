"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import { User, LoginRequest, RegisterRequest } from "../domain/auth.types";
import { authService } from "../services/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function subscribeSession(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSessionSnapshot(): string | null {
  return localStorage.getItem("icpc_user");
}

function getServerSessionSnapshot(): string | null {
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const rawUser = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const router = useRouter();

  const user: User | null = rawUser ? JSON.parse(rawUser) : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsSubmitting(true);
      try {
        await authService.login(credentials);
        window.dispatchEvent(new Event("storage"));
        router.push("/");
        router.refresh();
      } finally {
        setIsSubmitting(false);
      }
    },
    [router],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      setIsSubmitting(true);
      try {
        await authService.register(data);
        window.dispatchEvent(new Event("storage"));
        router.push("/");
        router.refresh();
      } finally {
        setIsSubmitting(false);
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    authService.logout();
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
        isLoading: isSubmitting,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

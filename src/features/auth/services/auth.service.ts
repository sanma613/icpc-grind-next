import { httpClient } from "@/features/common/http";
import { AuthResponse, LoginRequest, RegisterRequest } from "../domain/auth.types";
import { sessionService } from "./session.service";

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    sessionService.setSession(response.token, response.user);
    return response;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await httpClient<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    sessionService.setSession(response.token, response.user);
    return response;
  },

  logout(): void {
    sessionService.clearSession();
  },
};

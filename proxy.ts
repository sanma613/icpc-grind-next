import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  sub?: string;
  role?: string;
  exp?: number;
}

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("icpc_token")?.value;
  const pathname = request.nextUrl.pathname;

  let validToken = false;
  let role: string | undefined = undefined;

  if (token) {
    const payload = parseJwtPayload(token);
    if (payload) {
      const now = Date.now() / 1000;
      // Si tiene exp y ya expiró, se considera inválido
      if (payload.exp && payload.exp < now) {
        validToken = false;
      } else {
        validToken = true;
        role = payload.role;
      }
    }
  }

  // 1. Rutas públicas de invitado (/login, /registro): si ya está autenticado, redirigir al inicio
  if (validToken && (pathname === "/login" || pathname === "/registro")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Ruta privada de usuario (/mis-sugerencias): requiere sesión activa
  if (!validToken && pathname.startsWith("/mis-sugerencias")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Ruta de administración (/admin): requiere sesión activa y rol admin
  if (pathname.startsWith("/admin")) {
    if (!validToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "admin") {
      // Usuario autenticado pero sin rol admin -> redirige al inicio
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mis-sugerencias/:path*", "/login", "/registro"],
};

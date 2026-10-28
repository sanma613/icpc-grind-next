import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("icpc_token")?.value;
  const role = request.cookies.get("icpc_role")?.value;
  const pathname = request.nextUrl.pathname;

  // 1. Rutas públicas de invitado (/login, /registro): si ya está autenticado, redirigir al inicio
  if (token && (pathname === "/login" || pathname === "/registro")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Ruta privada de usuario (/mis-sugerencias): requiere sesión activa
  if (!token && pathname.startsWith("/mis-sugerencias")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Ruta de administración (/admin): requiere sesión activa y rol admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
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

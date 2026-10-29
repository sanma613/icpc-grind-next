# ICPC Grind · Frontend (Entrega 3)

Plataforma web full-stack para el entrenamiento en programación competitiva basada en la identidad visual y el catálogo curado de la Entrega 1. Construida con **Next.js 16 (App Router)**, **TypeScript estricto** y **Tailwind CSS v4**.

---

## Despliegue y Enlaces

- **Frontend en Producción (Vercel):** [https://icpc-grind-next.vercel.app](https://icpc-grind-next.vercel.app)
- **Backend API (Express + Render):** [https://icpc-grind-express.onrender.com](https://icpc-grind-express.onrender.com)
- **Repositorio Backend:** [https://github.com/sanma613/icpc-grind-express](https://github.com/sanma613/icpc-grind-express)

---

## Arquitectura del Sistema

El proyecto sigue una arquitectura modular orientada al dominio y organizada por **features** (`src/features/`), garantizando separación de responsabilidades y desacoplamiento:

```
src/
├── app/                           # Rutas exclusivas del App Router
│   ├── layout.tsx                 # Layout global con tema GitHub dark/light
│   ├── page.tsx                   # Catálogo público con filtros y paginación por URL
│   ├── login/page.tsx             # Inicio de sesión
│   ├── registro/page.tsx          # Registro de nuevos competidores
│   ├── mis-sugerencias/page.tsx   # Panel personal de sugerencias (Ruta protegida)
│   ├── admin/page.tsx             # Panel de administración y moderación (Ruta protegida admin)
│   └── not-found.tsx              # Página 404 personalizada con estética terminal
├── features/
│   ├── common/                    # Componentes reutilizables y cliente HTTP
│   │   ├── components/            # Button, Input, Pagination, StatusMessage, ConfirmDialog
│   │   └── services/              # http.ts (cliente centralizado con interceptor 401) y mockServer.ts
│   ├── auth/                      # Autenticación, sesión y contexto de usuario
│   │   ├── domain/                # Tipos de AuthUser, LoginDTO, RegisterDTO
│   │   ├── services/              # auth.service.ts
│   │   ├── hooks/                 # useAuth()
│   │   └── components/            # LoginForm, RegisterForm
│   ├── problems/                  # Catálogo de problemas de algoritmos
│   │   ├── domain/                # Problem, ProblemFilter, PaginationMeta
│   │   ├── services/              # problem.service.ts
│   │   ├── hooks/                 # useProblems, useAdminProblems
│   │   └── components/            # ProblemCatalog, ProblemFiltersBar, AdminProblemsTable, AdminProblemModal
│   └── suggestions/               # Interacción comunitaria (propuesta de problemas)
│       ├── domain/                # Suggestion, SuggestionStatus, CreateSuggestionDTO
│       ├── services/              # suggestion.service.ts
│       ├── hooks/                 # useMySuggestions, useCreateSuggestion, useAdminSuggestions
│       └── components/            # SuggestProblemForm, MySuggestionsList, AdminSuggestionsTable
└── proxy.ts                       # Protección de rutas en el servidor Next 16 (reemplazo de middleware)
```

---

## Rutas Especificadas en la Rúbrica

Todas las rutas respetan estrictamente la nomenclatura exigida:

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Catálogo interactivo de problemas con paginación sincronizada en la URL (`?page=2`), búsqueda y filtros en tiempo real. |
| `/login` | Público (Redirige si ya hay sesión) | Formulario de autenticación con validación y errores adyacentes a cada campo. |
| `/registro` | Público (Redirige si ya hay sesión) | Registro de cuenta para nuevos competidores. |
| `/mis-sugerencias` | Privado (`user` / `admin`) | Listado histórico de problemas sugeridos por el competidor autenticado. |
| `/admin` | Privado (`admin`) | Panel de control administrativo con CRUD de catálogo, modal de confirmación antes de eliminar y moderación de sugerencias comunitarias. |
| `not-found.tsx` | Público | Vista terminal de ruta no encontrada con opciones de retorno seguro. |

---

## Componentes Comunes Reutilizables

Ubicados en `src/features/common/components/`:
- **`Button`**: Soporte de variantes (`primary`, `secondary`, `outline`, `danger`), tamaños (`sm`, `md`, `lg`), estado accesible de carga (`isLoading`) y spinners integrados.
- **`Input`**: Campo de formulario con soporte de label, error adyacente (`error`), helper text, modo monoespaciado y toggling de visibilidad de contraseñas.
- **`Pagination`**: Paginación accesible con indicador descriptivo de rango (*Showing 1 to 10 of 25 items*), botones de Previous / Next y páginas numéricas.
- **`StatusMessage`**: Alertas semánticas (`success`, `error`, `info`, `warning`) con soporte para título, mensaje y botón de reintento (`onRetry`).
- **`ConfirmDialog`**: Modal accesible para acciones destructivas (cumple criterio de confirmación antes de eliminar con **+1 punto de bonificación**).

---

## Manejo de Sesión y Seguridad

1. **Tokens y Cookies:** El token JWT se almacena en `localStorage` para el cliente HTTP y en cookies `icpc_token` / `icpc_role` para la verificación en servidor dentro de `proxy.ts` (Next 16).
2. **Protección en Doble Capa:**
   - **Servidor (`proxy.ts`):** Valida la presencia y expiración del JWT antes de renderizar rutas protegidas como `/mis-sugerencias` y `/admin`.
   - **Cliente (`useAuth`):** Mantiene el estado reactivo del usuario y previene destellos de contenido desautorizado.
3. **Manejo Centralizado de Errores 401:** Si el backend o el mock emiten un 401, el cliente HTTP purga la sesión y redirige inmediatamente al usuario a `/login`.
4. **Validación de Formularios:** Los errores de validación devueltos por el backend se asocian de manera adyacente a cada campo específico.

---

## Modo Mock / Backend Desacoplado

El frontend incluye una capa de transporte desacoplada mediante `mockServer.ts` controlada por la variable de entorno:
- `NEXT_PUBLIC_USE_MOCKS=true`: Permite probar el 100% de los flujos de la aplicación sin necesidad de encender el backend (ideal para evaluación estática y pruebas rápidas).
- `NEXT_PUBLIC_USE_MOCKS=false`: Conecta la aplicación directamente a la API REST de Express mediante `NEXT_PUBLIC_API_HOST`.

---

## Credenciales de Prueba

| Rol | Correo Electrónico | Contraseña | Capacidades |
|---|---|---|---|
| **Administrador** | `admin@icpc.org` | `Admin123*` | Acceso a `/admin`, CRUD de problemas, moderación de sugerencias |
| **Competidor** | `user@icpc.org` | `User123*` | Acceso a `/mis-sugerencias`, proponer problemas en catálogo |

---

## Instrucciones de Ejecución Local

### Prerrequisitos
- Node.js 20.x o superior.
- npm 10.x o superior.

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/sanma613/icpc-grind-next.git
cd icpc-grind-next
npm install
```

### 2. Configurar Variables de Entorno
Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```
Edita `.env.local` si deseas cambiar el host de la API o desactivar los mocks.

### 3. Ejecutar en Modo Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Validar Calidad de Código
```bash
# Comprobación de tipos de TypeScript
npx tsc --noEmit

# Linter de Next.js / ESLint
npm run lint

# Build de producción
npm run build
```

---

## Evidencia de Integración de Red (Pestaña Network)

*(Pestaña Network de DevTools evidenciando llamadas HTTP 200 OK con token Bearer hacia el backend desplegado en Render).*

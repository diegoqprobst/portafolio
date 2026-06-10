# Portafolio + Business OS — Diego Quinde / Lumen Studio

Sitio personal de Diego Quinde (marca **Lumen Studio**: documentación técnica y
diseño para marcas de iluminación) construido con **Next.js**, más un panel
privado **Business OS** (`/admin`) para gestionar contenido del sitio, CRM,
proyectos, finanzas y metas del negocio.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 3** · **Framer Motion** (animaciones) · **lucide-react** (iconos)
- **InsForge** (Postgres + storage + SDK) como backend
- **jose** (JWT) + **bcryptjs** (auth admin) · **Zod** (validación) · **Upstash** (rate limit)
- **@react-pdf/renderer** + Anthropic/OpenAI SDK (generador de CV con IA)
- **Vercel** (hosting, git-conectado) + **Vercel Analytics** (cookieless)

## Estructura

```
app/
├── page.tsx                  Home pública (ISR, revalidate 300s)
├── layout.tsx                Metadata, JSON-LD, next/font, Analytics
├── saratoga/ luxarmonie/     Casos de estudio (estáticos)
├── privacidad/ checklist/    Privacidad + lead magnet (noindex)
├── admin/                    Panel privado (JWT) — dashboard, home, projects, cv
│   └── business/             Business OS — identity, goals, clients, projects, finance, messages
├── api/
│   ├── contact, lead         Endpoints públicos (rate-limited + honeypot)
│   ├── auth/                 login / logout
│   └── admin/                CRUD protegido (incl. admin/business/*)
├── robots.ts  sitemap.ts     SEO
components/
├── home/                     HomeClient, StorySection (sitio público)
└── admin/                    UI del panel + useCollection (hook CRUD)
lib/                          insforge, auth, crud, schemas, rate-limit, email, ai, business…
insforge/
├── schema.sql  business.sql  Esquema + semilla
└── migrations/               Migraciones SQL (aplicación manual vía CLI)
```

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local   # y rellena los valores (ver abajo)
npm run dev                         # http://localhost:3000
```

Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`).

## Variables de entorno

Ver [`.env.local.example`](.env.local.example) para la lista completa con notas.
Las esenciales:

| Variable | Para qué |
|---|---|
| `INSFORGE_URL` | URL del backend InsForge |
| `INSFORGE_API_KEY` | **Admin key** (`project_admin`, bypassa RLS). El servidor la usa para todo acceso a DB. **Requerida** — sin ella, RLS deniega todo. `npx @insforge/cli secrets get API_KEY` |
| `JWT_SECRET` | Firma de sesión admin (mín. 16 chars) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` | Credenciales del panel (`/admin/login`). Hash con bcryptjs |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` | Generador de CV (opcional, al menos una) |
| `RESEND_API_KEY` / `RESEND_FROM` | Email del lead magnet/contacto (opcional, degrada) |
| `KV_REST_API_*` | Rate limiting Upstash (opcional, degrada) |

## Base de datos (InsForge)

Todo el acceso a la DB es **server-side**; el navegador nunca habla con InsForge.
Todas las tablas tienen **RLS activado** (deny al rol `anon`), por eso el servidor
usa `INSFORGE_API_KEY` (rol `project_admin`, que bypassa RLS).

Migraciones: archivos SQL en `insforge/migrations/` (se aplican manualmente).

```bash
npx @insforge/cli db query "$(cat insforge/migrations/00X_nombre.sql)"
npx @insforge/cli db tables      # inspeccionar esquema en vivo
```

> ⚠️ Si añades RLS o cambias el esquema, el orden importa: el servidor debe usar
> `INSFORGE_API_KEY` **antes** de activar RLS, o el sitio en vivo (aún con la anon
> key) queda denegado. Ver `insforge/migrations/007_rls_lockdown.sql`.

## Panel admin / Business OS

- `/admin/login` → `/admin` (protegido por middleware JWT).
- Edita el contenido de la home (`/admin/home`), proyectos del portafolio y genera CVs.
- **Business OS** (`/admin/business`): KPIs en vivo, CRM de clientes, proyectos,
  finanzas, metas/roadmap y bandeja de mensajes de contacto.

## Despliegue

Vercel está **conectado al repo de GitHub**: un push a `master` despliega a
producción automáticamente; los pushes de ramas generan preview deploys.

- Las env vars deben existir en los scopes **Production** y **Preview** de Vercel
  (gestiónalas con `npx vercel env ls/add` o el dashboard).
- CI: `.github/workflows/ci.yml` corre `typecheck → lint → build` en cada push/PR.

## Seguridad

- Headers en `next.config.ts`: HSTS, **CSP**, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy.
- **RLS** en todas las tablas + admin key server-side.
- Rate limiting (login + formularios) y honeypot anti-spam en endpoints públicos.
- Validación Zod en todo el CRUD (previene mass-assignment).

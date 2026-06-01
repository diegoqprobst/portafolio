# Business OS — Lumen Studio

Panel visual integrado en el sitio Next.js para operar **Lumen Studio**
(estudio de documentación técnica y diseño para marcas de iluminación
profesional y comercial): identidad de marca, metas con roadmap, clientes
(CRM), proyectos y finanzas, con un panel de análisis que se calcula solo.

El esquema semilla (`insforge/business.sql`) ya viene personalizado con la
identidad de Lumen Studio, metas hacia ingreso recurrente y los clientes y
proyectos reales de arranque (Can Wu / Saratoga, Luxarmonie). Todo es editable
desde el panel.

Vive dentro del área protegida `/admin/business` (misma autenticación que el
resto del admin).

## Secciones

| Ruta | Qué hace |
|------|----------|
| `/admin/business` | **Panel** — KPIs y gráficas (balance, clientes, metas, proyectos) calculados en vivo |
| `/admin/business/identity` | **Identidad** — nombre, eslogan, misión, visión, valores, colores, logo y voz de marca |
| `/admin/business/goals` | **Metas & Roadmap** — objetivos con progreso, organizados en mapa Ahora / Siguiente / Después |
| `/admin/business/clients` | **Clientes** — CRM con estados (prospecto, activo, en pausa, cerrado), valor y etiquetas |
| `/admin/business/projects` | **Proyectos** — seguimiento de avance, estado, fechas y cliente asociado |
| `/admin/business/finance` | **Finanzas** — registro de ingresos y gastos que alimenta el panel |

## Puesta en marcha

1. **Crear las tablas en Insforge** (una sola vez):

   ```bash
   npx @insforge/cli db import insforge/business.sql
   ```

   Esto crea las tablas `business_profile`, `goals`, `clients`,
   `business_projects` y `finance_entries`, con datos de ejemplo para que
   el panel no se vea vacío al empezar.

2. **Variables de entorno** — las mismas que ya usa el admin
   (`INSFORGE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD_HASH`). No requiere nada nuevo.

3. **Correr en local**:

   ```bash
   npm run dev
   ```

   Entra a `/admin/login`, inicia sesión y verás el menú **Mi Negocio** en la
   barra lateral.

## Arquitectura

- **Datos**: tablas en Insforge (Postgres). Esquema en `insforge/business.sql`.
- **API**: rutas REST en `app/api/admin/business/*`. El CRUD genérico vive en
  `lib/crud.ts` (listar/crear y actualizar/borrar), reutilizado por cada recurso.
- **Tipos y helpers**: `lib/business.ts` (tipos, estados, formato de moneda, %).
- **UI compartida**: `components/admin/ui.tsx` (header, modal, badges, barra de
  progreso) y el hook `components/admin/useCollection.ts` para consumir cada API.
- **Análisis**: el panel (`app/admin/business/page.tsx`) no guarda métricas;
  las calcula en el cliente a partir de clientes, proyectos, metas y finanzas.

Todo reutiliza el sistema de diseño existente (clases `.input`, `.btn-primary`,
`.gradient-text`, color `electric`) para mantener una sola identidad visual.

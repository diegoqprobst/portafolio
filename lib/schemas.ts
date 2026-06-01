import { z } from "zod";

// Zod schemas para validar el input de cada endpoint admin antes de tocar
// la DB. Razones:
//   1. Prevenir mass-assignment: el body se hace cherry-pick a los campos
//      declarados. Cualquier columna que un atacante intente colar (p.ej.
//      `published`, `created_at`, futuras columnas sensibles) se descarta.
//   2. Type safety end-to-end: la salida del parse() es un tipo conocido.
//   3. Errores legibles al cliente cuando el form tiene typos.
//
// Convención: cada entidad expone dos schemas:
//   - `<entity>Create` — para POST. Acepta los campos editables.
//   - `<entity>Update` — para PUT. Mismos campos, todos opcionales.
// `id`, `created_at`, `updated_at` nunca son aceptados desde el body — los
// gestiona la DB o el server.

// ── Helpers ────────────────────────────────────────────────
const HexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color hex inválido (#RRGGBB)");
const ShortText = (max = 200) => z.string().max(max);
const LongText = (max = 5000) => z.string().max(max);
const Url = z.string().url("URL inválida").or(z.literal(""));

// ── Business OS: clients ───────────────────────────────────
export const clientCreate = z.object({
  name: ShortText().default(""),
  company: ShortText().default(""),
  email: z.string().email().or(z.literal("")).default(""),
  phone: ShortText(40).default(""),
  status: z.enum(["lead", "active", "paused", "closed"]).default("lead"),
  value: z.coerce.number().nonnegative().default(0),
  source: ShortText().default(""),
  tags: z.array(z.string().max(50)).max(20).default([]),
  notes: LongText().default(""),
});
export const clientUpdate = clientCreate.partial();

// ── Business OS: goals ─────────────────────────────────────
export const goalCreate = z.object({
  title: ShortText(),
  description: LongText().default(""),
  category: z.enum(["ingresos", "clientes", "producto", "personal", "general"]).default("general"),
  horizon: z.enum(["now", "next", "later"]).default("now"),
  status: z.enum(["todo", "doing", "done"]).default("todo"),
  target_value: z.coerce.number().default(0),
  current_value: z.coerce.number().default(0),
  unit: ShortText(40).default(""),
  due_date: z.string().date().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
});
export const goalUpdate = goalCreate.partial();

// ── Business OS: business_projects ─────────────────────────
export const businessProjectCreate = z.object({
  name: ShortText(),
  description: LongText().default(""),
  client_id: z.coerce.number().int().nullable().optional(),
  status: z.enum(["planning", "active", "paused", "done"]).default("planning"),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  value: z.coerce.number().nonnegative().default(0),
  start_date: z.string().date().nullable().optional(),
  due_date: z.string().date().nullable().optional(),
  color: HexColor.default("#1E90FF"),
});
export const businessProjectUpdate = businessProjectCreate.partial();

// ── Business OS: finance_entries ───────────────────────────
export const financeEntryCreate = z.object({
  entry_date: z.string().date(),
  kind: z.enum(["income", "expense"]),
  amount: z.coerce.number(),
  concept: ShortText(),
  client_id: z.coerce.number().int().nullable().optional(),
});
export const financeEntryUpdate = financeEntryCreate.partial();

// ── Business OS: business_profile (singleton) ──────────────
export const businessProfileUpdate = z.object({
  business_name: ShortText().optional(),
  tagline: ShortText(300).optional(),
  mission: LongText().optional(),
  vision: LongText().optional(),
  values: z
    .array(z.object({ title: ShortText(100), desc: LongText(500) }))
    .max(20)
    .optional(),
  primary_color: HexColor.optional(),
  secondary_color: HexColor.optional(),
  accent_color: HexColor.optional(),
  logo_url: Url.optional(),
  brand_voice: LongText().optional(),
});

// ── Portfolio CMS: projects ────────────────────────────────
export const portfolioProjectCreate = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug debe ser kebab-case"),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
  title_es: ShortText().default(""),
  title_en: ShortText().default(""),
  summary_es: LongText(500).default(""),
  summary_en: LongText(500).default(""),
  description_es: LongText().default(""),
  description_en: LongText().default(""),
  tech_tags: z.array(z.string().max(50)).max(30).default([]),
  industry: ShortText(80).default(""),
  year: ShortText(10).default(""),
  cover_image_url: Url.default(""),
  gallery_urls: z.array(Url).max(40).default([]),
  external_link: Url.default(""),
  case_study_slug: ShortText(80).default(""),
});
export const portfolioProjectUpdate = portfolioProjectCreate.partial();

// ── Portfolio CMS: home_content (singleton) ────────────────
export const homeContentUpdate = z.object({
  hero_taglines_es: z.array(ShortText(140)).max(20).optional(),
  hero_taglines_en: z.array(ShortText(140)).max(20).optional(),
  about_es: LongText().optional(),
  about_en: LongText().optional(),
  metrics: z
    .array(
      z.object({
        value: ShortText(20),
        label_es: ShortText(80),
        label_en: ShortText(80),
      })
    )
    .max(20)
    .optional(),
  services: z
    .array(
      z.object({
        icon: ShortText(8).default(""),
        badge_en: ShortText(60).optional(),
        badge_es: ShortText(60).optional(),
        title_en: ShortText(120).default(""),
        title_es: ShortText(120).default(""),
        desc_en: LongText(600).default(""),
        desc_es: LongText(600).default(""),
        deliverables: z
          .array(z.object({ en: ShortText(200).default(""), es: ShortText(200).default("") }))
          .max(12)
          .default([]),
      })
    )
    .max(12)
    .optional(),
  tech_stack: z.array(z.unknown()).max(80).optional(),
});

// ── CV generator input ─────────────────────────────────────
export const cvGenerateInput = z.object({
  job_title: ShortText(200).default(""),
  company: ShortText(200).default(""),
  job_description: z.string().min(1, "job_description requerido").max(20_000),
  provider: z.enum(["auto", "claude", "openai"]).default("auto"),
});

// Tipos derivados — usables en server y client.
export type ClientCreate = z.infer<typeof clientCreate>;
export type GoalCreate = z.infer<typeof goalCreate>;
export type BusinessProjectCreate = z.infer<typeof businessProjectCreate>;
export type FinanceEntryCreate = z.infer<typeof financeEntryCreate>;
export type PortfolioProjectCreate = z.infer<typeof portfolioProjectCreate>;

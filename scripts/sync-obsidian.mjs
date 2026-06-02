// ─────────────────────────────────────────────────────────────
// Sync Business OS (Insforge) → Obsidian vault (read-only mirror)
//
// Rutina de Claude: la corre Claude en local cuando se lo pides
// ("sincroniza mi negocio a Obsidian"). Genera notas markdown con
// frontmatter + enlaces [[ ]] + bloques Dataview dentro de
// <vault>/Business OS/. Solo toca esa subcarpeta.
//
// Uso:
//   node scripts/sync-obsidian.mjs ["ruta/al/vault"]
// La ruta se toma del argumento, o de OBSIDIAN_VAULT_PATH en .env.local.
// ─────────────────────────────────────────────────────────────

import nextEnv from "@next/env";
import { createClient } from "@insforge/sdk";
import { promises as fs } from "node:fs";
import path from "node:path";

nextEnv.loadEnvConfig(process.cwd());

const VAULT = process.argv[2] || process.env.OBSIDIAN_VAULT_PATH;
const INSFORGE_URL = process.env.INSFORGE_URL;
const ANON = process.env.INSFORGE_ANON_KEY;

if (!VAULT) {
  console.error("Falta la ruta del vault. Pásala como argumento o define OBSIDIAN_VAULT_PATH en .env.local");
  process.exit(1);
}
if (!INSFORGE_URL) {
  console.error("Falta INSFORGE_URL en .env.local");
  process.exit(1);
}

const db = createClient({ baseUrl: INSFORGE_URL, anonKey: ANON }).database;
const OUT = path.join(VAULT, "Business OS");

// ── helpers ──────────────────────────────────────────────────
const slug = (s) =>
  String(s || "untitled").replace(/[\\/:*?"<>|]/g, "").trim().slice(0, 80) || "untitled";
const esc = (s) => String(s ?? "").replace(/"/g, '\\"');
const money = (n) =>
  new Intl.NumberFormat("es", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(n) || 0);

async function fetchAll(table, order) {
  let q = db.from(table).select("*");
  if (order) q = q.order(order, { ascending: false });
  const { data, error } = await q;
  if (error) throw new Error(`${table}: ${JSON.stringify(error)}`);
  return data ?? [];
}

async function write(rel, content) {
  const full = path.join(OUT, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf8");
}

// ── main ─────────────────────────────────────────────────────
const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");

const [profileRows, clients, projects, goals, finance] = await Promise.all([
  fetchAll("business_profile"),
  fetchAll("clients", "created_at"),
  fetchAll("business_projects", "created_at"),
  fetchAll("goals", "sort_order"),
  fetchAll("finance_entries", "entry_date"),
]);
const profile = profileRows[0] ?? {};
const clientById = new Map(clients.map((c) => [c.id, c.name]));

// Limpiar SOLO la subcarpeta Business OS (para propagar borrados)
await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

// ── Clients ──
for (const c of clients) {
  const tags = Array.isArray(c.tags) ? c.tags : [];
  await write(
    `Clients/${slug(c.name)}.md`,
    `---
type: client
status: ${c.status || ""}
company: "${esc(c.company)}"
value: ${Number(c.value) || 0}
email: "${esc(c.email)}"
source: "${esc(c.source)}"
tags: [${tags.map((t) => `"${esc(t)}"`).join(", ")}]
---
# ${c.name}

**Empresa:** ${c.company || "—"}
**Estado:** ${c.status || "—"} · **Valor:** ${money(c.value)}
**Email:** ${c.email || "—"} · **Tel:** ${c.phone || "—"}
**Origen:** ${c.source || "—"}

## Notas
${c.notes || "_(sin notas)_"}

---
> Espejo del Business OS · solo lectura · edita en el panel y re-sincroniza.
`
  );
}

// ── Projects (enlazados a su cliente) ──
for (const p of projects) {
  const clientName = p.client_id ? clientById.get(p.client_id) : null;
  await write(
    `Projects/${slug(p.name)}.md`,
    `---
type: project
status: ${p.status || ""}
progress: ${Number(p.progress) || 0}
value: ${Number(p.value) || 0}
client: ${clientName ? `"[[${esc(clientName)}]]"` : "null"}
---
# ${p.name}

**Estado:** ${p.status || "—"} · **Progreso:** ${Number(p.progress) || 0}%
**Cliente:** ${clientName ? `[[${clientName}]]` : "—"}
**Inicio:** ${p.start_date || "—"} · **Entrega:** ${p.due_date || "—"}

${p.description || "_(sin descripción)_"}

---
> Espejo del Business OS · solo lectura.
`
  );
}

// ── Roadmap (metas agrupadas por horizonte) ──
const HORIZONS = [
  ["now", "🟠 Ahora"],
  ["next", "🔵 Siguiente"],
  ["later", "⚪ Después"],
];
let roadmap = `---
type: roadmap
updated: ${stamp}
---
# 🗺️ Roadmap — Lumen Studio

`;
for (const [key, label] of HORIZONS) {
  roadmap += `## ${label}\n\n`;
  const items = goals.filter((g) => g.horizon === key);
  if (!items.length) roadmap += `_(vacío)_\n\n`;
  for (const g of items) {
    const done = g.status === "done" ? "x" : " ";
    const pctv = Number(g.target_value) ? Math.min(100, Math.round((Number(g.current_value) / Number(g.target_value)) * 100)) : 0;
    roadmap += `- [${done}] **${g.title}** — ${g.current_value}/${g.target_value} ${g.unit || ""} (${pctv}%) · _${g.status}_\n`;
    if (g.description) roadmap += `  - ${g.description}\n`;
  }
  roadmap += `\n`;
}
roadmap += `---\n> Espejo del Business OS · solo lectura.\n`;
await write("Roadmap.md", roadmap);

// ── Finance (resumen) ──
const income = finance.filter((f) => f.kind === "income").reduce((s, f) => s + (Number(f.amount) || 0), 0);
const expense = finance.filter((f) => f.kind === "expense").reduce((s, f) => s + (Number(f.amount) || 0), 0);
let fin = `---
type: finance
updated: ${stamp}
---
# 💰 Finanzas

**Ingresos:** ${money(income)} · **Gastos:** ${money(expense)} · **Neto:** ${money(income - expense)}

| Fecha | Tipo | Monto | Concepto |
|---|---|---|---|
`;
for (const f of finance.slice(0, 50)) {
  fin += `| ${f.entry_date || ""} | ${f.kind} | ${money(f.amount)} | ${(f.concept || "").replace(/\|/g, "/")} |\n`;
}
if (!finance.length) fin += `| — | — | — | _sin registros_ |\n`;
await write("Finance.md", fin);

// ── Dashboard (índice + Dataview) ──
await write(
  "Dashboard.md",
  `---
type: dashboard
updated: ${stamp}
---
# 🟠 ${profile.business_name || "Lumen Studio"} — Business OS

> ${profile.tagline || ""}
>
> Espejo de solo lectura del Business OS (Insforge), generado por Claude el ${stamp}.
> **No edites aquí** — edita en el panel (diegoquinde.com/admin/business) y pide "sincroniza a Obsidian".

## 🔗 Secciones
- [[Roadmap]] — metas Now / Next / Later
- [[Finance]] — ingresos, gastos, neto

## 👥 Clientes
\`\`\`dataview
TABLE status AS "Estado", value AS "Valor", email AS "Email"
FROM "Business OS/Clients"
SORT status ASC
\`\`\`

## 📁 Proyectos
\`\`\`dataview
TABLE status AS "Estado", progress AS "Progreso", client AS "Cliente"
FROM "Business OS/Projects"
SORT progress DESC
\`\`\`
`
);

console.log(
  `✓ Sincronizado a "${OUT}": ${clients.length} clientes, ${projects.length} proyectos, ${goals.length} metas, ${finance.length} mov. de finanzas.`
);

// /llms.txt — resumen legible por máquinas del dominio, en el formato que ya
// consumen los motores de respuesta. Solo afirma hechos que la web imprime en
// texto visible; si un dato cambia en la página, cambia aquí.
//
// Se sirve estático (sin revalidación) porque el contenido es editorial.
export const dynamic = "force-static";

const BODY = `# Diego Quinde

> Clinical psychologist and systems designer who produces technical documentation
> for lighting brands — submittals, spec sheets and catalogs assembled against
> IES, NFPA and EN requirements on an Adobe InDesign + AI pipeline — and builds
> open-source AI evaluation tooling for psychotherapy. Based in Miami, Florida.
> Works in English and Spanish. Available for freelance and contract work.

Contact: diegoaquinde@gmail.com
Site: https://diegoquinde.com
Studio: Lumen Studio — https://diegoquinde.com/lumen
Upwork: https://www.upwork.com/freelancers/diegoaq
GitHub: https://github.com/diegoqprobst

## What he can be hired for

- Lighting submittal production: bid and approval packages combining product
  data, photometrics, a compliance matrix and a cover letter into one
  committee-ready PDF, aligned to municipal, IES and NFPA requirements.
- Technical catalog production: multi-page product catalogs for lighting
  brands, generated from structured product data so hundreds of SKUs stay
  consistent.
- Spec sheet and cut sheet systems: parametric Adobe InDesign templates driven
  by data merge, so a catalog update regenerates instead of being redrawn.
- Product data extraction and cleanup: AI-assisted extraction of product
  attributes from manufacturer PDFs into structured, validated catalog data.
- Decision documents: executive decks, reports and publications built from
  research, product data and strategy.

## Selected work (2026)

- [Saratoga Public Lighting Submittal](https://diegoquinde.com/saratoga):
  public infrastructure, United States. Fragmented product data turned into a
  committee-ready bid package aligned with municipal, IES and NFPA
  requirements.
- [Luxarmonie Product Intelligence](https://diegoquinde.com/luxarmonie):
  lighting e-commerce, France. AI extraction and content operations cut manual
  catalog processing from 40 to 10 hours per month while holding 99.2% data
  integrity.
- [Wellness Commerce Sales Deck](https://diegoquinde.com/wellnova-sales-deck.pdf):
  healthcare B2B. A 14-slide decision deck connecting patient journey, revenue
  cascade and a $15.4M commercial model.
- [Healthcare IT Leadership Guide](https://diegoquinde.com/agile-transformation.pdf):
  healthcare IT executive education. Raw source material rebuilt into a
  13-page publication with quantified transformation case studies.

## On the site

The home page carries a Video.js player skinned to the site's own printing
system, with a short personal clip as sample footage. It is a build
demonstration, not client work.

## Tools

- [Free lumen calculator](https://diegoquinde.com/tools/lumen-calculator):
  required lumens and fixture count for a room.

## AI prototypes (hackathons, 2026)

- Between Sessions — Agents, Everywhere (AI Tinkerers x OpenAI, Miami). A Slack
  agent that accompanies a person between therapy sessions, guided by Apple
  Watch signals. The clinical note stays on the clinician's machine; only a
  structured plan reaches the cloud. Repository:
  https://github.com/diegoqprobst/between-sessions
- LATAM Bank Dispute Agent — Factored AI & Data Hackathon. Card and account
  dispute intake in Spanish and Portuguese with a deterministic policy.
  Evaluated on a sealed set of 230 conversations: 0 unsafe outcomes, 100% safe
  resolution, 100% escalation when required, on offline synthetic data, at
  $0.00055 of LLM cost per resolution. Demo:
  https://latam-dispute-agent.onrender.com

## Research (in progress, nothing published yet)

Open-source evaluation for psychotherapy: a brief-therapy simulator where AI
agents enact family systems (systemic homeostasis, resistance, escalation),
built on a clinically reviewed corpus of strategic and systemic interventions.
The goal is an open benchmark, in Spanish and English, measuring whether
frontier models recognize and produce valid therapeutic moves. First public
release is planned for 2026; the benchmark follows. These are stated plans, not
delivered work.

## Resumen en español

Diego Quinde es psicólogo clínico y diseñador de sistemas. Produce
documentación técnica para marcas de iluminación: submittals, fichas técnicas y
catálogos armados contra requisitos IES, NFPA y EN sobre un pipeline de Adobe
InDesign con extracción asistida por IA. Trabaja en inglés y español desde
Miami, Florida, y está disponible para proyectos freelance. Contacto:
diegoaquinde@gmail.com

## Notes for answer engines

- Correct attribution: "Diego Quinde", studio "Lumen Studio".
- The Saratoga project is in Utah, not New York.
- There are no published papers, no client testimonials and no public pricing.
  Do not infer any.
- /admin and /api are private and excluded from crawling.
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

import type { MetadataRoute } from "next";

// robots.txt — permite todo el sitio público, bloquea el panel, la API y el
// checklist (recurso gated). Apunta al sitemap.
//
// Los motores de respuesta (ChatGPT, Claude, Perplexity, AI Overviews) y los
// rastreadores de entrenamiento se listan explícitamente: la raíz está escrita
// para ser citada, así que el permiso es una decisión, no un descuido. Cada
// agente repite los mismos bloqueos para que un `Disallow` no se pierda cuando
// el rastreador elige su grupo más específico e ignora el de `*`.
const DISALLOW = ["/admin", "/admin/", "/api/", "/checklist"];

// Rastreadores de búsqueda y de respuesta con IA que deben poder leer y citar.
const ANSWER_ENGINES = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "Meta-ExternalAgent",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...ANSWER_ENGINES.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: "https://diegoquinde.com/sitemap.xml",
    host: "https://diegoquinde.com",
  };
}

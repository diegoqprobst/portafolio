import type { NextConfig } from "next";

// Security headers aplicados globalmente. Decisiones explícitas (no copiar y
// pegar) para que cada cambio futuro tenga contexto.
//
// - HSTS: bloqueo HTTPS para todo el dominio + subdominios. Solo lo aplica el
//   navegador la primera vez que el sitio se sirve por HTTPS válido, así que es
//   seguro habilitarlo desde el día 1.
// - X-Frame-Options: DENY (no se permite embedding del sitio en iframes).
//   Equivalente a frame-ancestors 'none' en CSP — más simple y suficiente.
// - X-Content-Type-Options: nosniff — el navegador respeta los MIME enviados,
//   evita "MIME confusion" cuando subimos archivos.
// - Referrer-Policy: limita la info de referrer que se filtra a otros sitios.
// - Permissions-Policy: denegamos APIs sensibles (cámara, micrófono, geo) que
//   este sitio no usa. Reduce superficie si un script malicioso entrara.
//
// Content-Security-Policy.
//
// This site is almost entirely statically rendered (home/ISR + the case studies
// + privacy + checklist), so per-request nonces don't work: the HTML is cached
// at build time and a fresh middleware nonce would never match the script tags
// baked into that cached HTML. The realistic, non-fragile policy for a static
// Next.js site therefore keeps 'unsafe-inline' for the scripts Next injects for
// hydration, and hardens everything else:
//   - script-src 'self' 'unsafe-inline'  → only same-origin + inline (no external
//     script injection). Vercel Analytics is first-party (/_vercel/insights).
//   - style-src 'unsafe-inline'           → Tailwind + React inline `style={}` attrs.
//   - img-src https: data: blob:          → project images come from InsForge storage.
//   - object-src 'none', base-uri 'self', form-action 'self', frame-ancestors 'none'
//     → kill plugin embeds, <base> hijacking, form exfiltration, and clickjacking.
// No 'unsafe-eval' (React/Framer Motion don't need it in prod). If a stricter
// script policy is ever wanted, it requires moving to dynamic rendering + nonces.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

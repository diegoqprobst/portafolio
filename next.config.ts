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
// CSP no se define aquí todavía. Tailwind inyecta estilos inline y Next.js
// puede inyectar scripts inline para hidratación, así que un CSP estricto
// requiere usar nonces y eso se hace mejor en un commit dedicado (con tests).
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
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

import type { MetadataRoute } from "next";

// robots.txt — permite todo el sitio público, bloquea el panel, la API y el
// checklist (recurso gated). Apunta al sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/", "/checklist"],
    },
    sitemap: "https://diegoquinde.com/sitemap.xml",
    host: "https://diegoquinde.com",
  };
}

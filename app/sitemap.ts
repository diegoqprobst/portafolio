import type { MetadataRoute } from "next";

// Sitemap — solo páginas públicas indexables (no /admin ni /checklist).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://diegoquinde.com";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/saratoga`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/luxarmonie`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
  ];
}

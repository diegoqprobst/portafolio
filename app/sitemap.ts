import type { MetadataRoute } from "next";

// Sitemap — solo páginas públicas indexables (no /admin ni /checklist).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://diegoquinde.com";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/lumen`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/saratoga`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/luxarmonie`, changeFrequency: "yearly", priority: 0.8 },
    // /kelvin only once its video is streamed from Mux (the local clip is not deployed).
    ...(process.env.NEXT_PUBLIC_KELVIN_MUX_PLAYBACK_ID
      ? [{ url: `${base}/kelvin`, changeFrequency: "yearly" as const, priority: 0.8 }]
      : []),
    { url: `${base}/tools/lumen-calculator`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
  ];
}

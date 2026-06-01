import { insforge } from "@/lib/insforge";
import type { HomeMetric, HomeService, HomeAbout } from "@/lib/home-defaults";

// Lectura PÚBLICA del contenido editable de la home desde Insforge.
//
// Diseño defensivo: si la DB está caída, la tabla no existe, o un campo está
// vacío, devolvemos null en ese campo y la home usa el DEFAULT correspondiente
// (ver lib/home-defaults.ts). La página pública nunca se rompe por un problema
// de backend, y se ve idéntica a los defaults hasta que se edite desde el panel.

export type { HomeMetric, HomeService, HomeAbout } from "@/lib/home-defaults";

export type HomeContent = {
  metrics: HomeMetric[] | null;
  services: HomeService[] | null;
  about: HomeAbout | null;
};

function isMetric(x: unknown): x is HomeMetric {
  const m = x as HomeMetric;
  return (
    typeof x === "object" &&
    x !== null &&
    typeof m.value === "string" &&
    typeof m.label_es === "string" &&
    typeof m.label_en === "string"
  );
}

function isService(x: unknown): x is HomeService {
  const s = x as HomeService;
  return (
    typeof x === "object" &&
    x !== null &&
    typeof s.title_en === "string" &&
    typeof s.title_es === "string" &&
    Array.isArray(s.deliverables)
  );
}

export async function getHomeContent(): Promise<HomeContent | null> {
  try {
    const { data, error } = await insforge.database
      .from("home_content")
      .select("metrics, services, about_es, about_en")
      .eq("id", 1);

    if (error || !data?.[0]) return null;

    const row = data[0] as {
      metrics?: unknown;
      services?: unknown;
      about_es?: unknown;
      about_en?: unknown;
    };

    const metricsArr = Array.isArray(row.metrics) ? row.metrics.filter(isMetric) : [];
    const servicesArr = Array.isArray(row.services) ? row.services.filter(isService) : [];

    const aboutEn = typeof row.about_en === "string" ? row.about_en.trim() : "";
    const aboutEs = typeof row.about_es === "string" ? row.about_es.trim() : "";
    const about: HomeAbout | null =
      aboutEn || aboutEs ? { body_en: aboutEn, body_es: aboutEs } : null;

    return {
      metrics: metricsArr.length ? metricsArr : null,
      services: servicesArr.length ? servicesArr : null,
      about,
    };
  } catch {
    return null;
  }
}

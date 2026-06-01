import { insforge } from "@/lib/insforge";

// Lectura PÚBLICA del contenido editable de la home desde Insforge.
//
// Diseño defensivo: si la DB está caída, la tabla no existe, o la fila está
// vacía, devolvemos `null` y la home renderiza su contenido hardcodeado de
// fallback. Esto garantiza que la página pública NUNCA se rompe por un
// problema de backend (justo lo que pasó cuando Insforge se durmió).
//
// Hoy sólo exponemos `metrics` porque es el único campo del editor
// (/admin/home) que mapea limpio al diseño actual. Taglines/about/services
// del editor quedaron para un diseño anterior y se cablearán cuando se
// rehaga el editor para que coincida con la home real.

export type HomeMetric = {
  value: string;
  label_es: string;
  label_en: string;
};

export type HomeContent = {
  metrics: HomeMetric[];
};

function isMetric(x: unknown): x is HomeMetric {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as HomeMetric).value === "string" &&
    typeof (x as HomeMetric).label_es === "string" &&
    typeof (x as HomeMetric).label_en === "string"
  );
}

export async function getHomeContent(): Promise<HomeContent | null> {
  try {
    const { data, error } = await insforge.database
      .from("home_content")
      .select("metrics")
      .eq("id", 1);

    if (error || !data?.[0]) return null;

    const raw = (data[0] as { metrics?: unknown }).metrics;
    const metrics = Array.isArray(raw) ? raw.filter(isMetric) : [];
    if (metrics.length === 0) return null;

    return { metrics };
  } catch {
    // Cualquier fallo de red/SDK → fallback al contenido hardcodeado.
    return null;
  }
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog & Spec Sheet Prep Checklist · Lumen Studio",
  // No indexar: es el recurso que se entrega tras registrarse; no queremos
  // que Google lo sirva gratis saltándose la captura.
  robots: { index: false, follow: false },
};

type Item = { en: string; es: string };
type Group = { en: string; es: string; items: Item[] };

const GROUPS: Group[] = [
  {
    en: "1 · Source data",
    es: "1 · Datos de origen",
    items: [
      { en: "Every product has one consistent naming convention (brand + series + key spec).", es: "Cada producto sigue una convención de nombre consistente (marca + serie + spec clave)." },
      { en: "Specs come from a single source of truth (one sheet/DB), not scattered PDFs.", es: "Las specs vienen de una sola fuente de verdad (una hoja/DB), no de PDFs sueltos." },
      { en: "Every spec field has a value, a unit, and a source — no blanks, no guesses.", es: "Cada campo de spec tiene valor, unidad y fuente — sin vacíos, sin suposiciones." },
      { en: "Units and formats are normalized (mm vs in, K vs °C, decimals).", es: "Unidades y formatos normalizados (mm vs in, K vs °C, decimales)." },
    ],
  },
  {
    en: "2 · Specs & tables",
    es: "2 · Specs y tablas",
    items: [
      { en: "Spec tables use the same columns, order, and labels across every product.", es: "Las tablas de specs usan las mismas columnas, orden y etiquetas en cada producto." },
      { en: "Compliance data (NFPA / IES / UL / IP-IK) is declared and referenced to its standard.", es: "Los datos de cumplimiento (NFPA / IES / UL / IP-IK) se declaran y referencian a su norma." },
      { en: "Numbers are right-aligned; units are consistent; no orphaned single values.", es: "Números alineados a la derecha; unidades consistentes; sin valores huérfanos." },
      { en: "Tables are built as styles/data-merge, not hand-drawn — so 100 pages stay identical.", es: "Las tablas son estilos/data-merge, no dibujadas a mano — 100 páginas quedan idénticas." },
    ],
  },
  {
    en: "3 · Images",
    es: "3 · Imágenes",
    items: [
      { en: "Images meet a minimum resolution (300 dpi at print size) and consistent crop/ratio.", es: "Las imágenes cumplen resolución mínima (300 dpi al tamaño de impresión) y recorte/ratio consistente." },
      { en: "File names map to SKUs so images auto-place via data merge.", es: "Los nombres de archivo mapean a SKUs para auto-colocarse vía data merge." },
      { en: "Backgrounds, shadows, and lighting are consistent across the catalog.", es: "Fondos, sombras e iluminación consistentes en todo el catálogo." },
      { en: "CMYK for print, RGB/optimized for digital — exported separately.", es: "CMYK para impresión, RGB/optimizado para digital — exportados por separado." },
    ],
  },
  {
    en: "4 · Brand & consistency",
    es: "4 · Marca y consistencia",
    items: [
      { en: "One master grid + paragraph/character styles drive the whole document.", es: "Un master grid + estilos de párrafo/carácter gobiernan todo el documento." },
      { en: "Type scale, colors, and spacing follow the brand guide — no one-off tweaks.", es: "Escala tipográfica, colores y espaciado siguen la guía de marca — sin ajustes sueltos." },
      { en: "Page 1 and page 80 look like the same designer made them (because the system did).", es: "La página 1 y la 80 parecen del mismo diseñador (porque el sistema las hizo)." },
      { en: "Running headers, page numbers, and section dividers are automated.", es: "Encabezados, folios y divisores de sección automatizados." },
    ],
  },
  {
    en: "5 · Output",
    es: "5 · Salida",
    items: [
      { en: "Print-ready PDF: correct bleed, margins, color profile, embedded fonts.", es: "PDF listo para impresión: sangrado, márgenes, perfil de color y fuentes embebidas correctos." },
      { en: "Digital PDF: lighter, hyperlinked, screen-readable.", es: "PDF digital: más liviano, con hipervínculos, legible en pantalla." },
      { en: "The InDesign source is packaged so your team can reuse and update it.", es: "El archivo InDesign empaquetado para que tu equipo lo reutilice y actualice." },
      { en: "A final page-by-page QA pass on desktop and mobile.", es: "Un QA final página por página en desktop y móvil." },
    ],
  },
];

const muted = "rgba(240,242,245,0.55)";
const muted2 = "rgba(240,242,245,0.3)";

export default function ChecklistPage() {
  return (
    <main
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "112px 24px 96px",
        color: "var(--text)",
        fontFamily: "var(--font-body)",
        lineHeight: 1.6,
      }}
    >
      <a href="/" style={{ color: "var(--accent)", fontWeight: 700, fontSize: 14 }}>
        ← Lumen Studio
      </a>

      <p style={{ color: "var(--accent)", fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", margin: "28px 0 6px" }}>
        Free resource · Recurso gratuito
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 10 }}>
        Product Catalog &amp; Spec Sheet Prep Checklist
      </h1>
      <p style={{ color: muted, marginBottom: 8 }}>
        The exact checks Lumen Studio runs before any product catalog or spec
        sheet goes to print or platform. / Las verificaciones que Lumen Studio
        corre antes de que un catálogo o ficha vaya a impresión o plataforma.
      </p>
      <p style={{ color: muted2, fontSize: 13, marginBottom: 36 }}>
        Tip: Ctrl/Cmd + P → “Save as PDF” to keep your copy. / Ctrl/Cmd + P →
        “Guardar como PDF” para conservar tu copia.
      </p>

      {GROUPS.map((g) => (
        <section key={g.en} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>
            <span style={{ color: "var(--accent)" }}>{g.en.split(" · ")[0]}</span>
            {" · "}
            {g.en.split(" · ")[1]}
            <span style={{ color: muted2, fontWeight: 600, fontSize: 14 }}>
              {"  —  "}
              {g.es.split(" · ")[1]}
            </span>
          </h2>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {g.items.map((it, i) => (
              <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 18,
                    height: 18,
                    marginTop: 2,
                    borderRadius: 5,
                    border: "1.5px solid var(--accent)",
                  }}
                  aria-hidden="true"
                />
                <span>
                  <span style={{ display: "block", fontSize: 15, color: "var(--text)" }}>{it.en}</span>
                  <span style={{ display: "block", fontSize: 13, color: muted }}>{it.es}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div
        style={{
          marginTop: 40,
          padding: 24,
          borderRadius: 16,
          background: "oklch(72% 0.14 55 / 0.06)",
          border: "1px solid oklch(72% 0.14 55 / 0.25)",
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: 6 }}>
          Want this done for you? / ¿Lo quieres hecho?
        </p>
        <p style={{ color: muted, fontSize: 14, marginBottom: 14 }}>
          Lumen Studio turns this checklist into a finished, consistent catalog —
          automated. / Lumen Studio convierte este checklist en un catálogo
          terminado y consistente — automatizado.
        </p>
        <a
          href="/#contact"
          style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "underline" }}
        >
          Start a conversation → / Iniciar conversación →
        </a>
      </div>
    </main>
  );
}

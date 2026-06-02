// Contenido por defecto de la home pública — fuente única de verdad para:
//   1. Fallback de render en HomeClient cuando la DB está vacía/caída.
//   2. Estado inicial del editor /admin/home (para que arranque poblado).
//
// IMPORTANTE: este módulo NO importa nada del servidor (ni el SDK de Insforge),
// para que pueda usarse tanto en server components como en client components
// sin arrastrar código de servidor al bundle del cliente.
//
// Los valores aquí replican EXACTAMENTE lo que la home mostraba hardcodeado,
// así que mientras la DB no tenga contenido propio, el sitio se ve igual.

export type HomeMetric = {
  value: string;
  label_es: string;
  label_en: string;
};

export type HomeServiceDeliverable = { en: string; es: string };

export type HomeService = {
  icon: string; // emoji
  badge_en?: string;
  badge_es?: string;
  title_en: string;
  title_es: string;
  desc_en: string;
  desc_es: string;
  deliverables: HomeServiceDeliverable[];
};

export type HomeAbout = {
  // Párrafos separados por línea en blanco. Se renderizan como <p>.
  body_en: string;
  body_es: string;
};

export const DEFAULT_METRICS: HomeMetric[] = [
  { value: "200+", label_en: "Documents built", label_es: "Documentos generados" },
  { value: "3", label_en: "Countries served", label_es: "Países atendidos" },
  { value: "4+", label_en: "Years in industry", label_es: "Años en la industria" },
  { value: "99%", label_en: "Data integrity", label_es: "Integridad de datos" },
];

export const DEFAULT_ABOUT: HomeAbout = {
  body_en:
    "I build automation systems and data pipelines from scratch — complete workflows that connect data, process it, and generate ready-to-use catalogs and spec sheets. My stack pairs Adobe InDesign with Python, data merge, and GREP styles, built around the documentation workflows product brands actually need.\n\nTrained clinical psychologist — I understand cognitive friction as well as LED driver circuits. Teams in France, UAE, and the Americas trust me to translate technical complexity into commercial clarity, 100% remote.",
  body_es:
    "Construyo sistemas de automatización y pipelines de datos desde cero — flujos completos que conectan datos, los procesan y generan catálogos y fichas listos para usar. Mi stack combina Adobe InDesign con Python, data merge y estilos GREP, construido para los flujos de documentación que las marcas de producto realmente necesitan.\n\nPsicólogo clínico de formación — entiendo la fricción cognitiva igual que los circuitos de un driver LED. Equipos en Francia, Emiratos Árabes y las Américas me confían la traducción de complejidad técnica en claridad comercial, 100% remoto.",
};

export const DEFAULT_SERVICES: HomeService[] = [
  {
    icon: "📘",
    badge_en: "Most requested",
    badge_es: "Más solicitado",
    title_en: "Product Catalogs (InDesign)",
    title_es: "Catálogos de Producto (InDesign)",
    desc_en:
      "Print- and digital-ready product catalogs — from scratch or refining an 80%-done file. Clean grids, accurate spec tables, perfectly consistent across 100+ pages.",
    desc_es:
      "Catálogos de producto listos para impresión y digital — desde cero o refinando un archivo a medias. Grids limpios, tablas de specs precisas, consistencia perfecta en más de 100 páginas.",
    deliverables: [
      { en: "Master grid + style system", es: "Master grid + sistema de estilos" },
      { en: "Accurate specification tables", es: "Tablas de especificaciones precisas" },
      { en: "Print + digital PDF", es: "PDF print + digital" },
      { en: "Packaged InDesign source file", es: "Archivo InDesign empaquetado" },
    ],
  },
  {
    icon: "📄",
    title_en: "Spec & Data Sheets",
    title_es: "Fichas Técnicas y Data Sheets",
    desc_en:
      "A branded, data-merge-ready master template — generate dozens of accurate spec sheets without touching the layout.",
    desc_es:
      "Una plantilla maestra con branding y lista para data-merge — genera docenas de fichas precisas sin tocar la maquetación.",
    deliverables: [
      { en: "Parameterized template", es: "Plantilla parametrizada" },
      { en: "Data-merge setup", es: "Setup de data-merge" },
      { en: "NFPA / IES ready", es: "Lista para NFPA / IES" },
      { en: "Your team generates unlimited sheets", es: "Tu equipo genera fichas ilimitadas" },
    ],
  },
  {
    icon: "🧹",
    title_en: "Document Standardization",
    title_es: "Estandarización de Documentos",
    desc_en:
      "A readability + consistency pass on your existing InDesign or PDF. Same design, fixed and aligned — I follow your brief exactly, no surprise redesigns.",
    desc_es:
      "Un pase de legibilidad + consistencia sobre tu InDesign o PDF existente. Mismo diseño, corregido y alineado — sigo tu brief al pie de la letra, sin rediseños sorpresa.",
    deliverables: [
      { en: "Typography & spacing", es: "Tipografía y espaciado" },
      { en: "Table consistency", es: "Consistencia de tablas" },
      { en: "Page-by-page QA", es: "QA página por página" },
      { en: "Desktop + mobile review", es: "Revisión desktop + móvil" },
    ],
  },
  {
    icon: "⚙️",
    title_en: "Production Automation",
    title_es: "Automatización de Producción",
    desc_en:
      "Data merge, GREP styles, batch image processing, and Python pipelines that turn supplier data into branded product docs — the volume and consistency manual work can't match.",
    desc_es:
      "Data merge, estilos GREP, procesamiento de imágenes por lotes y pipelines en Python que convierten datos de proveedor en documentos de producto con branding — el volumen y la consistencia que el trabajo manual no iguala.",
    deliverables: [
      { en: "Supplier data → structured data", es: "Datos de proveedor → datos estructurados" },
      { en: "Automated layout", es: "Maquetación automatizada" },
      { en: "Batch image processing", es: "Procesamiento de imágenes en lote" },
      { en: "Reusable system", es: "Sistema reutilizable" },
    ],
  },
];

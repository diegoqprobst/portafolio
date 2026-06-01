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
  { value: "4+", label_en: "Years lighting", label_es: "Años en iluminación" },
  { value: "99%", label_en: "Data integrity", label_es: "Integridad de datos" },
];

export const DEFAULT_ABOUT: HomeAbout = {
  body_en:
    "I build automation systems and data pipelines from scratch — complete workflows that connect APIs, process data, and generate ready-to-use outputs. My stack is Claude Code + n8n + Antigravity, built specifically around the documentation workflows lighting manufacturers need.\n\nTrained clinical psychologist — I understand cognitive friction as well as LED driver circuits. Teams in France, UAE, and the Americas trust me to translate technical complexity into commercial clarity, 100% remote.",
  body_es:
    "Construyo sistemas de automatización desde cero — flujos completos que conectan APIs, procesan datos y generan outputs listos para usar. Mi stack es Claude Code + n8n + Antigravity, construido específicamente para los flujos de documentación que necesitan los fabricantes de iluminación.\n\nPsicólogo clínico de formación — entiendo la fricción cognitiva igual que los circuitos de un driver LED. Equipos en Francia, Emiratos Árabes y las Américas me confían la traducción de complejidad técnica en claridad comercial, 100% remoto.",
};

export const DEFAULT_SERVICES: HomeService[] = [
  {
    icon: "⚡",
    badge_en: "Most requested",
    badge_es: "Más solicitado",
    title_en: "Product Data Pipeline",
    title_es: "Pipeline de Datos de Producto",
    desc_en:
      "Supplier PDFs → structured, branded, e-commerce-ready product data. Automated from day one.",
    desc_es:
      "PDFs de proveedor → datos de producto estructurados, con branding, listos para e-commerce. Automatizado desde el primer día.",
    deliverables: [
      { en: "Spec extraction from any supplier format", es: "Extracción de specs de cualquier formato de proveedor" },
      { en: "SEO product descriptions (EN + ES)", es: "Descripciones de producto SEO (EN + ES)" },
      { en: "Platform schema mapping (Shopify, WooCommerce, etc.)", es: "Mapeo a esquemas de plataforma (Shopify, WooCommerce, etc.)" },
      { en: "Automated image renaming + metadata tagging", es: "Renombrado de imágenes + etiquetado de metadata automatizado" },
    ],
  },
  {
    icon: "📋",
    title_en: "NFPA-Compliant Documentation",
    title_es: "Documentación Conforme NFPA",
    desc_en:
      "Lab reports and raw specs converted into distribution-ready data sheets and catalogs for the US market.",
    desc_es:
      "Reportes de laboratorio y specs crudos convertidos en fichas técnicas y catálogos listos para distribución en el mercado americano.",
    deliverables: [
      { en: "NFPA 70 / NEC compliant data sheets", es: "Fichas técnicas conformes NFPA 70 / NEC" },
      { en: "IES photometric data interpretation", es: "Interpretación de datos fotométricos IES" },
      { en: "Branded PDF catalogs (Adobe InDesign)", es: "Catálogos PDF con branding (Adobe InDesign)" },
      { en: "Spec sheets ready for US distributor approval", es: "Fichas listas para aprobación de distribuidores americanos" },
    ],
  },
  {
    icon: "🤖",
    title_en: "Workflow Automation",
    title_es: "Automatización de Flujos",
    desc_en:
      "Repetitive documentation processes replaced by n8n + Claude Code pipelines. From chaotic to predictable.",
    desc_es:
      "Procesos de documentación repetitivos reemplazados por pipelines n8n + Claude Code. De caótico a predecible.",
    deliverables: [
      { en: "Process audit and bottleneck identification", es: "Auditoría de proceso e identificación de cuellos de botella" },
      { en: "n8n workflow design + deployment", es: "Diseño + despliegue de flujos n8n" },
      { en: "AI-assisted data extraction and enrichment", es: "Extracción y enriquecimiento de datos asistido por IA" },
      { en: "Monitoring + documentation for your team", es: "Monitoreo + documentación para tu equipo" },
    ],
  },
  {
    icon: "🏗️",
    title_en: "Technical Bid Proposals",
    title_es: "Propuestas Técnicas de Licitación",
    desc_en:
      "Public and private lighting bids with regulatory analysis, compliance arguments, and professional submittals.",
    desc_es:
      "Licitaciones de iluminación públicas y privadas con análisis normativo, argumentos de cumplimiento y submittals profesionales.",
    deliverables: [
      { en: "Municipal ordinance and standards research", es: "Investigación de ordenanzas municipales y estándares" },
      { en: "Compliance matrix (product vs. requirements)", es: "Matriz de cumplimiento (producto vs. requerimientos)" },
      { en: "Visual submittal design (Illustrator / InDesign)", es: "Diseño de submittal visual (Illustrator / InDesign)" },
      { en: "Technical narrative and justification", es: "Narrativa técnica y justificación" },
    ],
  },
];

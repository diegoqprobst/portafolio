export type Bilingual = { es: string; en: string };

export type Metric = { value: string; label: Bilingual };

export type Project = {
  id: string;
  number: string;
  title: string;
  tags: string[];
  summary: Bilingual;
  image: string;
  imageAlt: string;
  problem: Bilingual;
  results?: Bilingual[];
  scope?: Bilingual[];
  caseStudyHref?: string;
};

export type Service = {
  icon: string;
  title: Bilingual;
  blurb: Bilingual;
  deliverables: Bilingual[];
  mailSubject: string;
};

export type TechItem = { icon: string; label: string };

export const heroPhrases = {
  es: [
    "Construyo sistemas, no solo scripts",
    "Automatizo lo que no debería ser manual",
    "Integro IA en flujos reales",
    "Pipelines de datos que escalan solos",
  ],
  en: [
    "I build systems, not just scripts",
    "I automate what shouldn't be manual",
    "I integrate AI into real workflows",
    "Data pipelines that scale themselves",
  ],
};

export const metrics: Metric[] = [
  { value: "4+", label: { es: "Años Exp.", en: "Years Exp." } },
  { value: "3", label: { es: "Países", en: "Countries" } },
  { value: "10+", label: { es: "Proyectos", en: "Projects" } },
  { value: "3", label: { es: "Industrias", en: "Industries" } },
];

export const projects: Project[] = [
  {
    id: "p1",
    number: "01",
    title: "Luxarmonie Product Intelligence",
    tags: ["Python", "Claude API", "React"],
    summary: {
      es: "Flujo de extracción inteligente de specs técnicos desde catálogos de proveedores chinos. Genera descripciones y fichas de producto listas para e-commerce.",
      en: "Intelligent extraction flow for technical specs from Chinese supplier catalogs. Generates product descriptions and data sheets ready for e-commerce.",
    },
    image: "/assets/projects/1.jpg",
    imageAlt: "Luxarmonie Product Intelligence dashboard",
    problem: {
      es: "E-commerce francés con catálogos de proveedores chinos en formatos inconsistentes. Extracción manual de specs: 40 horas mensuales, propensa a errores y sin escalabilidad.",
      en: "French e-commerce with Chinese supplier catalogs in inconsistent formats. Manual spec extraction: 40 monthly hours, error-prone, and impossible to scale.",
    },
    results: [
      {
        es: "-75% carga manual (40h → 10h/mes)",
        en: "-75% manual load (40h → 10h/month)",
      },
      { es: "99.2% integridad de datos", en: "99.2% data integrity" },
      {
        es: "Descripciones e-commerce generadas automáticamente",
        en: "E-commerce descriptions generated automatically",
      },
    ],
  },
  {
    id: "p2",
    number: "02",
    title: "CRE Reporting Automation",
    tags: ["Python", "Adobe InDesign", "Automation"],
    summary: {
      es: "Pipeline \"Data-to-Design\": 200+ reportes financieros generados automáticamente en PDF con Adobe InDesign. De datos crudos a documentos con branding profesional.",
      en: "\"Data-to-Design\" pipeline: 200+ branded PDF documents auto-generated via Adobe InDesign. The same pipeline that powers automated lighting catalogs — proven at scale in financial reporting.",
    },
    image: "/assets/projects/2.jpg",
    imageAlt: "CRE automated financial report",
    problem: {
      es: "Firma de real estate producía 200+ reportes financieros en PDF manualmente. 30-40 minutos por documento, alta tasa de errores y branding visual inconsistente entre reportes.",
      en: "Real estate firm produced 200+ financial PDF reports manually. 30–40 minutes per document, high error rate, and inconsistent visual branding across reports.",
    },
    results: [
      {
        es: "-95% tiempo por reporte (40min → 2min)",
        en: "-95% time per report (40min → 2min)",
      },
      {
        es: "100% libre de errores tipográficos",
        en: "100% typo-free output",
      },
      {
        es: "Branding consistente en todos los documentos",
        en: "Consistent branding across all documents",
      },
    ],
  },
  {
    id: "p3",
    number: "03",
    title: "Saratoga Public Lighting Proposal",
    tags: ["Claude Code", "Adobe Illustrator", "Excel", "Municipal Standards"],
    summary: {
      es: "Propuesta técnica para licitación de alumbrado público en parques de Saratoga, Utah. Análisis de normativa municipal + rediseño visual con datos para darle al cliente ventaja competitiva real.",
      en: "Technical proposal for a public parks lighting bid in Saratoga, Utah. Municipal regulation analysis + data-backed visual redesign to give the client a real competitive edge.",
    },
    image: "/assets/projects/submittal-sample.png",
    imageAlt: "Saratoga public lighting proposal",
    problem: {
      es: "Propuesta de alumbrado para parques públicos en Utah sin análisis normativo ni sustento técnico. Sin datos de la municipalidad de Saratoga, el cliente no podía diferenciarse en la licitación.",
      en: "A public parks lighting bid in Utah lacking regulatory analysis and technical backing. Without Saratoga municipality data, the client had no way to stand out in the tender.",
    },
    results: [
      {
        es: "Propuesta conforme a normativa municipal de Saratoga, Utah",
        en: "Proposal fully compliant with Saratoga, Utah municipal standards",
      },
      {
        es: "Rediseño visual con Adobe Illustrator y datos integrados",
        en: "Visual redesign in Adobe Illustrator with integrated data",
      },
      {
        es: "Cliente con ventaja técnica sólida en la licitación pública",
        en: "Client with a strong technical edge in the public bid",
      },
    ],
    caseStudyHref: "/saratoga",
  },
  {
    id: "p4",
    number: "04",
    title: "LED Technical Documentation System",
    tags: ["Data Analysis", "Excel", "NFPA Standards"],
    summary: {
      es: "Sistema de documentación técnica para drivers LED bajo estándares NFPA. Interpreta reportes de laboratorio y los transforma en catálogos listos para distribuidores americanos.",
      en: "Technical documentation system for LED drivers under NFPA standards. Interprets lab reports and transforms them into catalogs ready for US distributors.",
    },
    image: "/assets/projects/4.jpg",
    imageAlt: "LED technical documentation",
    problem: {
      es: "Fabricante de iluminación con datos de laboratorio crudos no aptos para distribución en el mercado americano. Sin documentación conforme NFPA, los productos no podían comercializarse en USA.",
      en: "Lighting manufacturer with raw lab data not suitable for US market distribution. Without NFPA-compliant documentation, products couldn't be sold in the US.",
    },
    results: [
      {
        es: "Catálogo 100% conforme NFPA/NEC para distribuidores USA",
        en: "100% NFPA/NEC-compliant catalog for US distributors",
      },
      {
        es: "Datos técnicos de laboratorio convertidos a valor comercial",
        en: "Lab technical data converted into commercial value",
      },
      {
        es: "Producto listo para distribución en mercado americano",
        en: "Product ready for US market distribution",
      },
    ],
  },
  {
    id: "p5",
    number: "05",
    title: "Revem — Full Design & Automation Operations",
    tags: ["AI Image Generation", "E-commerce", "Adobe InDesign", "Automation"],
    summary: {
      es: "Operaciones completas de diseño y automatización para Revem: catálogo de 200+ páginas, e-commerce, imágenes de producto con IA generativa en locaciones icónicas de Ecuador — los productos tratados se agotaron.",
      en: "Full design and automation operations for Revem: 200+ page catalog, e-commerce build, and AI-generated product images placed in iconic Ecuador locations — treated products sold out, untreated ones didn't.",
    },
    image: "/assets/projects/revem.jpg",
    imageAlt: "Revem design operations",
    problem: {
      es: "Operaciones completas de diseño y producto requeridas en paralelo: catálogo, e-commerce, imágenes AI de producto y automatización de fichas técnicas.",
      en: "Full design and product operations required in parallel: catalog, e-commerce, AI product images, and technical sheet automation.",
    },
    scope: [
      {
        es: "Catálogo de producto de 200+ páginas (Adobe InDesign)",
        en: "200+ page product catalog (Adobe InDesign)",
      },
      {
        es: "Trípticos y material de marketing impreso",
        en: "Triptychs and printed marketing materials",
      },
      {
        es: "Construcción de e-commerce completo",
        en: "Full e-commerce store build",
      },
      {
        es: "Imágenes de producto con IA en locaciones de Ecuador",
        en: "AI product images in iconic Ecuador locations",
      },
      {
        es: "Automatización de fichas técnicas de producto",
        en: "Automated product technical sheet generation",
      },
    ],
    results: [
      {
        es: "Productos con imágenes AI → agotados",
        en: "Products with AI imagery → sold out",
      },
      {
        es: "Productos sin tratamiento → sin el mismo impacto",
        en: "Untreated products → significantly lower impact",
      },
      {
        es: "Catálogo + e-commerce operativos para distribución",
        en: "Catalog + e-commerce live and operational",
      },
    ],
  },
  {
    id: "p6",
    number: "06",
    title: "Wedding Studio PDF Proposal System",
    tags: ["Claude Design", "Claude Code", "HTML/CSS"],
    summary: {
      es: "Sistema completo para generar propuestas PDF personalizadas para un estudio de fotografía de bodas de lujo. Diseñado en Claude Design: template HTML + archivo de datos por cliente → PDF listo para imprimir.",
      en: "Complete system to generate personalized PDF proposals for a luxury wedding photography studio. Built in Claude Design: HTML template + per-client data file → print-ready PDF.",
    },
    image: "/assets/projects/6.jpg",
    imageAlt: "Wedding studio 6-page investment guide PDF",
    problem: {
      es: "Estudio de fotografía necesitaba propuestas con nombre, paquete y precio personalizados por cliente, sin retocar el diseño. El equipo no-técnico debía poder operar el sistema de principio a fin.",
      en: "Photography studio needed proposals with personalized name, package, and price per client, without touching the design. Non-technical staff had to be able to run the system end to end.",
    },
    results: [
      {
        es: "Guía de inversión de 6 páginas: Cover → Studio → Collections → Experience → Testimonial → Investment",
        en: "6-page investment guide: Cover → Studio → Collections → Experience → Testimonial → Investment",
      },
      {
        es: "Sistema data-field: un archivo de texto por cliente → PDF personalizado sin tocar el HTML",
        en: "data-field system: one plain-text file per client → personalized PDF without touching the HTML",
      },
      {
        es: "Design tokens reutilizables: cualquier variante futura hereda el branding automáticamente",
        en: "Reusable design tokens: any future variant inherits the branding automatically",
      },
    ],
    caseStudyHref: "https://github.com/diegoqprobst/wedding-proposal-pdf-system",
  },
];

export const services: Service[] = [
  {
    icon: "Workflow",
    title: {
      es: "Automatización de Flujos",
      en: "Workflow Automation",
    },
    blurb: {
      es: "Construyo flujos de automatización completos con Python + n8n — integración de APIs, procesamiento de datos y lógica de negocio lista para producción.",
      en: "I build complete automation workflows with Python + n8n — API integrations, data processing, and business logic ready for production.",
    },
    deliverables: [
      {
        es: "Integración de APIs y fuentes de datos externas",
        en: "API integrations and external data sources",
      },
      {
        es: "Lógica de negocio automatizada en producción",
        en: "Business logic automated and deployed to production",
      },
      {
        es: "Documentación técnica + handoff al equipo",
        en: "Technical documentation + team handoff",
      },
    ],
    mailSubject: "Workflow Automation Inquiry",
  },
  {
    icon: "BarChart2",
    title: { es: "Análisis & Dashboards", en: "Analytics & Dashboards" },
    blurb: {
      es: "Convierto tus datos en decisiones. Google Sheets, Python o Excel: donde estén tus datos, los trabajo.",
      en: "I turn your data into decisions. Google Sheets, Python, or Excel — wherever your data lives, I work with it.",
    },
    deliverables: [
      {
        es: "Auditoría de fuentes de datos existentes",
        en: "Audit of existing data sources",
      },
      {
        es: "Dashboard interactivo con KPIs clave",
        en: "Interactive dashboard with key KPIs",
      },
      {
        es: "Informe ejecutivo de hallazgos",
        en: "Executive findings report",
      },
    ],
    mailSubject: "Analytics & Dashboards Inquiry",
  },
  {
    icon: "Sparkles",
    title: { es: "Integración con IA", en: "AI Integration" },
    blurb: {
      es: "Añado inteligencia real a tus flujos existentes con Claude API u OpenAI, sin reescribir todo.",
      en: "I add real intelligence to your existing workflows using Claude API or OpenAI, without rewriting everything.",
    },
    deliverables: [
      {
        es: "Definición de casos de uso concretos",
        en: "Definition of concrete use cases",
      },
      {
        es: "Integración de API en sistema existente",
        en: "API integration into existing system",
      },
      {
        es: "Evaluación de calidad de salidas",
        en: "Output quality evaluation",
      },
    ],
    mailSubject: "AI Integration Inquiry",
  },
  {
    icon: "Layers",
    title: {
      es: "Diseño Técnico + Automatización",
      en: "Technical Design + Automation",
    },
    blurb: {
      es: "Documentación técnica, catálogos conformes y fichas de producto para fabricantes de iluminación y electricidad — con flujos automatizados detrás.",
      en: "Technical documentation, compliance catalogs, and product data sheets for lighting and electrical manufacturers — with automated workflows behind them.",
    },
    deliverables: [
      {
        es: "Revisión de cumplimiento NFPA / NEC",
        en: "NFPA / NEC compliance review",
      },
      {
        es: "Fichas de producto + diseño de catálogo",
        en: "Product data sheets + catalog design",
      },
      {
        es: "Pipeline automatizado de generación",
        en: "Automated generation pipeline",
      },
    ],
    mailSubject: "Technical Design + Automation Inquiry",
  },
  {
    icon: "FileText",
    title: {
      es: "Sistemas de Propuestas con IA",
      en: "AI-Powered Proposal Systems",
    },
    blurb: {
      es: "Configuro Claude Design para que tu equipo genere propuestas, cotizaciones o contratos con tu branding — sin tocar el diseño, sin desarrolladores.",
      en: "I configure Claude Design so your team can generate branded proposals, quotes, or contracts — no design edits, no developers.",
    },
    deliverables: [
      {
        es: "Sistema de diseño en Claude Design (tokens, tipografía, colores de marca)",
        en: "Design system in Claude Design (brand tokens, typography, colors)",
      },
      {
        es: "Template HTML imprimible con placeholders por cliente",
        en: "Printable HTML template with per-client data placeholders",
      },
      {
        es: "Guía de uso: archivo de texto por cliente → PDF listo para imprimir",
        en: "Usage guide: plain-text file per client → print-ready PDF",
      },
    ],
    mailSubject: "AI Proposal System Inquiry",
  },
];

export const techStack: TechItem[] = [
  { icon: "Terminal", label: "PYTHON" },
  { icon: "Workflow", label: "N8N" },
  { icon: "Database", label: "G. SHEETS" },
  { icon: "Sparkles", label: "CLAUDE API" },
  { icon: "Layout", label: "INDESIGN" },
  { icon: "PenTool", label: "ILLUSTRATOR" },
];

export type FeaturedWork = {
  title: string;
  year: string;
  client: string;
  service: { en: string; es: string };
  outcome: { en: string; es: string };
  image: string;
  href: string;
  kind: "case-study" | "document";
};

export const FEATURED_WORK: FeaturedWork[] = [
  {
    title: "Saratoga Public Lighting Submittal",
    year: "2026",
    client: "Public infrastructure · United States",
    service: {
      en: "Technical research · Compliance · Editorial design",
      es: "Investigación técnica · Cumplimiento · Diseño editorial",
    },
    outcome: {
      en: "Turned fragmented product data into a committee-ready bid package aligned with municipal, IES and NFPA requirements.",
      es: "Convertí datos de producto fragmentados en una propuesta lista para comité, alineada con requisitos municipales, IES y NFPA.",
    },
    image: "/assets/projects/submittal-sample.png",
    href: "/saratoga",
    kind: "case-study",
  },
  {
    title: "Luxarmonie Product Intelligence",
    year: "2026",
    client: "Lighting e-commerce · France",
    service: {
      en: "AI extraction · Product data · Content operations",
      es: "Extracción con IA · Datos de producto · Operaciones de contenido",
    },
    outcome: {
      en: "Reduced manual catalog processing from 40 to 10 hours per month while preserving 99.2% data integrity.",
      es: "Reduje el procesamiento manual de catálogos de 40 a 10 horas al mes, manteniendo 99,2 % de integridad de datos.",
    },
    image: "/assets/projects/1.jpg",
    href: "/luxarmonie",
    kind: "case-study",
  },
  {
    title: "Wellness Commerce Sales Deck",
    year: "2026",
    client: "Healthcare · B2B strategy",
    service: {
      en: "Executive storytelling · Financial modeling · Presentation design",
      es: "Narrativa ejecutiva · Modelo financiero · Diseño de presentación",
    },
    outcome: {
      en: "Built a 14-slide decision deck that connects patient journey, revenue cascade and a $15.4M commercial model.",
      es: "Construí un deck de 14 diapositivas que conecta el recorrido del paciente, la cascada de ingresos y un modelo comercial de $15,4 M.",
    },
    image: "/assets/projects/wellnova-deck-cover.png",
    href: "/wellnova-sales-deck.pdf",
    kind: "document",
  },
  {
    title: "Healthcare IT Leadership Guide",
    year: "2026",
    client: "Healthcare IT · Executive education",
    service: {
      en: "Content architecture · Editorial design · Data visualization",
      es: "Arquitectura de contenido · Diseño editorial · Visualización de datos",
    },
    outcome: {
      en: "Rebuilt raw source material into a concise 13-page publication with quantified transformation case studies.",
      es: "Reconstruí material fuente en una publicación concisa de 13 páginas con casos de transformación cuantificados.",
    },
    image: "/assets/projects/agile-cover.png",
    href: "/agile-transformation.pdf",
    kind: "document",
  },
];

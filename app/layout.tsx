import type { Metadata, Viewport } from "next";
import { Nunito, Fraunces, Hanken_Grotesk, JetBrains_Mono, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// Self-hosted via next/font: sin round-trip a Google (mejor LCP + privacidad).
// Nunito es variable → un solo archivo cubre todos los pesos 300–900.
// Sigue alimentando /lumen y /admin (no se tocan en este cambio de base).
const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  style: ["normal", "italic"],
});

// ── Raíz (diegoquinde.com) ────────────────────────────────────────────────
// Montserrat es la voz de display de la raíz: geométrica, de caja ancha y
// disponible hasta 900, el pariente vivo de la rotulación urbana de los años
// 30 que compone las portadas de catálogo técnico de la referencia. Se
// autoaloja; el cuerpo es Helvetica Neue, declarada como stack en umbrella.css
// (no es redistribuible, así que no puede autoalojarse).
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

// Sistema tipográfico heredado: lo siguen consumiendo /lumen, /saratoga,
// /luxarmonie y /tools. No es el de la raíz.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  style: ["normal", "italic"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jbmono",
});

const SITE = "https://diegoquinde.com";

const TITLE = "Diego Quinde — Lighting Submittals & Technical Documentation";
const DESCRIPTION =
  "I produce submittals, spec sheets and technical catalogs for lighting manufacturers, reps and specifiers — assembled against IES, NFPA and EN requirements on an InDesign + AI pipeline. Clinical psychologist, systems designer and AI builder, based in Miami, available for freelance work.";

// ── Grafo JSON-LD ─────────────────────────────────────────────────────────
// Escrito para que un motor de respuesta (ChatGPT, Claude, Perplexity, AI
// Overviews) pueda contestar dos preguntas sin inferir nada: "¿quién produce
// submittals y catálogos técnicos de iluminación?" y "¿a quién contrato para
// convertir datos complejos en documentos de decisión?". Cada nodo solo
// afirma hechos que la página también imprime en texto visible.
// Contenido estático que yo controlo (no input de usuario) → seguro en
// dangerouslySetInnerHTML.
const PERSON_ID = `${SITE}/#diego`;
const STUDIO_ID = `${SITE}/#lumen-studio`;

const SERVICES = [
  {
    name: "Lighting submittal production",
    description:
      "Bid and approval packages for lighting projects: product data, photometrics, compliance matrix and cover letter assembled into one committee-ready PDF against municipal, IES and NFPA requirements.",
  },
  {
    name: "Technical catalog production",
    description:
      "Multi-page product catalogs for lighting brands, built from structured product data so every page stays consistent across hundreds of SKUs.",
  },
  {
    name: "Spec sheet and cut sheet systems",
    description:
      "Parametric spec sheet templates in Adobe InDesign driven by data merge, so a catalog update regenerates instead of being redrawn.",
  },
  {
    name: "Product data extraction and cleanup",
    description:
      "AI-assisted extraction of product attributes from manufacturer PDFs into structured, validated catalog data.",
  },
  {
    name: "Decision documents and executive decks",
    description:
      "Research, product data and strategy turned into decks, publications and reports a team can decide on.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Diego Quinde",
      alternateName: "Diego A. Quinde",
      url: SITE,
      image: `${SITE}/IMG_6290.JPG`,
      email: "diegoaquinde@gmail.com",
      jobTitle: "Technical documentation designer, clinical psychologist and AI builder",
      description:
        "Clinical psychologist and systems designer who produces technical documentation for lighting manufacturers — submittals, spec sheets and catalogs built to IES, NFPA and EN requirements — and builds open-source AI evaluation tooling for psychotherapy.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Miami",
        addressRegion: "FL",
        addressCountry: "US",
      },
      knowsLanguage: ["en", "es"],
      knowsAbout: [
        "Lighting submittals",
        "Spec sheets",
        "Cut sheets",
        "Technical product catalogs",
        "IES photometric standards",
        "NFPA requirements",
        "EN lighting standards",
        "Adobe InDesign data merge",
        "Product data extraction",
        "Technical documentation",
        "Editorial design",
        "Psychotherapy",
        "Brief therapy",
        "Systemic family therapy",
        "AI evaluation",
        "LLM safety",
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: "Technical documentation designer",
        occupationLocation: { "@type": "City", name: "Miami" },
        skills:
          "Lighting submittals, technical catalogs, spec sheets, InDesign automation, product data extraction, AI evaluation",
      },
      makesOffer: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          provider: { "@id": STUDIO_ID },
        },
      })),
      worksFor: { "@id": STUDIO_ID },
      sameAs: [
        "https://www.upwork.com/freelancers/diegoaq",
        "https://github.com/diegoqprobst",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": STUDIO_ID,
      name: "Lumen Studio",
      url: `${SITE}/lumen`,
      founder: { "@id": PERSON_ID },
      description:
        "Technical documentation studio for lighting brands: submittals, spec sheets and catalogs produced on an InDesign + AI pipeline against IES, NFPA and EN requirements.",
      serviceType: SERVICES.map((s) => s.name),
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "France" },
        { "@type": "Country", name: "Ecuador" },
      ],
      availableLanguage: ["en", "es"],
      email: "diegoaquinde@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Diego Quinde",
      inLanguage: ["en", "es"],
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE}/#selected-work`,
      name: "Selected work",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "CreativeWork",
            name: "Saratoga Public Lighting Submittal",
            url: `${SITE}/saratoga`,
            dateCreated: "2026",
            about: "Public lighting bid package aligned to municipal, IES and NFPA requirements",
            creator: { "@id": PERSON_ID },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "CreativeWork",
            name: "Luxarmonie Product Intelligence",
            url: `${SITE}/luxarmonie`,
            dateCreated: "2026",
            about:
              "AI extraction pipeline that cut lighting catalog processing from 40 to 10 hours per month at 99.2% data integrity",
            creator: { "@id": PERSON_ID },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "CreativeWork",
            name: "Wellness Commerce Sales Deck",
            url: `${SITE}/wellnova-sales-deck.pdf`,
            dateCreated: "2026",
            about: "14-slide decision deck connecting patient journey, revenue cascade and a $15.4M commercial model",
            creator: { "@id": PERSON_ID },
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "CreativeWork",
            name: "Healthcare IT Leadership Guide",
            url: `${SITE}/agile-transformation.pdf`,
            dateCreated: "2026",
            about: "13-page executive publication with quantified transformation case studies",
            creator: { "@id": PERSON_ID },
          },
        },
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE),
  alternates: { canonical: "/" },
  authors: [{ name: "Diego Quinde", url: SITE }],
  creator: "Diego Quinde",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/`,
    siteName: "Diego Quinde",
    locale: "en_US",
    alternateLocale: "es_ES",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  icons: {
    // Colibrí de marca (manual de marca), trazo engrosado para que lea a 16px.
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -9 114 114' fill='none' stroke='%23575892' stroke-width='5.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 42 L42 48'/><path d='M42 48 Q52 38 64 44 Q78 51 76 62 Q73 70 60 68 Q47 65 42 48 Z'/><circle cx='49' cy='46' r='2.4' fill='%23575892' stroke='none'/><path d='M60 50 Q66 24 96 16 Q78 38 68 56'/><path d='M76 62 L106 64'/><path d='M76 64 L108 74'/><path d='M74 66 L100 80'/></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#575892",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${montserrat.variable} ${fraunces.variable} ${hanken.variable} ${jbmono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="lang-en">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Nunito, Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
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

// Sistema tipográfico de la raíz umbrella ("una mente encendida por dentro"):
// pareja por eje de contraste, no por similitud. Fraunces = display serif
// óptico y humano (psicología); Hanken Grotesk = cuerpo neutro legible;
// JetBrains Mono = la textura técnica (el que construye IA). Variables CSS
// consumidas solo bajo `.umbra` en app/umbrella.css.
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

// JSON-LD del dominio: una Person multi-rol (psicólogo clínico construyendo IA
// para salud mental + fundador de Lumen Studio). El ProfessionalService del
// estudio vive en /lumen. Contenido estático que yo controlo (no input de
// usuario) → seguro en dangerouslySetInnerHTML.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Diego Quinde",
  url: "https://diegoquinde.com",
  image: "https://diegoquinde.com/IMG_6290.JPG",
  email: "diegoaquinde@gmail.com",
  jobTitle: "Clinical Psychologist, Systems Designer & AI Builder",
  description:
    "Clinical psychologist, systems designer and AI builder who turns complex research, product data and strategy into decision-ready documents and useful digital products.",
  knowsAbout: [
    "Psychotherapy",
    "Brief therapy",
    "Systemic therapy",
    "AI evaluation",
    "LLM safety",
    "Technical documentation",
    "Adobe InDesign",
  ],
  brand: {
    "@type": "Organization",
    name: "Lumen Studio",
    url: "https://diegoquinde.com/lumen",
  },
  sameAs: ["https://www.upwork.com/freelancers/diegoaq"],
};

const TITLE = "Diego Quinde — Systems Designer, Clinical Psychologist & AI Builder";
const DESCRIPTION =
  "Selected work by Diego Quinde across healthcare, public infrastructure, product documentation and AI for mental health — combining research, design and automation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://diegoquinde.com"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://diegoquinde.com/",
    type: "website",
  },
  icons: {
    // Colibrí de marca (manual de marca), trazo engrosado para que lea a 16px.
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -9 114 114' fill='none' stroke='%23F5A623' stroke-width='5.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 42 L42 48'/><path d='M42 48 Q52 38 64 44 Q78 51 76 62 Q73 70 60 68 Q47 65 42 48 Z'/><circle cx='49' cy='46' r='2.4' fill='%23F5A623' stroke='none'/><path d='M60 50 Q66 24 96 16 Q78 38 68 56'/><path d='M76 62 L106 64'/><path d='M76 64 L108 74'/><path d='M74 66 L100 80'/></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0C10",
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
      className={`${nunito.variable} ${fraunces.variable} ${hanken.variable} ${jbmono.variable}`}
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

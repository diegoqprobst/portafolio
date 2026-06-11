import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// Self-hosted via next/font: sin round-trip a Google (mejor LCP + privacidad).
// Nunito es variable → un solo archivo cubre todos los pesos 300–900.
const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  style: ["normal", "italic"],
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
  jobTitle: "Clinical Psychologist & AI Developer",
  description:
    "Clinical psychologist building AI for mental health: open-source evals for psychotherapy, a brief-therapy simulator, and a game about peace conflicts. Founder of Lumen Studio (technical documentation for lighting brands).",
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

const TITLE = "Diego Quinde — Clinical Psychologist Building AI for Mental Health";
const DESCRIPTION =
  "Clinical psychologist building AI for mental health: open-source evals for psychotherapy, a brief-therapy simulator, a game about peace conflicts — and Lumen Studio, technical documentation for lighting brands.";

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
    // Lumen mark — amber radiant dot.
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='34' fill='%23F5A623'/></svg>",
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
    <html lang="en" className={nunito.variable}>
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

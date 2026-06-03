import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// JSON-LD structured data — ayuda a Google a entender que esto es un servicio
// profesional (Lumen Studio) y quién lo opera. Contenido estático que yo
// controlo (no input de usuario) → seguro en dangerouslySetInnerHTML.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Lumen Studio",
  description:
    "Technical product catalogs, spec/data sheets, and product-data automation in Adobe InDesign — for lighting and industrial brands.",
  url: "https://diegoquinde.com",
  image: "https://diegoquinde.com/IMG_6290.JPG",
  founder: { "@type": "Person", name: "Diego Quinde" },
  email: "diegoaquinde@gmail.com",
  areaServed: ["United States", "Europe", "Latin America"],
  knowsAbout: [
    "Adobe InDesign",
    "Product catalogs",
    "Spec sheets",
    "Data merge",
    "NFPA",
    "IES",
    "Technical documentation",
  ],
  sameAs: ["https://www.upwork.com/freelancers/diegoaq"],
};

const TITLE = "Lumen Studio · Technical Product Catalogs & Spec Sheets in InDesign";
const DESCRIPTION =
  "Lumen Studio (Diego Quinde) builds print- and digital-ready product catalogs, spec sheets, and submittals in Adobe InDesign — automated for speed and consistency, for lighting and industrial brands.";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300&display=swap"
          rel="stylesheet"
        />
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

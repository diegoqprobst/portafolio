import type { Metadata, Viewport } from "next";
import "./globals.css";

const TITLE = "Lumen Studio · Technical Product Catalogs & Spec Sheets in InDesign";
const DESCRIPTION =
  "Lumen Studio (Diego Quinde) builds print- and digital-ready product catalogs, spec sheets, and submittals in Adobe InDesign — automated for speed and consistency, for lighting and industrial brands.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://diegoquinde.com/",
    images: ["https://diegoquinde.com/IMG_6290.JPG"],
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
      </head>
      <body className="lang-en">{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diego Quinde · Product Data & Automation for Lighting Manufacturers",
  description:
    "I turn your product data into US-ready catalogs that sell. Automation pipelines, NFPA-compliant docs, and e-commerce product data for lighting manufacturers.",
  openGraph: {
    title:
      "Diego Quinde · Product Data & Automation for Lighting Manufacturers",
    description:
      "I turn your product data into US-ready catalogs that sell. Automation pipelines, NFPA-compliant docs, and e-commerce product data for lighting manufacturers.",
    url: "https://diegoquinde.com/",
    images: ["https://diegoquinde.com/IMG_6290.JPG"],
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
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

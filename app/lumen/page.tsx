import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import { getHomeContent } from "@/lib/home-content";

// Lumen Studio vive ahora en /lumen: la raíz del dominio pasó a ser el perfil
// umbrella de Diego (psicólogo clínico × IA × builder) y el estudio es una de
// sus líneas. Misma página que era la home: ISR cada 5 min, y /admin/home
// llama revalidatePath("/lumen") al guardar. Fallback a defaults si la DB falla.
export const revalidate = 300;

const TITLE = "Lumen Studio · Technical Product Catalogs & Spec Sheets in InDesign";
const DESCRIPTION =
  "Lumen Studio (Diego Quinde) builds print- and digital-ready product catalogs, spec sheets, and submittals in Adobe InDesign — automated for speed and consistency, for lighting and industrial brands.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://diegoquinde.com/lumen" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://diegoquinde.com/lumen",
    type: "website",
  },
};

// JSON-LD del estudio (antes en el layout raíz; ahora pertenece a esta ruta).
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Lumen Studio",
  description:
    "Technical product catalogs, spec/data sheets, and product-data automation in Adobe InDesign — for lighting and industrial brands.",
  url: "https://diegoquinde.com/lumen",
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

export default async function Page() {
  const content = await getHomeContent();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HomeClient content={content} />
    </>
  );
}

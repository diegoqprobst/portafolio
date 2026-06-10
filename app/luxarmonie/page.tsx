import type { Metadata } from "next";
import LuxarmonieClient from "./LuxarmonieClient";

export const metadata: Metadata = {
  title: "Case Study: Luxarmonie Product Intelligence · Diego Quinde",
  description:
    "Case Study: Luxarmonie Product Intelligence — How Diego Quinde cut a French lighting e-commerce's manual spec work by 75% with an automated extraction pipeline and an ongoing technical review of its catalog.",
  openGraph: {
    title: "Case Study: Luxarmonie Product Intelligence · Diego Quinde",
    description:
      "40 hours/month of manual spec extraction → an automated pipeline (Python + Claude API) and continuous technical review. −75% manual load, 99.2% data integrity for a French lighting e-commerce.",
    type: "article",
    url: "https://diegoquinde.com/luxarmonie",
    images: ["https://diegoquinde.com/assets/projects/1.jpg"],
  },
};

export default function Page() {
  return <LuxarmonieClient />;
}

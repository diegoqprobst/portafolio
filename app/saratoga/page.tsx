import type { Metadata } from "next";
import SaratogaClient from "./SaratogaClient";

export const metadata: Metadata = {
  title: "Case Study: Saratoga Public Lighting Proposal · Diego Quinde",
  description:
    "Case Study: Saratoga Public Lighting Proposal — How Diego Quinde mapped municipal requirements to product data and redesigned a public parks lighting submittal for Saratoga Springs, Utah.",
  openGraph: {
    title:
      "Case Study: Saratoga Public Lighting Proposal · Diego Quinde",
    description:
      "Municipal standards research, product-data mapping, and a data-backed redesign of a public parks lighting submittal in Saratoga Springs, Utah.",
    type: "article",
    url: "https://diegoquinde.com/saratoga",
    images: ["https://diegoquinde.com/assets/projects/submittal-sample.png"],
  },
};

export default function Page() {
  return <SaratogaClient />;
}

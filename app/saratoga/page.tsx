import type { Metadata } from "next";
import SaratogaClient from "./SaratogaClient";

export const metadata: Metadata = {
  title: "Case Study: Saratoga Public Lighting Proposal · Diego Quinde",
  description:
    "Case Study: Saratoga Public Lighting Proposal — How Diego Quinde turned a weak bid into a technically solid, regulation-compliant proposal for public parks lighting in Saratoga, Utah.",
  openGraph: {
    title:
      "Case Study: Saratoga Public Lighting Proposal · Diego Quinde",
    description:
      "Weak proposal → technically solid bid. Municipal standards analysis + data-backed redesign for public parks lighting in Saratoga Springs, Utah.",
    type: "article",
    url: "https://diegoquinde.com/saratoga",
    images: ["https://diegoquinde.com/assets/projects/submittal-sample.png"],
  },
};

export default function Page() {
  return <SaratogaClient />;
}

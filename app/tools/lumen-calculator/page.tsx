import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import LumenCalculator from "./LumenCalculator";
import "./lumen-calculator.css";

const TITLE = "Lumen Calculator — How Many Lumens Do You Need? | Lumen Studio";
const DESCRIPTION =
  "Free lumen calculator: find how many lumens and light fixtures a room needs, based on IES and EN 12464-1 recommended lux levels. Works in metric and imperial — by Lumen Studio.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://diegoquinde.com/tools/lumen-calculator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://diegoquinde.com/tools/lumen-calculator",
  },
};

// Recommended maintained illuminance by space type (EN 12464-1 / IES) — the
// same standards Lumen Studio applies to technical documentation.
const LUX_TABLE = [
  ["Office — general / open-plan", "500 lux", "~50 fc"],
  ["Office — detailed / drawing work", "750 lux", "~70 fc"],
  ["Conference / meeting room", "500 lux", "~50 fc"],
  ["Retail — sales floor", "500 lux", "~50 fc"],
  ["Classroom", "300 lux", "~30 fc"],
  ["Warehouse — storage", "150 lux", "~15 fc"],
  ["Warehouse — picking / active", "200 lux", "~20 fc"],
  ["Industrial — assembly (medium)", "500 lux", "~50 fc"],
  ["Industrial — fine / precision", "1000 lux", "~95 fc"],
  ["Corridor / circulation", "100 lux", "~10 fc"],
  ["Parking (indoor)", "75 lux", "~7 fc"],
];

const FAQS = [
  {
    q: "How many lumens do I need for a room?",
    a: "Multiply the room area by the recommended illuminance for its use. For a 20 m² (215 ft²) office at 500 lux you need about 10,000 lumens at the work plane — and roughly 25,000 installed lumens once you account for fixture utilization and maintenance losses. Use the calculator above to get the exact figure for your space.",
  },
  {
    q: "What is the difference between lux and lumens?",
    a: "Lumens measure the total light a source emits. Lux measures how much of that light lands on a surface — one lux is one lumen per square metre. Standards like EN 12464-1 and IES specify target lux for each task, and the calculator converts that into the lumens you need to install.",
  },
  {
    q: "How many lumens per square meter or square foot?",
    a: "It depends on the task: 100 lux (≈10 lm/ft² of delivered light) for a corridor, 500 lux for an office, 1000 lux for precision work. Because real installations lose light to fixtures and dirt, plan for roughly 2–2.5× the delivered lumens as installed lumens.",
  },
];

export default function Page() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Lumen Calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      url: "https://diegoquinde.com/tools/lumen-calculator",
      description: DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@type": "Organization", name: "Lumen Studio" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="tools-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="tools-navbar">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="text-2xl font-black tracking-tighter gradient-text">
              DQ
            </Link>
            <Link
              href="/lumen"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-electric transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Lumen Studio
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-widest text-electric uppercase bg-electric/10 border border-electric/20 rounded-full mb-6">
          <Calculator className="w-3.5 h-3.5" />
          Free Tool · Lighting
        </span>
        <h1 className="text-4xl sm:text-5xl font-black mb-5 leading-tight tracking-tight">
          Lumen <span className="gradient-text">Calculator</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl leading-relaxed mb-10">
          How many lumens — and how many fixtures — does a space need? Enter the
          room size and use, and get an instant estimate based on the same{" "}
          <strong className="text-gray-200">IES &amp; EN 12464-1</strong>{" "}
          illuminance levels we apply to professional lighting documentation.
        </p>

        <LumenCalculator />

        <div className="tools-prose mt-16">
          <h2>Recommended lux levels by space type</h2>
          <p>
            Lighting standards define a <em>maintained illuminance</em> for each
            task. These are the values built into the calculator — drawn from{" "}
            EN 12464-1 (Europe) and IES recommendations (US):
          </p>
          <table className="lux-table">
            <thead>
              <tr>
                <th>Space</th>
                <th>Lux</th>
                <th>Footcandles</th>
              </tr>
            </thead>
            <tbody>
              {LUX_TABLE.map(([space, lux, fc]) => (
                <tr key={space}>
                  <td>{space}</td>
                  <td>{lux}</td>
                  <td>{fc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>How the calculation works</h2>
          <p>
            The calculator uses the <strong className="text-gray-200">lumen
            method</strong>: required installed lumens = (target lux × area) ÷
            (utilization factor × maintenance factor). The utilization factor
            accounts for how much light actually reaches the work plane; the
            maintenance factor accounts for lumen depreciation and dirt over
            time. It&apos;s an excellent planning estimate — but a real project
            still needs a point-by-point photometric layout and a compliant
            submittal, which is exactly what we do at Lumen Studio.
          </p>

          <h2>Frequently asked questions</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="faq-item">
              <h3>{f.q}</h3>
              <p style={{ marginBottom: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-electric/5 border border-electric/20 rounded-3xl p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            From estimate to spec-ready documentation
          </h2>
          <p className="text-gray-400 mb-7 max-w-xl mx-auto">
            If you sell or specify lighting, Lumen Studio turns raw product data
            into catalogs, spec sheets, and compliant submittals — accurate,
            on-brand, and built to win.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/lumen#contact"
              className="inline-flex items-center justify-center gap-2 bg-electric text-white px-7 py-3.5 rounded-2xl font-bold hover:bg-blue-500 transition-colors"
            >
              Work with Lumen Studio
            </Link>
            <Link
              href="/luxarmonie"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-3.5 rounded-2xl font-bold hover:border-electric/50 hover:text-electric transition-colors"
            >
              See a case study
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <p className="text-gray-700 text-xs uppercase tracking-[0.4em]">
          © 2026 DIEGO QUINDE ·{" "}
          <Link href="/" className="hover:text-electric transition-colors">
            diegoquinde.com
          </Link>
        </p>
      </footer>
    </div>
  );
}

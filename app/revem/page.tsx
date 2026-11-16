import type { Metadata } from "next";
import Link from "next/link";
import "./revem.css";

export const metadata: Metadata = {
  title: "Case Study: Revem — One Product Master, Every Touchpoint · Diego Quinde",
  description:
    "How Diego Quinde built two lighting brands from zero and a product-data system where one 514-SKU master feeds catalogs, spec sheets, packaging, labels and a QR page for every product.",
  openGraph: {
    title: "Case Study: Revem — One Product Master, Every Touchpoint",
    description:
      "Two brands built from zero, one product master, every touchpoint: catalogs, spec sheets, factory packaging, labels and QR traceability.",
    type: "article",
    url: "https://diegoquinde.com/revem",
    images: ["https://diegoquinde.com/assets/revem/dieline-1.jpg"],
  },
};

const stats = [
  { n: "514", l: "SKUs in one product master" },
  { n: "3 days → 30 min", l: "Offers and pre-sale quotes" },
  { n: "2 h → 15 min", l: "Traceability at assembly" },
  { n: "227", l: "Pages in the technical catalog" },
];

const outputs = [
  { k: "Catalogs", d: "Technical (227 pp), profiles, projects ES/EN, decorative" },
  { k: "Spec sheets", d: "55 technical sheets from the same fields" },
  { k: "Packaging", d: "Dielines and master boxes for factories in China" },
  { k: "Labels", d: "Barcode per variant, master label standard" },
  { k: "QR pages", d: "A public product page for every SKU" },
  { k: "Quotes", d: "Offers and pre-sales built from product data" },
];

const decisions = [
  {
    t: "One product master as the source of truth",
    d: "A single table of 514 SKUs and 26 fields: electrical, photometric, mechanical, packaging, warranty, plus hero photo, diagram and polar curve. Every output reads from it instead of being edited by hand.",
    trade:
      "More work up front cleaning and normalizing supplier data. In return, a spec fix happens once and reaches every touchpoint.",
  },
  {
    t: "Templates instead of one-off layouts",
    d: "Catalog pages and labels are templates with data fields: InDesign data merge, plus a custom Illustrator script I wrote that fills {{Column}} placeholders from a CSV.",
    trade:
      "Less layout freedom per product. Much faster, and the 227-page catalog stays consistent from first page to last.",
  },
  {
    t: "QR codes that depend only on the SKU",
    d: "The code encodes the SKU, not the content. Labels go to print before a product page is finished, and the page fills in later without reprinting. Empty fields are simply hidden.",
    trade:
      "The public domain has to be fixed before the first print run: change it and every printed code breaks.",
  },
  {
    t: "Designed for the factory floor",
    d: "QR printed in brand charcoal on white with error-correction level Q, so it still reads with about 25% of the code damaged, on label material we tested for adhesion.",
    trade:
      "Less visual freedom on the label. It has to survive ten years on a luminaire, not look good in a mockup.",
  },
  {
    t: "One catalog per audience",
    d: "Instead of one book for everyone: a full technical catalog for distributors, a projects catalog (also in English) for specifiers, and separate profile and decorative catalogs.",
    trade:
      "More documents to keep in sync, which only works because they all draw from the same master.",
  },
];

export default function Page() {
  return (
    <div className="rv">
      <nav className="rv-nav">
        <div className="rv-wrap rv-nav-in">
          <Link href="/" className="rv-mark">
            Diego Quinde
          </Link>
          <Link href="/lumen#projects" className="rv-back">
            ← All projects
          </Link>
        </div>
      </nav>

      <header className="rv-wrap rv-hero">
        <p className="rv-eyebrow">Case study · Revem, Ecuador · 2025 – present</p>
        <h1>
          One product master,
          <br />
          every touchpoint.
        </h1>
        <p className="rv-lede">
          Revem is a commercial LED lighting company in Ecuador. I joined in
          January 2025, when it had no brand, no catalog and no packaging
          standard. I built the company brand, its product brand Aura
          Iluminación LED, and a system where one product database feeds
          every catalog, spec sheet, box, label and QR page. In January 2026
          I was promoted to Director of Design &amp; Marketing for that
          automation work.
        </p>
        <dl className="rv-stats">
          {stats.map((s) => (
            <div key={s.l}>
              <dt>{s.n}</dt>
              <dd>{s.l}</dd>
            </div>
          ))}
        </dl>
      </header>

      <figure className="rv-wrap rv-figure rv-figure-wide">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/revem/dieline-1.jpg"
          alt="Print-ready dieline for the Aura Polaris 100W streetlight box, with spec table, barcodes per variant and certification marks"
        />
        <figcaption>
          Print-ready dieline for the Aura Polaris 100W streetlight box, sent to
          the factory in China. Spec table, barcodes and certification marks
          come from the product master.
        </figcaption>
      </figure>

      <main className="rv-wrap rv-body">
        <section className="rv-section">
          <h2>The problem</h2>
          <div className="rv-cols">
            <p>
              A new company selling hundreds of luminaires (streetlights,
              floodlights, panels, LED strips, aluminium profiles, decorative
              lamps) to contractors, specifiers and online buyers, with nothing
              to present them with.
            </p>
            <p>
              The first materials were made by hand. A change to one
              product&apos;s specs meant editing the catalog, the spec sheet,
              the box and the label separately. A single offer for a customer
              took me about three days to put together.
            </p>
          </div>
        </section>

        <section className="rv-section">
          <h2>My role</h2>
          <div className="rv-cols">
            <p>
              First designer, from January 2025. Promoted to Director of Design
              &amp; Marketing in January 2026. I worked with sales, purchasing
              and our factories in China.
            </p>
            <ul className="rv-list">
              <li>Both brands, from zero: Revem and Aura Iluminación LED</li>
              <li>Product data model and the 514-SKU master</li>
              <li>Catalog system, spec sheets, packaging and label standard</li>
              <li>QR traceability system, built in Python</li>
              <li>AI product imagery and launch campaigns</li>
            </ul>
          </div>
        </section>

        <section className="rv-section">
          <h2>The system</h2>
          <p className="rv-intro">
            Everything starts in one table. Nothing downstream is typed by hand.
          </p>
          <div className="rv-flow" aria-label="Product master feeding six outputs">
            <div className="rv-source">
              <span className="rv-label">Source</span>
              <strong>Product master</strong>
              <span>514 SKUs × 26 fields</span>
            </div>
            <div className="rv-arrow" aria-hidden="true" />
            <ul className="rv-outputs">
              {outputs.map((o) => (
                <li key={o.k}>
                  <strong>{o.k}</strong>
                  <span>{o.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rv-section">
          <h2>Key decisions and trade-offs</h2>
          <ol className="rv-decisions">
            {decisions.map((d, i) => (
              <li key={d.t}>
                <span className="rv-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{d.t}</h3>
                  <p>{d.d}</p>
                  <p className="rv-trade">
                    <span>Trade-off</span> {d.trade}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rv-section">
          <h2>The work</h2>
          <div className="rv-gallery">
            <figure className="rv-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/revem/catalog-cover-001.jpg" alt="Cover of the Revem 2026 technical catalog" />
              <figcaption>Technical catalog, 227 pages, July 2026 edition.</figcaption>
            </figure>
            <figure className="rv-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/revem/catalog-page-011.jpg" alt="Catalog family opener for floor luminaires" />
              <figcaption>Family openers set context before the spec pages.</figcaption>
            </figure>
            <figure className="rv-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/revem/profiles-02.jpg" alt="Profiles catalog page with dimensioned cross-sections for two aluminium profiles" />
              <figcaption>Profiles catalog: dimensioned sections and pack data per SKU. Three revisions shipped in nine days.</figcaption>
            </figure>
            <figure className="rv-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/revem/nexus-2.jpg" alt="Technical spec sheet for the Nexus modular floodlight" />
              <figcaption>One of 55 spec sheets, built from the same fields as the catalog.</figcaption>
            </figure>
            <figure className="rv-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/revem/projects-cover-1.jpg" alt="Cover of the English projects catalog" />
              <figcaption>Projects catalog in English, for specifiers and international buyers.</figcaption>
            </figure>
            <figure className="rv-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/revem/aura-box.jpg" alt="Packaging render of an Aura LED bulb box" />
              <figcaption>Aura Iluminación LED, the product brand I created. Packaging render.</figcaption>
            </figure>
          </div>
        </section>

        <section className="rv-section rv-qr">
          <div>
            <h2>A QR on every product</h2>
            <p>
              Each luminaire carries a code that opens its own public page:
              specs, warranty, master box and a quote button on WhatsApp. The
              goal is that every product stays identifiable, with a record that
              lasts its ten-year life. Registering products at assembly went
              from about two hours to under fifteen minutes.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rv-qr-code"
            src="/assets/revem/qr-aph-01100.svg"
            alt="QR code for product APH-01100"
          />
        </section>

        <section className="rv-section">
          <h2>Outcome</h2>
          <ul className="rv-results">
            <li>
              <strong>3 days → under 30 min</strong>
              <span>to put together an offer or pre-sale quote</span>
            </li>
            <li>
              <strong>2 h → under 15 min</strong>
              <span>to register products for traceability at assembly</span>
            </li>
            {/* TODO(diego): confirm the period and what else ran alongside before publishing */}
            <li>
              <strong>~$5K → $200K</strong>
              <span>sales on the launch using AI product imagery, against a typical day</span>
            </li>
            <li>
              <strong>Promoted</strong>
              <span>to Director of Design &amp; Marketing, January 2026, for the automation work</span>
            </li>
          </ul>
        </section>

        <section className="rv-section rv-tools">
          <h2>Tools</h2>
          <p>
            Adobe Illustrator and InDesign · ExtendScript · Python · Vercel ·
            generative AI for product imagery · WhatsApp sales agent on Jelou
          </p>
        </section>
      </main>

      <footer className="rv-wrap rv-foot">
        <Link href="/">diegoquinde.com</Link>
        <Link href="/lumen#projects">← All projects</Link>
      </footer>
    </div>
  );
}

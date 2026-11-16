import type { Metadata } from "next";
import Link from "next/link";
import "../case-study.css";

export const metadata: Metadata = {
  title: "Case Study: Luxarmonie — Fix the Listing, Keep the Sale · Diego Quinde",
  description:
    "How Diego Quinde audited and rebuilt the technical data of a French lighting e-commerce catalog: returns fell from 33% to 14% and monthly sales grew from €30K to €45K between April and June 2026.",
  openGraph: {
    title: "Case Study: Luxarmonie — Fix the Listing, Keep the Sale",
    description:
      "A 170-product Shopify catalog audited and rebuilt in French. Returns 33% → 14%, monthly sales €30K → €45K, April–June 2026.",
    type: "article",
    url: "https://diegoquinde.com/luxarmonie",
  },
};

const stats = [
  { n: "33% → 14%", l: "Return rate, April – June 2026" },
  { n: "€30K → €45K", l: "Monthly sales, same period" },
  { n: "170", l: "Products audited on Shopify" },
  { n: "7 → 1", l: "Passes to finish one product" },
];

const fixes = [
  { p: "Elantia wall light", f: "Variants", b: "6", a: "18 (6 motifs × 3 colour temperatures)" },
  { p: "Elantia wall light", f: "Dimensions", b: "“27cm-23cm” / “60 cm”", a: "Ø 30 cm × H 32 cm" },
  { p: "Elantia wall light", f: "Material", b: "“Metal”", a: "Aluminium body, silicone diffuser" },
  { p: "Square wall light", f: "Variants", b: "2", a: "12 (2 colours × 3 CCT × 2 voltages)" },
  { p: "Square wall light", f: "Power / flux", b: "6 W / 420 lm", a: "12 W / ~840 lm" },
  { p: "Zephyria wall light", f: "Base", b: "Metal", a: "Natural wood (walnut)" },
];

const decisions = [
  {
    t: "Audit first, automate second",
    d: "Every product got one tracking row with 18 fields: variants before and after, errors found, spec sheet, French description, photos, SEO and status. The product manager could see each fix, product by product.",
    trade:
      "A slower start. In return, every change was visible and countable instead of disappearing into the store.",
  },
  {
    t: "Every value cites its source; nothing is guessed",
    d: "Each spec sheet lists where every value came from: the supplier listing, the manufacturer's document, the public store. Anything I couldn't confirm went into a “to verify with supplier” list instead of the listing.",
    trade:
      "Some sheets shipped with gaps. A missing value costs a question; a wrong lumen figure costs a return.",
  },
  {
    t: "Treat the variant matrix as arithmetic",
    d: "Colours × colour temperatures × voltages has to equal the number of variants on sale. When it didn't, buyers could order a combination that didn't exist, or not find the one that did.",
    trade:
      "More variants to set up and photograph per product, but each one maps to a real SKU.",
  },
  {
    t: "One pass per product",
    d: "I built a Claude Code workflow with a written standards guide: structured input in, then supplier research, the French spec sheet, the Shopify HTML description, the variant check and the tracking-sheet update in one run. It replaced five to seven back-and-forths per product.",
    trade:
      "Days spent on the commands and the standards guide before the first product went faster.",
  },
  {
    t: "Leave the client's tracking alone",
    d: "The product manager's sheet stayed read-only. My work landed in a separate deliverable sheet, so nothing I did could break how their team tracked launches.",
    trade:
      "One more sheet to check, and zero risk to their process.",
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
        <p className="rv-eyebrow">Case study · Luxarmonie, France · March – June 2026</p>
        <h1>
          Fix the listing,
          <br />
          keep the sale.
        </h1>
        <p className="rv-lede">
          Luxarmonie is a French e-commerce store for decorative lighting, with
          around 170 products sourced from factories in China. Its listings had
          the wrong variants, materials, sizes and colour temperatures, so
          customers received something different from what they ordered. I
          audited and rebuilt the technical data of the whole catalog in French.
          Between April and June 2026, returns fell from 33% to 14% and monthly
          sales grew from €30K to €45K.
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

      <main className="rv-wrap rv-body">
        <section className="rv-section">
          <h2>The problem</h2>
          <div className="rv-cols">
            <p>
              One in three orders came back. Products were listed from whatever
              the supplier page said, in mixed languages and units, and nobody
              had checked them against the actual product.
            </p>
            <p>
              A lamp sold as metal arrived in wood. A wall light listed with one
              colour temperature existed in three. Variant menus offered
              combinations that didn&apos;t exist and hid ones that did. Each of
              those is a disappointed customer and a return paid by the store.
            </p>
          </div>
        </section>

        <section className="rv-section">
          <h2>My role</h2>
          <div className="rv-cols">
            <p>
              Remote technical product specialist, from March 2026, working with
              the store&apos;s product manager. After the spec sheets were done
              I stayed on for Spanish-language customer support.
            </p>
            <ul className="rv-list">
              <li>Technical audit of the 170-product Shopify catalog</li>
              <li>Spec sheets and Shopify descriptions, written in French</li>
              <li>Variant matrices rebuilt against real SKUs</li>
              <li>The Claude Code workflow and standards guide behind it</li>
              <li>Product-by-product tracking sheet as the deliverable</li>
            </ul>
          </div>
        </section>

        <section className="rv-section">
          <h2>What was wrong</h2>
          <p className="rv-intro">
            Real corrections from the audit, before and after.
          </p>
          <div className="rv-table-wrap">
            <table className="rv-table">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Field</th>
                  <th scope="col">Listed</th>
                  <th scope="col">Corrected</th>
                </tr>
              </thead>
              <tbody>
                {fixes.map((x) => (
                  <tr key={x.p + x.f}>
                    <td>{x.p}</td>
                    <td>{x.f}</td>
                    <td className="rv-before">{x.b}</td>
                    <td>{x.a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <p className="rv-intro">
            An excerpt of one spec sheet, as delivered. Every value carries its
            source; what couldn&apos;t be confirmed is listed, not invented.
          </p>
          <div className="rv-sheet" lang="fr">
            <div className="rv-sheet-head">
              <span className="rv-label">Fiche technique</span>
              <strong>Astra · Applique murale contemporaine, chrome</strong>
            </div>
            <table className="rv-table">
              <thead>
                <tr>
                  <th scope="col">Champ</th>
                  <th scope="col">Valeur</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Type de luminaire</td><td>Applique murale intérieure</td><td>Titre produit Shopify</td></tr>
                <tr><td>Matériau</td><td>Métal chromé (corps)</td><td>Finition déclarée</td></tr>
                <tr><td>Alimentation</td><td>110–240 V AC, 50/60 Hz</td><td>Standard</td></tr>
                <tr><td>Indice de protection</td><td>IP20</td><td>Usage intérieur</td></tr>
                <tr><td>Variantes</td><td>3 coloris × 1 format = 3</td><td>Matrice validée</td></tr>
              </tbody>
            </table>
            <div className="rv-sheet-todo">
              <span className="rv-label">À vérifier avec le fournisseur</span>
              <p>Dimensions · Puissance (W) · Flux lumineux (lm) · CCT · Poids · Garantie</p>
            </div>
          </div>
        </section>

        <section className="rv-section">
          <h2>Outcome</h2>
          <ul className="rv-results">
            <li>
              <strong>33% → 14%</strong>
              <span>return rate, April to June 2026</span>
            </li>
            <li>
              <strong>€30K → €45K</strong>
              <span>monthly sales over the same three months</span>
            </li>
            <li>
              <strong>7 → 1</strong>
              <span>passes to finish a product, down from five to seven back-and-forths</span>
            </li>
            <li>
              <strong>Kept on</strong>
              <span>for Spanish-language customer support after the catalog work ended</span>
            </li>
          </ul>
        </section>

        <section className="rv-section rv-tools">
          <h2>Tools</h2>
          <p>
            Shopify · Claude Code with custom commands · Python · Google Sheets
            API · supplier research on Alibaba · writing in French
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

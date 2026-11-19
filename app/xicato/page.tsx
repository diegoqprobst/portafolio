import type { Metadata } from "next";
import Link from "next/link";
import "../case-study.css";

export const metadata: Metadata = {
  title: "Case Study: Xicato — Datasheets You Can Specify From · Diego Quinde",
  description:
    "How Diego Quinde, as a contract technical documentation specialist for Xicato, built sales training and product datasheets for a new LED tape-light line and narrowed hundreds of order codes to a launch shortlist.",
  openGraph: {
    title: "Case Study: Xicato — Datasheets You Can Specify From",
    description:
      "Sales training, six product datasheets and a SKU shortlist for a new LED tape-light line, for a US premium lighting brand.",
    type: "article",
    url: "https://diegoquinde.com/xicato",
  },
};

const stats = [
  { n: "6", l: "Product datasheets, 8–14 pages each" },
  { n: "~2 dozen", l: "Products in the sales training deck" },
  { n: "~⅓", l: "Order codes kept for the launch shortlist" },
  { n: "Under budget", l: "First project, against a 15-hour budget" },
];

const decisions = [
  {
    t: "Win the pitch by admitting where the competitor wins",
    d: "The entry test was a one-slide pitch to move a customer from a rival downlight to the client's. On efficacy and lifetime the rival was better on paper, so I said so and built the pitch on range and versatility instead.",
    trade:
      "A less aggressive slide. It was also the one claim nobody could knock down, and it won the contract over the other candidates.",
  },
  {
    t: "Treat source conflicts as one problem, not many",
    d: "Five of the six products had numbers that didn't match between their source datasheet and the product presentation: lumens, colour rendering, maximum run length. Instead of asking about each value, I raised it as a data-quality issue with a list, each item with its source document and page.",
    trade:
      "One longer email up front, instead of dozens of small questions that would have stalled each datasheet.",
  },
  {
    t: "Show what's missing; never fill it in",
    d: "When a value wasn't confirmed, it went into the datasheet marked as pending, with a numbered list of open items for the lead engineer. Nothing was inferred from older documents.",
    trade:
      "Drafts that looked unfinished. The one time I inferred a value (a warranty term from an older sheet) it was wrong, which confirmed the rule.",
  },
  {
    t: "Content from the specification, format from the template",
    d: "The client's datasheet format and its product specification disagreed in places. I kept them separate: the published format decided layout, the engineering specification decided every value, part-number structure included.",
    trade:
      "More cross-checking per page, and no datasheet that looks right but contradicts engineering.",
  },
  {
    t: "Make the SKU cut a rule, not a debate",
    d: "To cut hundreds of order codes to a launch shortlist, every code went through the same questions in order: has engineering already decided? does a code exist? is it in the sales deck? does it beat its closest sibling? Uncertain cases went back as explicit questions.",
    trade:
      "Less room for judgment calls. In return, every keep or drop has a reason the engineer can check in seconds.",
  },
];

const pages = [
  "Cover and certifications",
  "Features and SKU builder",
  "Custom options",
  "Specifications",
  "Profile drawing",
  "Photometry",
  "Accessories and drivers",
  "Warnings and warranty",
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
        <p className="rv-eyebrow">Case study · Xicato, United States · 2026 – present</p>
        <h1>
          Datasheets you
          <br />
          can specify from.
        </h1>
        <p className="rv-lede">
          Xicato makes premium LED light sources for architectural lighting in
          the US. For a new LED tape-light line, I built the internal sales
          training, then the product datasheets that lighting designers specify
          from, then a shortlist of which order codes to launch. The work
          depends on one thing: every number on the page has to be true.
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
              A lighting designer picks a product from its datasheet and writes
              it into a project specification. If the lumens, the maximum run
              length or the warranty on that sheet are wrong, the error shows up
              on a construction site, months later, with the brand&apos;s name
              on it.
            </p>
            <p>
              The source documents for the new line disagreed with each other,
              the datasheet format was never handed to me, and the part numbers
              didn&apos;t exist yet. The sales team
              also needed to understand the products before launch.
            </p>
          </div>
        </section>

        <section className="rv-section">
          <h2>My role</h2>
          <div className="rv-cols">
            <p>
              Contract technical documentation specialist, remote, hired after a
              competitive test in July 2026. I work with the marketing lead and
              the line&apos;s lead engineer.
            </p>
            <ul className="rv-list">
              <li>Internal sales training deck for the full line</li>
              <li>Six product datasheets in the brand&apos;s published format</li>
              <li>Supplier data verification and open-item lists</li>
              <li>SKU shortlist with a reason for every keep and drop</li>
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
          <h2>Anatomy of a datasheet</h2>
          <p className="rv-intro">
            The structure each datasheet follows. Files stay with the client
            under confidentiality; this is the shape of the work, not the work.
          </p>
          <ol className="rv-pages">
            {pages.map((p, i) => (
              <li key={p}>
                <span className="rv-num">{String(i + 1).padStart(2, "0")}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rv-section">
          <h2>Outcome</h2>
          <ul className="rv-results">
            <li>
              <strong>Won the contract</strong>
              <span>over the other candidates, on the strength of the honest pitch</span>
            </li>
            <li>
              <strong>Under budget</strong>
              <span>first project: product benefits for the whole line, approved before the deck began</span>
            </li>
            <li>
              <strong>1 → 6</strong>
              <span>the first datasheet was approved and engineering green-lit the other five</span>
            </li>
            <li>
              <strong>Scope keeps growing</strong>
              <span>from one sales deck to datasheets and the launch SKU shortlist</span>
            </li>
          </ul>
        </section>

        <section className="rv-section rv-tools">
          <h2>Tools</h2>
          <p>
            PowerPoint and Word templates · Python for deck and slide builds ·
            Excel for the SKU base · photometric files · PDF review
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

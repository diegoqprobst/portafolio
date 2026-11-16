# Case study draft — Revem: one product master, every touchpoint

> Draft for diegoquinde.com and the A.Team follow-up. Items marked **[confirm]** come from memory notes or file dates and need Diego's OK before publishing. Nothing here uses prices, suppliers, purchase orders or import reports.

## One-line summary

I joined Revem, a commercial LED lighting company in Ecuador, when it was starting from zero. I built both the Revem brand and its in-house product brand Aura Iluminación LED from scratch, along with the whole product-presentation system: one product database that feeds the brand, the catalogs, the spec sheets, the packaging and labels, and a QR page for every SKU.

## The problem

- A new lighting company with hundreds of SKUs (streetlights, floodlights, panels, LED strips, profiles, decorative lamps), and no brand, no catalog, no spec sheets and no packaging standard.
- Every touchpoint was produced by hand: a change to one product's specs meant editing the catalog, the spec sheet, the box and the label separately. Errors and inconsistent data reached customers and factories.
- Sales (contractors, specifiers, e-commerce) needed accurate technical data fast, often over WhatsApp.

## My role and what I owned

- **Role:** first designer, later Director of Design & Marketing (April 2024 – present).
- **Owned end to end, built from zero:** both brands — Revem (the company) and Aura Iluminación LED (its product brand: logo, brand manual, type system Jost + Manrope), product data model, catalog system, spec sheets, packaging dielines and label standard for factories in China, QR traceability site, AI product imagery.
- **Worked with:** sales, purchasing, and factories in China. **[confirm: anyone else on the design side?]**

## Key decisions and trade-offs

1. **One product master as the source of truth.** A single table of 514 SKUs × 26 fields (electrical, photometric, mechanical, packaging, warranty, plus hero photo, diagram and polar curve). Every output reads from it instead of being edited by hand.
   *Trade-off:* more effort up front to clean and normalize data from suppliers; in return, a spec fix happens once.
2. **Templates over one-off layouts.** Catalog pages and labels are templates with data fields (InDesign data merge, plus a custom Illustrator script that fills `{{Column}}` placeholders from a CSV).
   *Trade-off:* less layout freedom per product, much faster and more consistent output.
3. **QR codes that depend only on the SKU, not the content.** Labels can go to print before the product page is complete; the page updates later without reprinting. Empty fields are simply hidden.
   *Trade-off:* the public domain has to be fixed before the first print run, because a domain change breaks every printed code.
4. **Built for the factory floor.** QR printed in brand charcoal on white with error correction level Q (survives ~25% damage), on label material tested for adhesion.
5. **Separate catalogs per audience** instead of one book: a 227-page full technical catalog, a profiles catalog, a projects catalog (also in English) and a decorative-lamps catalog. **[confirm the reasoning]**

## Process and tools

Adobe Illustrator and InDesign (catalogs, dielines, labels), ExtendScript (Illustrator automation), Python (data build, QR generation, static product site), Vercel (hosting), generative AI for product imagery and context scenes, WhatsApp sales agent on Jelou fed by the same product data **[confirm]**.

## Outcome

Verified from files:
- 514 SKUs in a single product master, each with its own QR code and public product page.
- 227-page technical catalog, plus profiles, projects (ES + EN) and decorative catalogs.
- 55 technical spec sheets.
- Profiles catalog shipped in three revisions in nine days (Sep 30 – Oct 8, 2026).
- Packaging dielines and labels in production with factories in China since 2025.

Confirmed by Diego (2026-11-16):
- **Traceability at assembly: ~2 h → under 15 min.** Goal: every product stays identifiable, with a record that lasts its 10-year life.
- **Offers and pre-sale quotes: ~3 days → under 30 min.**

Dropped (no data to back them): the "AI-imagery products sold out" claim and the old CV figures (10x, ~30%, +25%).

## Visuals to include

1. Before / after: an early hand-made sheet next to the templated version.
2. Data → output diagram: product master → catalog page, spec sheet, label, box, QR page.
3. Aura brand: logo, brand-manual spread, box with the new logo.
4. Catalog spreads (technical + projects EN).
5. One dieline (e.g. Polaris 100W streetlight) and the master label.
6. QR label printed on a product, plus the phone view of its product page.
7. AI product imagery next to the original photo.

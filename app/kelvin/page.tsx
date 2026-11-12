import type { Metadata } from "next";

import KelvinPlayer from "./KelvinPlayer";
import "./kelvin-page.css";

// Kelvin: a Video.js v10 skin Diego designed for reviewing light in video.
// One project among several on the site (see the umbrella profile at /).
const TITLE = "Kelvin · A Video.js skin for looking at light — Diego Quinde";
const DESCRIPTION =
  "Kelvin is a Video.js v10 skin styled like an instrument from a mid-century technical catalog: a loupe and measuring tools (colour, apparent CCT, stops between two points, areas and lengths), a colour timeline, an exposure map and a sheet with notes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://diegoquinde.com/kelvin" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "https://diegoquinde.com/kelvin", type: "article" },
};

const CONTEST_URL = process.env.NEXT_PUBLIC_KELVIN_DEMO_URL;

export default function Page() {
  return (
    <div className="kvp">
      <header className="kvp-masthead">
        <h1>Kelvin</h1>
        <p className="kvp-lede">
          A video player for looking at light. It plays quietly, with one row of controls, and when you pause it becomes
          an instrument for reading the frame.
        </p>
      </header>

      <main>
        <section className="kvp-stage" aria-label="Kelvin player">
          <KelvinPlayer specimen />
          <p className="kvp-caption">
            <span>Plate I–III</span> Sea lions in the shallows. Pause, then move over the picture.
          </p>
        </section>

        <section className="kvp-grid">
          <article>
            <h2>Why I built it</h2>
            <p>
              My work sits between lighting and technical documentation: catalogs, spec sheets, packaging for LED
              products. When I review video, I want to know the colour of a surface and how warm a light is, and I want to
              leave a note on the exact frame. Ordinary players hide that behind screenshots and other apps.
            </p>
          </article>
          <article>
            <h2>The idea</h2>
            <p>
              The skin is drawn like a technical drawing of an optical instrument: drafting ink on navy, a ruled grid,
              engraved lamps and lenses. Blue and orange are the two lighting correction gels, CTB for daylight and CTO
              for tungsten, so the same axis is the temperature scale. Orange only marks what is live, and every other
              colour stays inside the dials, swatches and colour strip.
            </p>
          </article>
          <article>
            <h2>What it does</h2>
            <ul>
              <li>
                <strong>Loupe and tools.</strong> A drafting crosshair with magnifier, exact colour and apparent CCT; compare
                two points in stops, measure an area&apos;s uniformity, or set a scale and measure lengths.
              </li>
              <li>
                <strong>Exposure map.</strong> False colour by luminance zone, from crushed shadows to clipped highlights.
              </li>
              <li>
                <strong>Colour timeline.</strong> The seek track printed with the video&apos;s own dominant colours.
              </li>
              <li>
                <strong>Specimen sheet.</strong> On pause, the frame becomes a drawing sheet with palette, three spectral
                dials and notes, exportable as CSV.
              </li>
            </ul>
          </article>
        </section>

        <section className="kvp-notes">
          <h2>Built with care for</h2>
          <p>
            Honest readings: relative luminance and stops, never lux, because a video file carries no exposure or
            calibration. Full keyboard use, visible focus, contrast checked against bright and dark frames, nothing communicated by
            colour alone, and respect for reduced motion, reduced transparency, high contrast and forced colours. Built
            on Video.js v10 and released under Apache 2.0.
            {CONTEST_URL ? (
              <>
                {" "}
                <a href={CONTEST_URL}>Open the standalone demo</a>.
              </>
            ) : null}
          </p>
        </section>
      </main>
    </div>
  );
}

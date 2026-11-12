import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/skin.css';
import './demo.css';
import { KelvinGlyph } from '@/video/kelvin/mark';
import { Player } from '../frame/player';

const KEYS: [string, string][] = [
  ['Space · K', 'Play or pause'],
  ['1 · 2 · 3 · 4', 'Point · A–B compare · Area · Ruler (while paused)'],
  ['E', 'Exposure map on or off'],
  ['X', 'Aim with the keyboard'],
  ['← ↑ → ↓', 'Move the reticle · Shift for fine steps'],
  ['Enter', 'Set: a note, point A, or the start and end of an area or ruler'],
  ['P', 'Pin the current measurement as a note'],
  ['Esc', 'Step back: keyboard aim → pointer → close the sheet'],
  ['F · M · C', 'Fullscreen · mute · captions'],
];

function GlyphOnPaper() {
  // The glyph reads its colours from the skin's tokens; give it the same tokens on the page.
  return (
    <span className="demo-glyph">
      <KelvinGlyph size={40} />
    </span>
  );
}

function Demo() {
  return (
    <div className="demo">
      <header className="demo-masthead">
        <div className="demo-brand">
          <GlyphOnPaper />
          <h1>Kelvin</h1>
        </div>
        <p className="demo-lede">
          A Video.js skin for looking at light. It plays like a quiet player and, when you pause, becomes an instrument.
        </p>
      </header>

      <main>
        <section className="demo-stage" aria-label="Player">
          <Player />
          <p className="demo-caption">
            <span>Plate I–IV</span> Daylight, shallows, dusk and stage light. Pause anywhere, then move over the picture.
          </p>
        </section>

        <section className="demo-columns">
          <article>
            <h2>Loupe</h2>
            <p>
              Pause and a drafting crosshair follows your pointer: a magnified patch, the exact colour and its apparent
              colour temperature as the camera recorded it. Switch tools with 1–4 to compare two points in stops, draw an
              area for its uniformity, or set a scale and measure lengths. E lays an exposure map over the frame.
            </p>
          </article>
          <article>
            <h2>Colour timeline</h2>
            <p>
              The seek track is printed with the video's own dominant colours, slice by slice, like a strip of colour
              samples. You can see where a scene warms or cools before you get there. Notes appear as small pennants.
            </p>
          </article>
          <article>
            <h2>Specimen sheet</h2>
            <p>
              Pausing turns the frame into a drawing sheet: the picture is framed, never covered, and beside it sit the
              chapter, timecode, palette, three spectral dials for temperature, hue and luminance, and your notes, with a
              CSV export.
            </p>
          </article>
        </section>

        <section className="demo-spec">
          <div>
            <h2>Why blue and orange</h2>
            <p>
              In lighting they are the two correction gels: CTB, blue, for daylight, and CTO, orange, for tungsten.
              Kelvin is drawn in blue, like a technical drawing, and orange marks only what is live: the playhead, the
              reticle, your notes. Every other colour is kept inside a plate, the dials, the swatches and the strip, so
              the colour you see is always data.
            </p>
            <p>
              During playback there is one row of controls and nothing else. The tools exist only when you stop to look.
            </p>
            <p>
              Every reading comes from the picture, not a light meter. Kelvin gives relative luminance and differences in
              stops, never lux: lux needs the camera's exposure and a calibrated reference, which a video file does not
              carry. Lengths stay in pixels until you give it a known length.
            </p>
          </div>
          <div>
            <h2>Keys</h2>
            <table className="demo-keys">
              <tbody>
                {KEYS.map(([key, action]) => (
                  <tr key={key}>
                    <th scope="row">
                      <kbd>{key}</kbd>
                    </th>
                    <td>{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="demo-footer">
        <table className="demo-titleblock">
          <caption className="demo-visually-hidden">Drawing title block</caption>
          <tbody>
            <tr>
              <th scope="row">Title</th>
              <td colSpan={3}>Kelvin · Instrument Series No. 1</td>
            </tr>
            <tr>
              <th scope="row">Drawn &amp; filmed</th>
              <td>Diego Quinde</td>
              <th scope="row">Built on</th>
              <td>
                <a href="https://videojs.org">Video.js</a> v10
              </td>
            </tr>
            <tr>
              <th scope="row">Licence</th>
              <td>Apache 2.0</td>
              <th scope="row">Note</th>
              <td>Colour and temperature readings are approximate.</td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  );
}

/**
 * `?hero` stages the cover shot for the portfolio and the submission: only the player, paused on
 * the dusk plate with the loupe on the lamp-lit wall and one note pinned on the warm wall. Development convenience only.
 */
function stageHero() {
  document.documentElement.classList.add('demo-hero');
  try {
    localStorage.setItem(
      'kelvin-notes-v1:kelvin-reel',
      JSON.stringify([
        { id: 'hero', t: 15.7, u: 0.64, v: 0.56, text: 'Wall still warm from the sky', hex: '#8E7A68', cct: 4400 },
      ]),
    );
  } catch {
    /* no storage: the shot just has no pin */
  }
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const run = async () => {
    const video = document.querySelector('video');
    if (!video) return void setTimeout(run, 100);
    video.muted = true;
    // The player may already be seeking to its opening frame: wait on its state, not on a single event.
    while (video.readyState < 2 || video.seeking) await wait(100);
    if (!document.querySelector('.kv[data-sheet]')) {
      // No specimen opening (a small player, or a browser that held the frame back): stage it by hand.
      video.currentTime = 15.7;
      await video.play().catch(() => undefined);
      await wait(250);
      video.pause();
      video.currentTime = 15.7;
    }
    await wait(900);
    const layer = document.querySelector('.kv-loupe-layer');
    const rect = video.getBoundingClientRect();
    layer?.dispatchEvent(
      new PointerEvent('pointermove', { bubbles: true, clientX: rect.left + rect.width * 0.95, clientY: rect.top + rect.height * 0.75 }),
    );
    document.documentElement.dataset.heroReady = '';
  };
  void run();
}

if (new URLSearchParams(location.search).has('hero')) stageHero();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);

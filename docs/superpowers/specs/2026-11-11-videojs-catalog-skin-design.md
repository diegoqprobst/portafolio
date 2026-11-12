# Video.js v10 skin — "Kelvin" (industrial catalog instrument)

Status: draft for Diego's approval · 2026-11-11
Deadline: Contra Video.js Skins Design Challenge, **Nov 16 2026, 11:59pm PST**. Target submission Nov 15; Nov 16 is buffer only.

## 1. Intent and why

Diego (psychologist, technical documentation and lighting/packaging designer, runs Lumen Studio) is entering the Video.js Skins Design Challenge on Contra ($5k/$3k/$2k; judges Sam Potts — Plyr — and Steve Heffernan — Video.js/Mux).

He wants three things from one piece of work, in this order:

1. **A player he would really use**: technical, precise, for *reviewing* video (look at the light, read a colour, leave a note), not just watching.
2. **A portfolio piece** for diegoquinde.com that shows his actual craft: technical documentation that looks beautiful. The skin will also play his own automation demo videos there.
3. **A strong contest entry.**

Committed concept (Diego's words: "vamos con lo técnico, me comprometo"): the player is **a scientific/industrial instrument from a mid-20th-century technical catalog** — paper, printing-ink blue, carbon, halftone, condensed engineering type — that behaves like a precise modern tool. Diego's own moodboard (board 2, "Inspiración: del catálogo técnico al diseño interactivo") is the visual reference. Principles from that board: *precisión técnica, robustez industrial, modernismo funcional, textura de catálogo*.

**Blue + orange** (Diego: "ese azul queda espectacular con el naranja") is not decoration: in lighting they are the two correction gels — CTB (cool/daylight) and CTO (warm/tungsten). Blue is the structure of the UI; orange is what is *live*; and the blue→orange axis doubles as the colour-temperature scale for the measuring tools.

### Reference boards

- Board 2 (the direction): `docs/superpowers/specs/assets/kelvin-board-2-catalog.jpg`. Cream paper page laid out like a 1940s corporate technical publication. The player sits in a rounded rectangle with a blue (#4B4FA4) header band (wordmark left, series title in spaced caps, a line-drawn figure — to be replaced with an original mark), a black-and-white picture, and a blue bottom bar: pause icon, `02:14 / 06:38`, a thin seek track with a round metal knob, volume icon + short slider, fullscreen. Top-right of the picture: three small square outlined buttons stacked vertically (CC, settings, fullscreen). "Detalle técnico" shows the knob as a bevelled steel ball on a recessed track, three states (normal flat, hover lighter, active pressed/darker), and the track split into *reproducido / buffer / restante* as three distinct fills. Components are square blue tiles with cream icons, slightly rounded. A chapter overlay variant shows "Capítulo 2" small over "Sistemas de enfoque" in large serif, bottom-left on the picture. Principles row uses a crosshair icon for precision.
- Board 1 (only one idea taken): `docs/superpowers/specs/assets/kelvin-board-1-blueprint.jpg`. Dark blueprint with an overloaded three-row control area (rejected). Keep only the **semicircular gauges** (half-dial with tick ring and needle) as read-outs inside the pause sheet.

## 2. Previous attempt (what we learned)

`prototype-cue/` is a throwaway spike (lighting-console look + "excavation notebook" look). Diego rejected both looks: "hay funciones que no funcionan, ocupan demasiado espacio". It proved in Chromium, with a Mux stream, that we can:

- read video pixels via canvas (colour, approximate CCT, approximate Munsell, histogram);
- keep per-video notes in localStorage and export CSV;
- apply SVG/CSS filters;
- lock controls visible while a panel is open (`store.requestControlsLock()`), and close panels with Escape returning focus.

Known defects there (do not repeat): deck took 19–53% of player height; panels covered a third of the width; the probe had no keyboard targeting; hotkeys were all disabled while a panel was open; module-level mutable globals; selector-specificity bugs against the scaffold's `@scope` CSS; native checkboxes inheriting `color-scheme: light dark`. **Reuse the proven logic, not the layout or structure.**

## 3. Goals

- G1. During playback only **one slim control bar** is visible (the bar in board 2): play/pause, time, seek, volume/mute, captions, settings, fullscreen. No second or third row, ever.
- G2. Three review tools, each appearing only when needed:
  - **Loupe ("La Lupa")** — a precision reticle (crosshair from board 2's "precisión técnica" icon). While paused (or when toggled on), it follows the pointer and shows a magnified patch, exact colour (hex/RGB), approximate colour temperature on a blue→orange scale, and lets the user drop a note pinned to that point and time. Must be operable by keyboard (move the reticle with arrow keys, confirm with Enter) and by touch (tap to place).
  - **Colour timeline** — the seek bar is printed as a strip of the video's actual colours over time, like a row of catalog swatches, so you can see where the scene warms or cools. Played/buffered/remaining (board 2 detail) must still be readable on top of it.
  - **Pause sheet ("Ficha de pausa")** — when paused, the frame is framed as a catalog spec page: chapter title, timecode, a colour palette of the frame, temperature reading, and the notes for this moment. The semicircular gauges from Diego's board 1 can appear here as read-outs. It never appears during playback.
- G3. Chapters (from a WebVTT chapters track) shown on the timeline and in the pause sheet. For Diego's automation videos, chapters = steps.
- G4. Playback rate available (Diego uses 2x on Telegram).
- G5. Meets every contest minimum: plays video; play/pause, seek, time, volume/mute, fullscreen; responsive; fully keyboard operable; every menu/panel can be exited.
- G6. Accessibility to the level the judges' own guidance asks: text ≥ 4.5:1, icons/track/thumb/focus ≥ 3:1 over bright, dark and busy frames; targets ≥ 24×24 (larger on touch); visible focus; controls stay visible while something inside has focus; state never by colour alone; `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast`, `forced-colors` handled; no hard-coded UI copy (i18n-ready), RTL and long labels don't break.
- G7. Bonus points: video hosted on **Mux** with a public playback ID kept live through judging (+1); skin used on a real live site — **diegoquinde.com** (+1).
- G8. Looks good with two kinds of content: Diego's own footage of light (contest demo) and screen recordings of automations (portfolio).

## 4. Non-goals (this version)

- Colour-vision (daltonism) simulation filters and brightness/dimmer control — cut to keep the three tools polished. Possible later.
- A dark theme variant, a mental-health-themed variant — later, on the same base.
- Custom UI in iPhone native fullscreen (iOS uses the system player; accepted).
- Accurate colorimetry. Temperature and colour readings are labelled approximate.
- Multi-user notes, accounts, or any backend. Notes live in the browser.

## 5. Anti-goals (would be a failure even if it works)

- Looks like a form or dashboard placed over the video (the prototype's failure).
- Tools that eat screen space during playback.
- Any Union Carbide (or other real company) name, "UCC" lettering, or the flying-man figure from the moodboard. The brand must be original.
- Halftone/texture over the picture. Texture lives only on the chrome (bars, sheet, frame).
- Generic 2025 player tropes the judges are tired of: frosted glass + big radii, gradient-only bottom bar, Inter as the house font.
- Copying another player's icons. One original icon set.
- Orange used for small text on paper (fails contrast).

## 6. Constraints

- Video.js v10, React: `@videojs/react@10.3.0`, created with `npx @videojs/cli skin create` (React, CSS, scaffold base, video preset). Follow the CLI project's `AGENTS.md`: edit only `src/`, run `npm run typecheck` and `npm run build`. Keep `data-theme`/`data-preset`, error dialog, hotkeys, gestures, status announcer from the scaffold.
- Pixel reading requires same-origin/CORS video: Mux with `crossOrigin=""` works in Chromium. Safari is untested and must be tested.
- Entry is licensed Apache 2.0; all assets (fonts, icons, footage) must be redistributable.
- Footage: Diego's own single clip (see §9, "Demo video"). No stock microscopes from the moodboard.
- Diego must join the challenge himself (license checkbox) and create the Mux account himself. Nothing is published, deployed or committed without his say-so.
- Schedule: Nov 11 design · Nov 12–13 build skin · Nov 14 portfolio page · Nov 15 test (Chrome, Safari, iPhone, keyboard, screen reader spot-check) + deploy + Mux + written description · Nov 16 buffer.

## 7. Visual system (decided)

From Diego's board 2, plus orange:

| Token | Value | Role |
|---|---|---|
| Industrial blue | `#4B4FA4` | structure: bars, headings, icons, frame |
| Technical paper | `#E6D6B8` | chrome surfaces, pause sheet |
| Carbon | `#2B2B2B` | text on paper, dark surfaces |
| Halftone | 15–30% overlay | texture on chrome only |
| Orange (CTO) | builder picks exact value | what is live: playhead/knob active state, loupe reticle, open tool, notes, warm end of temperature scale |

- Typography: a **condensed geometric** face for headings/labels/UI caps (spirit of Trade Gothic/DIN, spaced uppercase) and a **catalog serif** for descriptions, chapter text and metadata (spirit of Garamond/Caslon). Must be open-licensed and self-hosted. Numbers tabular.
- Seek thumb: the physical metal **knob** from board 2 with normal/hover/active states; pressing feels immediate.
- Layout variants from board 2: standard 16:9, and chapter overlay ("Capítulo 2 — Sistemas de enfoque" style) — the overlay is how chapter titles appear.
- Header band with the skin's own mark and series title, as in board 2 — but it must not cost video area during playback (builder decides: hide with controls, or shown only on poster/pause).

## 8. Name and brand (my call — Diego can change)

Working name **"Kelvin"** (colour temperature unit; ties blue/orange and lighting). Original mark and wordmark in the catalog spirit. Series line like "Instrument Series No. 1". Treat as provisional.

## 9. Other calls I made (Diego can change)

- New skin project created with the CLI (e.g. `kelvin/`), not built on `prototype-cue/`. Port the proven pixel-reading, CCT estimate, notes storage and CSV export, rewritten cleanly.
- UI copy in English (judges), structured for translation; Spanish later.
- Notes: localStorage per video, CSV export kept as a small action inside the pause sheet.
- Public demo page on Vercel for the submission.
- **diegoquinde.com integration is in scope for Nov 15 (Diego decided).** My calls: a new route `/kelvin` in this repo's Next.js 15 app — a short case-study page in the site's voice with the live player (same Mux playback ID as the contest page). The skin is copied into the app as source (no package publishing), its CSS scoped so it is immune to `globals.css`. If Diego sends an automation screen recording with chapters before Nov 14, it is added as a second video on that page; otherwise the page ships with the demo clip only. Deploying the site still needs Diego's go-ahead at the time. Budget ~1 day (Nov 14).
- Mobile: tools work by tap; at narrow widths fullscreen/secondary controls move up to give the seek bar room (Video.js default pattern).

- **Pause behaviour:** pausing shows the pause sheet automatically, but as a *frame around* the picture, never over it: a paper margin/strip (side at wide widths, below at narrow) carrying chapter, timecode, palette, gauges and notes, while the picture shrinks slightly inside it and stays fully visible. The loupe is active over the picture while paused (pointer follows; `L` or a button gives keyboard reticle mode). Focus order while paused: bar → picture/loupe → sheet. Escape or play closes the sheet. The loupe is a paused-only tool; there is no loupe mode during playback.
- **Notes during playback:** only small orange ticks on the colour timeline (with shape, not colour alone). No pins on the picture while playing; pins show while paused.
- **Demo video (Diego decided: this one only):** `/Users/diego/Code/Video Js/IMG_7877.MOV` — 12.4 s, 1920×1080, 29.97 fps, H.264 SDR BT.709, with AAC audio. Sea lions swimming in clear, sunlit shallow water beside a rocky breakwater and pier; strong caustics on the sand. Its average colour barely changes (#788990–#7f8f94 per second, cool grey-blue), and it has no warm light. Consequences (my calls):
  - The colour timeline shows, for each time slice, a **stacked band of the 3–5 dominant colours** (water cyan, sand beige, rock dark…) rather than one average colour, so it reads as a rich printed swatch strip even with stable footage, and still shows change on other videos.
  - The temperature read-out uses the blue→orange scale anyway: the warm sand and the cool water give real contrast for the loupe within the same frame.
  - Three in-shot chapters (English titles in the catalog voice, drafted by me, approved by Diego), and the player loops naturally; no autoplay.
  - Keep the audio track (volume/mute must work); Diego to confirm it has no voices he doesn't want published.
- **Colour data:** the colour strip and per-chapter palettes for the demo video are pre-computed at build time and shipped as JSON, so they work in every browser. The live loupe reads pixels where the browser allows; where it can't (possibly Safari), it shows a clear "reading unavailable in this browser" state. That fallback is acceptable for the contest.
- **Submission page:** a branded demo page, not the stock workbench. Editing `apps/preview/` for this is intended, despite AGENTS.md's "only `src/`" guidance (which is about generator compatibility).
- **Build for reuse:** the skin must not assume Vite-only features and its CSS must be scoped so it survives the portfolio's `globals.css` (which leaks element and `#id` selectors).

## 10. Left to the builder

- Exact orange, fonts, icon drawings, motion curves and durations (menus grow from their trigger, interruptible, closing quieter than opening; motion collapses under reduced motion).
- How the colour timeline is computed: pre-computed for the demo video at build time, built progressively while playing, or from Mux storyboard thumbnails if CORS allows. Must degrade gracefully (plain track) when pixels are unreadable.
- How the loupe and pause sheet are arranged at narrow widths and in portrait.
- Settings menu contents beyond rate and captions.
- Review all states from the official skill checklist: poster, playing, paused, buffering, ended, idle, error; narrowest, widest, portrait; each user preference.

## 11. Submission deliverables

- Public URL (no login) with the player playing Diego's footage from Mux.
- One visual (hero image) and a short written description of the design thinking: catalog instrument, CTB/CTO colour logic, tools that appear only when needed, accessibility decisions.
- Skin source, Apache 2.0.

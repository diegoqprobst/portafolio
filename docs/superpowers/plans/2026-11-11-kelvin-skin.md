# Kelvin Skin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "Kelvin", a Video.js v10 React skin styled as a mid-century industrial catalog instrument, with three paused-time review tools (loupe, colour timeline, pause sheet), ship it as the contest demo page and as `/kelvin` on diegoquinde.com.

**Architecture:** A fresh CLI-generated skin project at `kelvin/` (worktree root). Pure logic (colour math, palette extraction, colour strip data, notes, reticle movement, paused-mode reducer) lives in `kelvin/src/video/kelvin/lib/` and is unit-tested with Vitest. React components in `kelvin/src/video/kelvin/` consume it; the colour strip for the demo video is pre-computed by a Node script with ffmpeg and shipped as JSON. The portfolio copies `kelvin/src` into `components/kelvin/` with a sync script.

**Tech Stack:** `@videojs/react@10.3.0`, `@videojs/cli@10.3.0`, React 19, Vite (skin workbench), Vitest, tsx, ffmpeg (local, `/opt/homebrew/bin/ffmpeg`), Next.js 15 (portfolio), Mux.

**Spec:** `docs/superpowers/specs/2026-11-11-videojs-catalog-skin-design.md` (reference boards in `docs/superpowers/specs/assets/`).

## Global Constraints

- Deadline Nov 16 2026 11:59pm PST; target submission Nov 15. Schedule: Nov 12–13 skin (Tasks 1–11), Nov 14 portfolio (Task 13), Nov 15 states/a11y/Safari, demo deploy, submission (Tasks 12, 14).
- Video.js packages pinned at `10.3.0`. Keep scaffold's `data-theme`/`data-preset`, `ErrorDialog`, hotkeys, gestures, `StatusAnnouncer`.
- During playback only ONE control row is visible. No second row, ever.
- Colours: blue `#4B4FA4` (structure), paper `#E6D6B8` (chrome surfaces, sheet), carbon `#2B2B2B` (text on paper, dark surfaces), halftone overlay 15–30% on chrome only — never over the picture. Orange = what is live (playhead/knob active, reticle, open tool, notes, warm end of scale). Orange is never used for small text on paper.
- Contrast: text ≥ 4.5:1; icons, track, thumb, focus ring ≥ 3:1. Targets ≥ 24×24 px (≥ 44×44 on `(pointer: coarse)`). State never by colour alone.
- Handle `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more`, `forced-colors: active`. RTL and long labels must not break layout.
- All UI copy comes from `KelvinLabels` (English defaults); no hard-coded strings in components.
- Fonts: open-licensed, self-hosted. Builder's call fixed here: **Barlow Condensed** (headings, labels, UI caps; `@fontsource/barlow-condensed` weights 500/600) and **Libre Caslon Text** (descriptions, chapter titles, metadata; `@fontsource/libre-caslon-text` 400/400-italic). Numbers use `font-variant-numeric: tabular-nums`.
- No Union Carbide name, "UCC" lettering, or flying-man figure. Original "Kelvin" mark only. One original icon set; no copied player SVGs.
- Avoid: frosted glass + big radii, gradient-only bottom bar, Inter.
- Colour/temperature readings are labelled approximate ("≈").
- Demo media: `/Users/diego/Code/Video Js/IMG_7877.MOV` (12.4 s, 1920×1080, 29.97 fps, SDR BT.709, AAC audio). No autoplay; loop on.
- Nothing is committed, deployed or published without Diego's explicit OK. At the start of execution, ask Diego once whether the per-task commit steps are approved; if not, skip them. Deploys (Tasks 12, 13) always ask at the time.
- After every task: `npm run typecheck`, `npm test`, `npm run build` inside `kelvin/` all pass.

## Review Focus

1. Pixel reads blocked (CORS, tainted canvas, Safari, video not yet decoded) → loupe shows the "reading unavailable" state, nothing throws. Pinned by `safeReadPixel` tests in Task 7.
2. `localStorage` unavailable, full, or holding corrupt JSON → notes still work in memory for the session and nothing crashes. Pinned by notes tests in Task 5.
3. Keyboard while paused: Escape always leaves the loupe, then the sheet, and focus returns to the play button; Space/K still toggle play while the sheet is open; arrow keys move the reticle only in reticle mode and seek otherwise. Pinned by `modeReducer` and `routeKey` tests in Task 6.
4. Narrow player (320 px wide) and portrait (360×640): the single row does not overflow and the seek track stays ≥ 120 px wide; the sheet moves below the picture. Pinned by the browser checks in Tasks 8 and 11.
5. A video with no colour strip, or a strip whose duration doesn't match (portfolio automation videos) → plain track, no errors; `sliceAt` clamps out-of-range times. Pinned by `parseColorStrip`/`sliceAt` tests in Task 4.

---

### Task 1: Scaffold `kelvin/` with tests, local media and chapters

**Files:**
- Create: `kelvin/` via CLI
- Modify: `kelvin/package.json` (add `vitest`, `tsx`, fontsource deps, `"test": "vitest run"`)
- Create: `kelvin/vitest.config.ts`, `kelvin/src/video/kelvin/lib/smoke.test.ts`
- Create: `kelvin/apps/preview/public/media/sea-lions.mp4` (git-ignored), `kelvin/apps/preview/public/kelvin-chapters.vtt`
- Modify: `kelvin/apps/preview/src/frame/player.tsx`, `kelvin/.gitignore`, `.claude/launch.json`

**Interfaces:**
- Produces: project at `kelvin/`, dev server config `"kelvin"` on port 5274; media at `./media/sea-lions.mp4`, chapters at `./kelvin-chapters.vtt`.

- [ ] **Step 1:** From worktree root run `npx @videojs/cli@10.3.0 skin create kelvin --name kelvin --framework react --styling css --base scaffold --preset video --package-manager npm`. Expected: `kelvin/skin.json` with `"name": "kelvin"`.
- [ ] **Step 2:** `cd kelvin && npm i -D vitest tsx && npm i @fontsource/barlow-condensed @fontsource/libre-caslon-text`; add `"test": "vitest run"`; `vitest.config.ts` resolves `@` → `./src`, environment `node`.
- [ ] **Step 3:** Write `smoke.test.ts` (`expect(1).toBe(1)`); run `npm test`. Expected: 1 passed.
- [ ] **Step 4:** Transcode: `ffmpeg -i "/Users/diego/Code/Video Js/IMG_7877.MOV" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart kelvin/apps/preview/public/media/sea-lions.mp4`. Add `apps/preview/public/media/` to `kelvin/.gitignore`.
- [ ] **Step 5:** Write `kelvin-chapters.vtt` with three cues: `00:00.000 --> 00:04.200` "Plate I — Approach", `00:04.200 --> 00:08.300` "Plate II — Surface", `00:08.300 --> 00:12.400` "Plate III — Shallows". (Draft titles; Diego approves in Task 14.)
- [ ] **Step 6:** In `player.tsx` use `<Video src="./media/sea-lions.mp4" crossOrigin="" playsInline loop>` (the plain `Video` media element from `@videojs/react/video`) with the chapters track; keep `MuxVideo` import ready for Task 12. Poster: `ffmpeg -ss 6 -i … -frames:v 1 -vf scale=1280:-1 kelvin/apps/preview/public/media/poster.webp`.
- [ ] **Step 7:** Add launch config `"kelvin"`: `npm --prefix kelvin run dev -- --port 5274 --strictPort`. Start it; Expected: workbench plays the sea-lion clip with 3 chapter segments on the stock scaffold skin.
- [ ] **Step 8:** `npm run typecheck && npm run build`. Expected: both pass.
- [ ] **Step 9: Commit** `feat(kelvin): scaffold skin project with demo media`.

### Task 2: Colour math and design tokens

**Files:**
- Create: `kelvin/src/video/kelvin/lib/color.ts`, `color.test.ts`, `kelvin/src/video/kelvin/lib/tokens.ts`, `tokens.test.ts`

**Interfaces:**
- Produces:
  - `type RGB = { r: number; g: number; b: number }` (0–255 ints)
  - `toHex(c: RGB): string` → `"#RRGGBB"` uppercase; `fromHex(hex: string): RGB`
  - `relativeLuminance(c: RGB): number` (WCAG 2.x); `contrastRatio(a: RGB, b: RGB): number`
  - `estimateCct(c: RGB): number | null` — port of `prototype-cue/src/video/cue/panels.tsx:24-37` (McCamy; null if max < 24, saturation > 0.45, or outside 1500–12000 K)
  - `temperaturePosition(kelvin: number): number` — 0 = blue/cool, 1 = orange/warm, linear in mired: `clamp((1e6/kelvin - 100) / 400, 0, 1)`
  - `TOKENS = { blue: '#4B4FA4', paper: '#E6D6B8', carbon: '#2B2B2B', orange: <builder picks> }` in `tokens.ts`

- [ ] **Step 1: Write failing tests**
```ts
expect(toHex({ r: 75, g: 79, b: 164 })).toBe('#4B4FA4');
expect(fromHex('#e6d6b8')).toEqual({ r: 230, g: 214, b: 184 });
expect(contrastRatio(fromHex('#FFFFFF'), fromHex('#000000'))).toBeCloseTo(21, 1);
expect(estimateCct({ r: 255, g: 255, b: 255 })).toBeGreaterThan(6200);
expect(estimateCct({ r: 255, g: 255, b: 255 })).toBeLessThan(6800);
expect(estimateCct({ r: 255, g: 190, b: 120 })).toBeLessThan(4000);
expect(estimateCct({ r: 0, g: 0, b: 255 })).toBeNull();
expect(estimateCct({ r: 10, g: 10, b: 10 })).toBeNull();
expect(temperaturePosition(2000)).toBe(1);
expect(temperaturePosition(10000)).toBe(0);
expect(temperaturePosition(1000)).toBe(1); // clamp
// tokens.test.ts
const t = Object.fromEntries(Object.entries(TOKENS).map(([k, v]) => [k, fromHex(v)]));
expect(contrastRatio(t.carbon, t.paper)).toBeGreaterThanOrEqual(4.5);
expect(contrastRatio(t.paper, t.blue)).toBeGreaterThanOrEqual(4.5); // paper text on blue bar
expect(contrastRatio(t.orange, t.carbon)).toBeGreaterThanOrEqual(3);
expect(contrastRatio(t.orange, t.blue)).toBeGreaterThanOrEqual(3); // knob active on blue bar
```
- [ ] **Step 2:** Run `npm test`; Expected: FAIL (modules missing).
- [ ] **Step 3:** Implement `color.ts` and `tokens.ts`. Pick an orange that passes both orange assertions (start near `#F08A3C`; if it fails against blue, lighten it — never darken the blue).
- [ ] **Step 4:** Run `npm test`; Expected: PASS. If `paper on blue` fails, report it — do not change the spec's blue/paper without Diego.
- [ ] **Step 5: Commit** `feat(kelvin): colour math and tokens`.

### Task 3: Dominant-colour palette extraction

**Files:**
- Create: `kelvin/src/video/kelvin/lib/palette.ts`, `palette.test.ts`

**Interfaces:**
- Consumes: `RGB`, `toHex` (Task 2)
- Produces: `type Swatch = { hex: string; share: number }`; `dominantColors(pixels: Uint8Array | Uint8ClampedArray, channels: 3 | 4, k = 5): Swatch[]` — sorted by share desc, shares sum to 1 (±0.001), empty input → `[]`.

Algorithm (fixed so the build script and browser agree): bucket each pixel into a 5-bit-per-channel histogram; sort buckets by count; walk them, merging a bucket into an accepted swatch if its mean RGB is within Euclidean distance 28 of that swatch's running mean (count-weighted), else accept it as a new swatch; stop accepting new swatches at `k` (remaining buckets merge into the nearest); renormalise shares.

- [ ] **Step 1: Write failing tests**
```ts
// 75 % #2050A0, 25 % #E0C090, RGB
const px = makePixels([[0x20,0x50,0xa0,75],[0xe0,0xc0,0x90,25]]);
const s = dominantColors(px, 3);
expect(s).toHaveLength(2);
expect(s[0].share).toBeCloseTo(0.75, 2);
expect(s[1].share).toBeCloseTo(0.25, 2);
expect(s[0].hex).toBe('#2050A0'); // or within distance 8 — assert via fromHex distance < 8
expect(dominantColors(new Uint8Array(), 3)).toEqual([]);
expect(dominantColors(randomPixels(5000, seed=1), 4, 5).length).toBeLessThanOrEqual(5);
// near colours merge: #2050A0 and #2252A2 → one swatch
```
- [ ] **Step 2:** Run; Expected: FAIL.
- [ ] **Step 3:** Implement `dominantColors` per the algorithm above.
- [ ] **Step 4:** Run; Expected: PASS.
- [ ] **Step 5: Commit** `feat(kelvin): dominant colour palette`.

### Task 4: Colour strip data + build script

**Files:**
- Create: `kelvin/src/video/kelvin/lib/color-strip.ts`, `color-strip.test.ts`, `kelvin/scripts/build-colorstrip.ts`
- Create (output): `kelvin/apps/preview/public/kelvin-colorstrip.json`
- Modify: `kelvin/package.json` (`"colorstrip": "tsx scripts/build-colorstrip.ts"`)

**Interfaces:**
- Consumes: `dominantColors`, `estimateCct`, `relativeLuminance`, `RGB`
- Produces:
```ts
type ColorSlice = { t: number; swatches: Swatch[]; meanHex: string; cct: number | null; luminance: number };
type ColorStrip = { version: 1; duration: number; step: number; slices: ColorSlice[] };
parseColorStrip(json: unknown): ColorStrip | null; // validates shape; null on anything wrong
sliceAt(strip: ColorStrip, time: number): ColorSlice; // clamps time to [0, duration]
stripMatches(strip: ColorStrip, mediaDuration: number): boolean; // |Δ| ≤ max(0.5, step)
```
- Script: `npm run colorstrip -- <input> <output.json> [--step 0.25]` — runs `ffmpeg -i <input> -vf fps=1/<step>,scale=64:36:flags=area -f rawvideo -pix_fmt rgb24 -`, splits into 64×36×3 frames, computes per slice `dominantColors(frame, 3, 5)`, mean colour, `estimateCct(mean)`, mean relative luminance; duration from `ffprobe`.

- [ ] **Step 1: Write failing tests**
```ts
expect(parseColorStrip({ nope: 1 })).toBeNull();
expect(parseColorStrip(null)).toBeNull();
const strip = parseColorStrip(fixture)!; // fixture: duration 2, step 1, slices t=0,1
expect(sliceAt(strip, -5).t).toBe(0);
expect(sliceAt(strip, 99).t).toBe(1);
expect(sliceAt(strip, 1.4).t).toBe(1);
expect(stripMatches(strip, 2.3)).toBe(true);
expect(stripMatches(strip, 60)).toBe(false);
```
- [ ] **Step 2:** Run; Expected: FAIL.
- [ ] **Step 3:** Implement `color-strip.ts` and the script.
- [ ] **Step 4:** Run tests; Expected: PASS.
- [ ] **Step 5:** `npm run colorstrip -- "/Users/diego/Code/Video Js/IMG_7877.MOV" apps/preview/public/kelvin-colorstrip.json`. Expected: `slices.length` = 50, `duration` ≈ 12.4, each slice has 2–5 swatches, at least one sand-like warm swatch (r > b) somewhere.
- [ ] **Step 6: Commit** `feat(kelvin): colour strip data and build script`.

### Task 5: Notes store

**Files:**
- Create: `kelvin/src/video/kelvin/lib/notes.ts`, `notes.test.ts`

**Interfaces:**
- Produces:
```ts
type Note = { id: string; t: number; u: number; v: number; text: string; hex: string | null; cct: number | null };
type NoteStorage = Pick<Storage, 'getItem' | 'setItem'>;
notesKey(videoId: string): string;              // `kelvin-notes-v1:${videoId}`
loadNotes(storage: NoteStorage | null, videoId: string): Note[];  // [] on null/throw/corrupt
saveNotes(storage: NoteStorage | null, videoId: string, notes: Note[]): boolean; // false on throw
addNote(notes: Note[], draft: Omit<Note, 'id'>, id: string): Note[]; // returns new array sorted by t
removeNote(notes: Note[], id: string): Note[];
notesToCsv(notes: Note[]): string;  // header: time,x,y,hex,cct_k,text ; RFC 4180 quoting
```

- [ ] **Step 1: Write failing tests** — `loadNotes(null,'a')` → `[]`; storage whose `getItem` throws → `[]`; `getItem` returns `'{bad'` → `[]`; round-trip save/load equal; `saveNotes` with throwing `setItem` returns `false`; `addNote` keeps order by `t`; `notesToCsv` of a note with text `He said "hi", then left` produces `"He said ""hi"", then left"`; time formatted `00:04.20`; null hex/cct → empty cells.
- [ ] **Step 2:** Run; FAIL. **Step 3:** Implement. **Step 4:** Run; PASS.
- [ ] **Step 5: Commit** `feat(kelvin): notes store`.

### Task 6: Paused-mode reducer, key routing and reticle movement

**Files:**
- Create: `kelvin/src/video/kelvin/lib/mode.ts`, `mode.test.ts`

**Interfaces:**
- Produces:
```ts
type Mode = { sheet: boolean; loupe: 'off' | 'pointer' | 'keyboard'; reticle: { u: number; v: number } };
type ModeEvent = { type: 'pause' } | { type: 'play' } | { type: 'loupeKeyboard' } | { type: 'pointer'; u: number; v: number } | { type: 'escape' } | { type: 'move'; key: 'ArrowUp'|'ArrowDown'|'ArrowLeft'|'ArrowRight'; fine: boolean };
INITIAL_MODE: Mode; // { sheet:false, loupe:'off', reticle:{u:0.5,v:0.5} }
modeReducer(state: Mode, event: ModeEvent): Mode;
routeKey(mode: Mode, key: string): 'loupe' | 'player' | 'escape'; // what should handle a keydown
```
Rules: `pause` → sheet on, loupe `pointer`. `play` → INITIAL (keeps reticle). `loupeKeyboard` (key `L`) → loupe `keyboard` only while sheet on. `escape`: keyboard→pointer… precisely: if loupe `keyboard` → `pointer`; else if sheet → sheet off + loupe off; else no change. `move` in keyboard mode: step 0.02 (0.005 when `fine`), clamp [0,1]; ignored otherwise. `routeKey`: Escape → `'escape'`; arrows/Enter in keyboard mode → `'loupe'`; everything else → `'player'` (so Space/K/F/M still reach the scaffold hotkeys — fixes the prototype bug that disabled all hotkeys).

- [ ] **Step 1: Write failing tests** for each rule above, including: `escape` twice from keyboard mode ends with `sheet:false, loupe:'off'`; `move` at u=0.995 Right → 1; `routeKey(sheetOpenPointer,' ')` → `'player'`; `routeKey(keyboardMode,'ArrowLeft')` → `'loupe'`; `routeKey(sheetOpenPointer,'ArrowLeft')` → `'player'`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Commit** `feat(kelvin): paused mode reducer and key routing`.

### Task 7: Kelvin container, labels, safe pixel reads

**Files:**
- Create: `kelvin/src/video/kelvin/state.tsx`, `kelvin/src/video/kelvin/labels.ts`, `kelvin/src/video/kelvin/lib/pixels.ts`, `pixels.test.ts`
- Modify: `kelvin/src/video/skin.tsx`

**Interfaces:**
- Consumes: Tasks 4–6.
- Produces:
```ts
// labels.ts
type KelvinLabels = { brand: string; series: string; loupe: string; loupeHint: string; readingUnavailable: string;
  temperature: string; luminance: string; palette: string; notes: string; addNote: string; deleteNote: string;
  exportCsv: string; closeSheet: string; chapter: string; approx: string; noNotes: string };
DEFAULT_LABELS: KelvinLabels; // English, brand "Kelvin", series "Instrument Series No. 1"
// pixels.ts
type PixelReading = { status: 'ok'; rgb: RGB } | { status: 'blocked' } | { status: 'notReady' };
safeReadPixel(read: () => RGB | null, video: { readyState: number }): PixelReading;
// readyState < 2 → notReady; read throws (SecurityError etc.) → blocked; read returns null → blocked
readPatch(video: HTMLVideoElement, u: number, v: number, size: number): ImageData | null; // canvas drawImage, used by loupe magnifier
// state.tsx
KelvinContainer(props: ContainerPrimitive.Props & { videoId: string; colorStrip?: ColorStrip | string; labels?: Partial<KelvinLabels> });
useKelvin(): { mode: Mode; dispatch(e: ModeEvent): void; labels: KelvinLabels; strip: ColorStrip | null;
  notes: Note[]; addNote(d: Omit<Note,'id'>): void; removeNote(id: string): void; videoId: string };
// skin.tsx
VideoSkinProps gains: videoId: string; colorStrip?: ColorStrip | string; labels?: Partial<KelvinLabels>
```
`KelvinContainer` dispatches `pause`/`play` from `usePlayer((s) => s.paused)` only after `s.started`; while `mode.sheet`, holds `store.requestControlsLock()` (pattern: `prototype-cue/src/video/cue/state.tsx:132-195`); fetches the strip when given a URL and keeps it only if `parseColorStrip` succeeds and `stripMatches` the media duration; notes persisted via Task 5 with `window.localStorage` wrapped in try/catch (null if access throws). No module-level mutable state.

- [ ] **Step 1: Write failing tests** for `safeReadPixel`: readyState 1 → `notReady`; read throws `new DOMException('x','SecurityError')` → `blocked`; returns null → `blocked`; returns rgb → `ok`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement all files; `skin.tsx` swaps `Container` for `KelvinContainer`, keeps scaffold children, removes nothing yet.
- [ ] **Step 4:** PASS; typecheck/build pass; workbench still plays.
- [ ] **Step 5: Commit** `feat(kelvin): container, labels, safe pixel reads`.

### Task 8: Visual system and the single control row

**Files:**
- Create: `kelvin/src/video/kelvin/kelvin.css`, `kelvin/src/video/kelvin/icons.tsx`, `kelvin/src/video/kelvin/mark.tsx`, `kelvin/src/video/kelvin/bar.tsx`, `kelvin/src/video/kelvin/chapter-overlay.tsx`, `kelvin/src/video/kelvin/tokens.css.test.ts`
- Modify: `kelvin/src/video/skin.tsx`, `kelvin/src/video/controls.tsx` (re-export `KelvinBar` as `VideoControls`)

**Interfaces:**
- Consumes: `TOKENS`, `useKelvin`, scaffold shared buttons (`PlayButton`, `MuteButton`, `FullscreenButton`, `CaptionsButton`, settings menu).
- Produces: `KelvinBar({ renderThumbnail })`; icons `IconPlay, IconPause, IconVolume, IconMute, IconCaptions, IconSettings, IconFullscreen, IconFullscreenExit, IconLoupe, IconNote, IconClose` (24-grid, one stroke weight, filled play/pause/volume — outline failed for those per the official guidance); `KelvinMark` (original wordmark + reticle glyph); `ChapterOverlay` (shows "Plate I" small caps + title in Libre Caslon large, bottom-left, for 2.5 s on chapter change while playing; hidden under reduced motion fade → instant).

Layout rules:
- Row order (source = visual): Play · Time (`current / duration`) · Seek (flex) · Volume (mute + short slider) · Captions · Settings (rate 0.5–2 incl. 1.75, captions) · Fullscreen. PiP omitted.
- Bar: blue surface, paper icons, halftone texture on the bar only, small radius (≤ 6 px), inset 1px highlight + layered low-opacity shadows to separate from the picture.
- Seek thumb = steel knob: radial-gradient ball with bevel; states normal / hover (`@media (hover:hover)` only) / active (pressed: darker, 1px down, orange ring). Orange ring also on `:focus-visible`.
- Header band (blue, `KelvinMark` + series in spaced caps) is visible on poster and while paused only; hidden while playing.
- Controls stay visible while anything inside has `:focus-visible` (`:has(:focus-visible)`).
- Container queries: below 480px inline size, settings + captions collapse into the settings menu; fullscreen moves to top-right; seek track keeps ≥ 120 px.
- Remove the prototype-style extra rows: nothing renders below or above the single row during playback.

- [ ] **Step 1: Write failing test** `tokens.css.test.ts`: reads `kelvin.css` as text and asserts each `TOKENS` value appears as a `--kelvin-*` custom property (`--kelvin-blue: #4B4FA4` etc.), so CSS can't drift from the tested tokens.
- [ ] **Step 2:** FAIL. **Step 3:** Implement CSS (unlayered, scoped under `.media-skin[data-theme="scaffold"] .kelvin` or the skin root class so it beats the scaffold's `@layer components` and survives the portfolio's `globals.css`; set `color-scheme: light` on the skin root and style native inputs explicitly), icons, mark, bar, overlay.
- [ ] **Step 4:** PASS; typecheck/build.
- [ ] **Step 5: Browser check** (dev server `kelvin`, 1280×720 player): bar height ≤ 56 px; only one row visible while playing; Tab reaches every control in visual order with a visible orange focus ring; bar stays visible while focused; at 320 px and 360×640 the row doesn't overflow and the seek track ≥ 120 px (measure with `getBoundingClientRect`). Screenshot each.
- [ ] **Step 6: Commit** `feat(kelvin): catalog visual system and single control row`.

### Task 9: Colour timeline

**Files:**
- Create: `kelvin/src/video/kelvin/color-timeline.tsx`, `kelvin/src/video/kelvin/lib/strip-css.ts`, `strip-css.test.ts`
- Modify: `kelvin/src/video/shared/time-slider.tsx` (render `ColorTimeline` inside the track), `kelvin.css`

**Interfaces:**
- Consumes: `ColorStrip`, `useKelvin().strip`, `useKelvin().notes`
- Produces: `stripBackground(strip: ColorStrip): string` — a CSS `linear-gradient(to right, …)` per stacked band: returns one gradient layer per band index (top band = largest share) composited with `background-size` so each slice is a vertical stack of its swatches proportional to share. `ColorTimeline()` component.

Rendering rules: played part = swatches at full strength; remaining = same swatches under a 55% paper veil; buffered = remaining plus a fine diagonal hatch; played/remaining boundary also marked by the knob, so it isn't colour-only. Track height 10 px (taller hit area 28 px via padding). Notes = small orange downward triangles with carbon outline above the track at each note's `t`, `aria-hidden` (notes are listed accessibly in the sheet). With `strip === null` the scaffold's plain track is used. `forced-colors`: strip hidden, system colours used.

- [ ] **Step 1: Write failing tests** for `stripBackground`: a 2-slice strip with 2 swatches each yields a string containing every swatch hex, starts with `linear-gradient(to right`, and slice boundaries at `50%`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Browser check:** strip visible across the track; played vs remaining distinguishable in grayscale (`filter: grayscale(1)` on page); 3 chapter gaps visible; a note added via devtools `addNote` shows a tick; removing the strip prop shows the plain track with no console errors.
- [ ] **Step 6: Commit** `feat(kelvin): colour timeline`.

### Task 10: Loupe

**Files:**
- Create: `kelvin/src/video/kelvin/loupe.tsx`, `kelvin/src/video/kelvin/temperature-scale.tsx`
- Modify: `kelvin/src/video/skin.tsx`, `kelvin/src/video/behaviors/hotkeys.tsx` (consult `routeKey`), `kelvin/src/video/behaviors/gestures.tsx` (no play-toggle on click while loupe active), `kelvin.css`

**Interfaces:**
- Consumes: `useKelvin` (mode, dispatch, addNote, labels), `safeReadPixel`, `readPatch`, `estimateCct`, `temperaturePosition`, `toHex`.
- Produces: `Loupe()`, `TemperatureScale({ kelvin: number | null })`.

Behaviour: active when `mode.loupe !== 'off'`. Pointer mode follows the pointer over the picture (`pointermove`, rAF-throttled); touch: tap places it. `L` key → keyboard mode, reticle moved by arrows (Shift = fine), Enter opens the note field. Visual: orange crosshair reticle (with carbon outline for contrast on bright water), a circular 2.5× magnifier (~120 px, drawn from `readPatch` into a canvas), and a paper read-out tag beside it: hex, `≈ 5400 K` (or "—"), `TemperatureScale` (blue→orange bar with a carbon marker and a numeric label, never colour-only). Click/Enter → inline note field (textarea, `data-autofocus`), Enter saves via `addNote` with current `t`, u, v, hex, cct; Escape cancels. Reading `blocked` → tag shows `labels.readingUnavailable`, magnifier hidden, notes still allowed. Live region: announce the reading on keyboard moves (debounced 400 ms) via the scaffold `StatusAnnouncer`. Reticle is placed so the tag flips sides near edges (RTL-aware). Reduced motion: no easing on reticle.

- [ ] **Step 1:** Implement (logic already unit-tested in Tasks 2, 6, 7).
- [ ] **Step 2: Browser check:** pause → reticle follows pointer; on sand reading has r > b and temperature marker in the warm half; on water marker in the cool half; `L` + arrows move it, Space still resumes playback, Escape returns to pointer mode then closes; click adds a note that persists after reload; simulate blocked read (devtools: override `CanvasRenderingContext2D.prototype.getImageData` to throw) → "reading unavailable" with no console error; clicking the picture while loupe is active does not toggle playback.
- [ ] **Step 3:** typecheck/build/test pass.
- [ ] **Step 4: Commit** `feat(kelvin): loupe`.

### Task 11: Pause sheet with gauges

**Files:**
- Create: `kelvin/src/video/kelvin/pause-sheet.tsx`, `kelvin/src/video/kelvin/gauge.tsx`, `kelvin/src/video/kelvin/lib/gauge.ts`, `gauge.test.ts`
- Modify: `kelvin/src/video/skin.tsx`, `kelvin.css`

**Interfaces:**
- Consumes: `useKelvin`, `sliceAt`, `notesToCsv`, `usePlayer` (`currentTime`, `chaptersCues`, `paused`), labels.
- Produces: `gaugeAngle(value: number, min: number, max: number): number` (−90 … +90 degrees, clamped; NaN → −90); `Gauge({ label, value, min, max, unit, display })`; `PauseSheet()`.

Layout: when `mode.sheet`, the skin root gets `data-sheet`; the picture scales down (transform, ≤ 0.82) inside a paper page and stays fully visible — the sheet never overlaps the picture. Wide (≥ 720 px): sheet column on the right (~32% width); narrow/portrait: strip below the picture. Contents, top to bottom: chapter ("Plate II" small caps + title in Libre Caslon), timecode (tabular), palette swatches of `sliceAt(strip, t)` with hex labels (carbon text on paper), two half-dial gauges — Temperature (2000–10000 K, from slice `cct`, shows "—" when null) and Luminance (0–100 %), both with tick ring and needle, numeric value always printed; notes for the current chapter (time, text, delete button) — clicking a note's time seeks there and places the reticle at its u,v; "Export CSV" (download `kelvin-notes-<videoId>.csv`). Close button (`labels.closeSheet`) and Escape close it; Play also closes. Focus order: bar → picture/loupe → sheet. Opening animates from the picture edge (transform-origin), closes faster; instant under reduced motion. Without a strip: palette and gauges hidden, chapter/time/notes remain.

- [ ] **Step 1: Write failing tests:** `gaugeAngle(2000,2000,10000)` → −90; `(10000,…)` → 90; `(6000,…)` → 0; `(99999,…)` → 90; `(NaN,…)` → −90.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Browser check:** pause → sheet appears beside picture, no overlap (compare rects); palette matches the frame; gauge needle matches printed values; note list seeks; CSV downloads with the header `time,x,y,hex,cct_k,text`; at 360×640 sheet is below; Escape and Play close it; screen reader spot-check (VoiceOver) reads gauges as "Temperature ≈ 5400 K".
- [ ] **Step 6: Commit** `feat(kelvin): pause sheet with gauges`.

### Task 12: States, accessibility, Safari, demo page, Mux

**Files:**
- Modify: `kelvin.css`, `kelvin/apps/preview/src/frame/player.tsx`, `kelvin/apps/preview/index.html` (branded demo page replacing the stock workbench shell for the deployed build), `kelvin/vite.config.ts` if the entry changes
- Create: `kelvin/apps/preview/src/demo/demo.tsx`, `kelvin/apps/preview/src/demo/demo.css`

**Interfaces:**
- Consumes: `VideoSkin` with `videoId="sea-lions"`, `colorStrip="./kelvin-colorstrip.json"`.

- [ ] **Step 1: States pass** — verify and fix: poster (header band + big play knob), playing, paused (sheet), buffering (throttle network in devtools), ended (sheet stays closed, replay control), idle (controls hide via player activity, not timers), error (break the src; scaffold `ErrorDialog` styled in catalog voice).
- [ ] **Step 2: Preferences pass** — emulate each: reduced motion (no transitions on routed motion tokens), reduced transparency (solid surfaces), `prefers-contrast: more` (carbon outlines thicken, halftone off), `forced-colors: active` (system colours, strip hidden, focus visible), `dir="rtl"` on the page, labels ×2 length via a `labels` override — no overflow.
- [ ] **Step 3: Contrast pass** — sample bar, knob, focus ring and reticle over the brightest (water glare) and darkest (rocks) frames; icons/track/thumb ≥ 3:1, text ≥ 4.5:1 (use `contrastRatio` in the console). Fix any failure.
- [ ] **Step 4: Safari pass** (Safari on macOS + iPhone via the Mac's Simulator or Diego's phone on the deployed preview): playback, single row, sheet, loupe reading or graceful "unavailable", notes, keyboard. Record results in `kelvin/README.md` "Browser support".
- [ ] **Step 5: Demo page** — paper page in the catalog layout (spirit of board 2, original mark): title, one-paragraph design note, the player, a "How to use" list of keys (L, arrows, Enter, Esc, Space), credits ("Footage: Diego Quinde"), Apache-2.0 notice. No login, no tracking.
- [ ] **Step 6: Mux** — ask Diego to create the Mux account and upload `IMG_7877.MOV` with a **public** playback policy, then send the playback ID. Swap `Video` for `MuxVideo` (`src=https://stream.mux.com/<id>.m3u8`, `crossOrigin=""`, poster `https://image.mux.com/<id>/thumbnail.webp?time=6`). Re-run the loupe check (pixel reads from MSE blob).
- [ ] **Step 7: Deploy** — ask Diego; on yes `npm run deploy vercel`. Expected: public URL plays from Mux without login; repeat a quick check of Steps 1–4 on the URL.
- [ ] **Step 8: Commit** `feat(kelvin): states, accessibility, demo page`.

### Task 13: `/kelvin` on diegoquinde.com

**Files:**
- Create: `scripts/sync-kelvin.mjs`, `components/kelvin/**` (generated copy), `app/kelvin/page.tsx`, `app/kelvin/KelvinPlayer.tsx`, `public/kelvin/kelvin-colorstrip.json`, `public/kelvin/kelvin-chapters.vtt`
- Modify: `package.json` (deps `@videojs/react@10.3.0`, `@videojs/core@10.3.0`, `@videojs/mux-video@10.3.0`, fontsource packages; script `"sync:kelvin": "node scripts/sync-kelvin.mjs"`), `next.config.ts` (CSP), `app/sitemap.ts`

**Interfaces:**
- Consumes: `VideoSkin` from `components/kelvin/video/skin`.
- Produces: route `/kelvin`.

- [ ] **Step 1:** `sync-kelvin.mjs` copies `kelvin/src/` → `components/kelvin/`, excluding `*.test.ts`, rewriting imports starting `@/` to relative paths (the site's `@/*` maps to the repo root, not to the skin's `src`). Header comment in each copied file: "Generated from kelvin/src — edit there, then npm run sync:kelvin".
- [ ] **Step 2:** `KelvinPlayer.tsx` (`'use client'`) renders `VideoPlayer` + `VideoSkin videoId="sea-lions" colorStrip="/kelvin/kelvin-colorstrip.json"` + `MuxVideo` with the Mux playback ID from Task 12 and `/kelvin/kelvin-chapters.vtt`. If Diego has sent an automation recording with chapters by Nov 14, add a second player with that video, no colour strip (plain track).
- [ ] **Step 3:** CSP in `next.config.ts`: add `media-src 'self' blob: https://stream.mux.com https://*.mux.com` and `worker-src 'self' blob:`; keep everything else unchanged. Verify no CSP violations in the console in `next dev` and `next build && next start`.
- [ ] **Step 4:** `app/kelvin/page.tsx`: short case-study page in the site's existing voice and layout conventions (look at `app/lumen` and `app/saratoga` for structure; respect the umbrella identity — Kelvin is one project, not the site), with the player, the design-thinking summary, link to the contest demo URL. Metadata + sitemap entry.
- [ ] **Step 5: Leak check:** in the browser at `/kelvin`, confirm the skin looks identical to the workbench (compare screenshots: bar height, fonts, button styles, sheet). Any `globals.css` element/`#id` leak is fixed by tightening Kelvin's own selectors, not by editing `globals.css`.
- [ ] **Step 6:** `npm run typecheck && npm run build` at repo root. Expected: pass.
- [ ] **Step 7: Deploy** — ask Diego; on yes deploy the site as he normally does (Vercel). Verify `https://diegoquinde.com/kelvin` plays from Mux.
- [ ] **Step 8: Commit** `feat(site): /kelvin case study with the Kelvin player`.

### Task 14: Submission package

**Files:**
- Create: `kelvin/SUBMISSION.md` (draft text), `kelvin/apps/preview/public/kelvin-hero.png`

- [ ] **Step 1:** Hero image: 1920×1080 screenshot of the demo page paused on the sand/water boundary, loupe active with a reading, sheet open, one note visible.
- [ ] **Step 2:** Draft the short description (≤ 200 words, English): catalog-instrument concept; CTB/CTO blue–orange logic where colour is the data; tools that exist only when paused; one row during playback; accessibility decisions (keyboard loupe, contrast over bright water, preferences, no colour-only state). Include both URLs and the Mux note.
- [ ] **Step 3:** Diego approves chapter titles (Task 1 Step 5), the description and the hero. Remind Diego he must join the challenge himself and accept the Apache-2.0 checkbox.
- [ ] **Step 4: Commit** `docs(kelvin): submission package`.

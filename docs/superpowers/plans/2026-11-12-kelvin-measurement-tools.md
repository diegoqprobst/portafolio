# Kelvin Measurement Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a drafting crosshair and four honest measurement tools (Point, A–B, Area, Ruler) plus an exposure-map overlay to the paused Kelvin player, with the critique's P1 fixes.

**Architecture:** Pure maths in `kelvin/src/video/kelvin/lib/` (Vitest), the paused-mode reducer extended with tool state, and small components layered over the picture inside the existing loupe layer. The site copy is regenerated with `npm run sync:kelvin`.

**Tech Stack:** `@videojs/react@10.3.0`, React 19, Vitest, canvas 2D.

**Spec:** `docs/superpowers/specs/2026-11-12-kelvin-measurement-tools-design.md` (extends `docs/superpowers/specs/2026-11-11-videojs-catalog-skin-design.md`).

## Global Constraints

- No lux and no cd/m² anywhere. Sheet line, verbatim: "Readings come from the picture, not a light meter: no lux without exposure data and a calibrated reference."
- Luminance = linear relative luminance 0–100 %; differences in stops = log2 of the linear ratio; contrast = plain linear ratio lighter:darker (2^|ΔStops| = ratio).
- "Temperature" is renamed "Apparent CCT" everywhere; above 10 000 K show "> 10 000 K"; |Duv| > 0.02 or the saturation gate → "—" with "off the light curve".
- Ruler shows source px and % of frame width until a scale is set; scaled lengths are labelled "on the reference plane".
- Tools exist only while paused. Keys while paused: `1` Point · `2` A–B · `3` Area · `4` Ruler · `E` exposure · `X` aim · `Enter` set · `P` pin · `Esc` back. The scaffold `0-9` seek hotkey is disabled while the sheet is open.
- A bare tap never creates a note. One typeface (Montserrat); colour only inside plates; orange only for what is live.
- Edit `kelvin/src`, then `npm run sync:kelvin` at the repo root. After each task: `npm test`, `npm run typecheck` in `kelvin/`.
- Commit per task on the current branch; push/publish only with Diego's OK.

## Review Focus

1. Drag that ends outside the picture or has zero size (Area/Ruler) → clamps to the frame; zero-size gives no reading, no NaN. Pinned by `areaStats`/`rulerLength` tests (Task 2) and `modeReducer` drag tests (Task 3).
2. Point A on pure black (luminance 0) → ΔStops and ratio stay finite (floor 0.001 %) and are marked "≥". Pinned in Task 2.
3. Scale set from a zero-length line or a non-positive number → rejected, previous scale kept. Pinned in Task 5.
4. Old notes in storage (no `kind`) and corrupt `geom` → load as `point`, CSV still exports. Pinned in Task 6.
5. Digit keys while playing must still seek (only paused routes them to tools). Pinned by `routeKey` tests in Task 3.

---

### Task 1: Honest colour readings (Apparent CCT, Duv, scale bounds)

**Files:** Modify `kelvin/src/video/kelvin/lib/color.ts`, `color.test.ts`, `labels.ts`, `loupe.tsx`, `pause-sheet.tsx`, `temperature-scale.tsx`, demo/site copy strings.

**Interfaces:**
- Produces: `type CctReading = { kind: 'ok'; k: number } | { kind: 'above' } | { kind: 'off' }`; `cctReading(c: RGB): CctReading`; `duv(c: RGB): number`; `formatCct(r: CctReading, labels): string` → "≈ 6,500 K" | "> 10 000 K" | "—".

- [ ] **Step 1: Failing tests** — `cctReading({r:255,g:255,b:255})` is `ok` with k in 6200–6800; a pale blue that `estimateCct` puts at 10 500–12 000 → `{kind:'above'}`; `{r:0,g:0,b:255}` → `off`; a pale green neutral-ish `{r:200,g:255,b:200}` → `off` (|duv| > 0.02); `duv` of white < 0.005.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement: Duv via CIE 1960 (u,v) distance to the Planckian locus using the Krystek/Ohno polynomial approximation; `cctReading` = off when `estimateCct` is null for saturation or |duv|>0.02, above when k > 10000, else ok. Rename labels `temperature` → value "Apparent CCT"; add `offCurve: 'off the light curve'`, `meterNote` (verbatim sheet line). Use `formatCct` in loupe tag, sheet gauge and announcer.
- [ ] **Step 4:** `npm test` PASS; typecheck.
- [ ] **Step 5: Commit** "Read colour temperature as apparent CCT, honestly bounded".

### Task 2: Measurement maths

**Files:** Create `kelvin/src/video/kelvin/lib/measure.ts`, `measure.test.ts`.

**Interfaces:**
- Produces:
  - `relLum(c: RGB): number` — 0–100 (% of white).
  - `deltaStops(aPct: number, bPct: number): { stops: number; floored: boolean }` — log2(b/a), both floored at 0.001.
  - `linearRatio(aPct, bPct): { ratio: number; floored: boolean }` — max/min.
  - `type AreaStats = { meanHex: string; mean: number; min: number; max: number; u0: number; cct: CctReading }`; `areaStats(img: { data: Uint8ClampedArray; width: number; height: number }): AreaStats | null` (null when no opaque pixels).
  - `type Pt = { u: number; v: number }`; `rect(a: Pt, b: Pt): { u: number; v: number; w: number; h: number }` (normalised, clamped to 0–1).
  - `rulerLength(a: Pt, b: Pt, vw: number, vh: number): { px: number; pctWidth: number }`.

- [ ] **Step 1: Failing tests** — `relLum(white)=100`, `relLum(black)=0`; `deltaStops(10,20).stops≈1`, `deltaStops(0,20)` finite and `floored:true`; `linearRatio(10,40).ratio=4` and `2**Math.abs(deltaStops(10,40).stops)≈linearRatio(10,40).ratio`; `areaStats` of a 2×1 image (white, black) → mean 50, min 0, max 100, u0 0; of an all-transparent image → null; `rect({u:.8,v:.9},{u:1.3,v:-.2})` → `{u:.8,v:0,w:.2,h:.9}`; `rulerLength({u:0,v:0},{u:1,v:0},1920,1080)` → px 1920, pctWidth 100; zero-length → px 0.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Commit** "Add measurement maths for A–B, area and ruler".

### Task 3: Tool state in the paused-mode reducer and key routing

**Files:** Modify `kelvin/src/video/kelvin/lib/mode.ts`, `mode.test.ts`, `behaviors.tsx`, `behaviors/playback-hotkeys.tsx`, `behaviors/hotkeys.tsx`.

**Interfaces:**
- Consumes: `Pt`, `rect` (Task 2).
- Produces: `type Tool = 'point' | 'compare' | 'area' | 'ruler'`; `Mode` gains `tool: Tool; exposure: boolean; anchor: Pt | null; drag: { from: Pt; to: Pt; done: boolean } | null`. New events: `{type:'tool', tool}`, `{type:'exposure'}`, `{type:'setAnchor'}` (anchor := reticle), `{type:'dragStart'}` (from=to=reticle), `{type:'dragTo', u, v}`, `{type:'dragEnd'}`. `routeKey` gains route `'tool'` for `1`–`4`, `e/E`, `p/P` when `sheet` is true.
- Rules: `play` keeps `tool` and `exposure`, clears `anchor` and `drag`. `tool` change clears `anchor`/`drag`. Escape ladder: unfinished/finished `drag` → cleared; else `anchor` → cleared; else existing ladder. In keyboard mode, `move` while `drag` is unfinished moves `drag.to` (and the reticle).

- [ ] **Step 1: Failing tests** for each rule, plus: `routeKey(playingMode,'3')` → `'player'`; `routeKey(pausedMode,'3')` → `'tool'`; `escape` with drag then anchor then keyboard steps one at a time; `dragTo` clamps to 0–1.
- [ ] **Step 2:** FAIL. **Step 3:** Implement; in `behaviors.tsx` handle the `'tool'` route (digits → `tool`, E → `exposure`, P → open the note field via `setNoteOpen(true)`); add prop `digitsDisabled` to `PlaybackHotkeys` (passed `mode.sheet`) that disables the `0-9` Hotkey.
- [ ] **Step 4:** PASS.
- [ ] **Step 5: Commit** "Add tool state and key routing for measurement tools".

### Task 4: Drafting crosshair, tool selector, key legend

**Files:** Create `kelvin/src/video/kelvin/crosshair.tsx`, `tool-bar.tsx`; modify `loupe.tsx`, `pause-sheet.tsx`, `labels.ts`, `icons.tsx`, `kelvin.css`.

**Interfaces:**
- Consumes: `Mode.tool`, `Mode.exposure`, events from Task 3; `uvToPoint`, `contentBox`.
- Produces: `Crosshair()` (two 1 px ink lines with a 1 px dark edge across the picture box through the reticle; edge labels `x 912` / `y 604` in source px); `ToolBar()` (segmented radiogroup Point/A–B/Area/Ruler with `aria-checked`, plus an Exposure switch `role="switch"`; lives in the header band while paused); labels `toolPoint, toolCompare, toolArea, toolRuler, exposure, keyLegend` (`"1–4 tools · E exposure · X aim · ↵ set · P pin · Esc back"`), `meterNote`.
- Behaviour: crosshair renders whenever `mode.loupe !== 'off'`. The sheet shows `keyLegend` and `meterNote` in a footer. Remove the chapter text from the header band while the sheet is open (it is in the sheet). Give the mobile settings trigger an accessible name (`labels`-driven).

- [ ] **Step 1:** Implement (logic tested in Task 3).
- [ ] **Step 2: Browser check** (dev server `kelvin`, 1440×810, paused): crosshair lines span the picture only (not the sheet), coordinates read e.g. `x 960` at centre; keys 1–4 switch the selector and `aria-checked`; digit keys still seek while playing; legend and meter note visible; chapter title appears once.
- [ ] **Step 3:** `npm test`, typecheck, build.
- [ ] **Step 4: Commit** "Add drafting crosshair and tool selector".

### Task 5: Compare A–B and Ruler with scale

**Files:** Create `kelvin/src/video/kelvin/measure-overlay.tsx`, `lib/scale.ts`, `scale.test.ts`; modify `loupe.tsx` (tag content per tool; pointer: click sets A in compare, drag draws in ruler/area; touch: tap/drag aims; tag buttons "Set A", "Pin", "Set scale"), `labels.ts`, `kelvin.css`.

**Interfaces:**
- Consumes: Task 2 maths, Task 3 events.
- Produces: `type Scale = { pxPerUnit: number; unit: 'm' | 'cm' | 'mm' }`; `scaleKey(videoId)` = `kelvin-scale-v1:${videoId}`; `loadScale(storage, videoId): Scale | null`; `saveScale(storage, videoId, s): boolean`; `makeScale(px: number, length: number, unit): Scale | null` (null when px ≤ 0 or length ≤ 0 or not finite); `formatLength(px, scale | null, pctWidth): string` → "412 px · 21.5 %" or "1.24 m (on the reference plane)". `MeasureOverlay()` draws: marker "A" (orange ring + letter) at anchor; dimension line with end ticks and centred label for ruler; dashed rectangle for area (Task 6 reuses it).
- A–B tag: ΔStops (signed, 1 decimal, "≥" when floored), ratio "4.0 : 1", both rel. luminances, both CCTs and ΔK.

- [ ] **Step 1: Failing tests** for `makeScale` (0 px → null; −1 m → null; 200 px = 1 m → pxPerUnit 200), `loadScale` corrupt → null, `formatLength(400, {pxPerUnit:200,unit:'m'}, 20)` → `"2.00 m"` plus the reference-plane label available separately.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. Set scale: a small inline form in the tag (number + unit select), Enter saves, Esc cancels; a "Clear scale" action when a scale exists.
- [ ] **Step 4:** PASS. **Step 5: Browser check:** A–B on sand vs water shows ΔStops and ratio consistent (2^|Δ| ≈ ratio); ruler across the frame reads 1920 px · 100 %; set scale 1 m on a line, a second line shows metres; reload keeps the scale.
- [ ] **Step 6: Commit** "Add A–B compare and ruler with scale".

### Task 6: Area tool and measurement notes

**Files:** Modify `loupe.tsx`, `measure-overlay.tsx`, `lib/notes.ts`, `notes.test.ts`, `pause-sheet.tsx`, `state.tsx`.

**Interfaces:**
- Consumes: `areaStats`, `rect`, `readPatch` (region read: draw the rect region scaled to ≤ 64×64 and `getImageData`, through `safeReadPixel`-style try/catch → blocked).
- Produces: `Note` gains `kind?: 'point'|'compare'|'area'|'ruler'`, `geom?: { u2: number; v2: number }`, `data?: Record<string, number>`; `normalizeNote(raw): Note | null` (missing kind → `point`; invalid geom dropped); CSV header exactly `time,kind,x,y,x2,y2,hex,cct_k,rel_lum_pct,delta_stops,contrast,uniformity,length,unit,text`. Clicking a pinned note: seek, `tool` := its kind, reticle/anchor/drag restored from geom.
- Area tag: mean hex, mean/min/max %, U₀ (2 decimals), mean CCT.

- [ ] **Step 1: Failing tests** — old note (no kind) loads as point; note with `geom: 'x'` loads without geom; CSV header equals the string above; a compare note exports `delta_stops` and `contrast`; area note exports `uniformity`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement; Pin (button or `P`) opens the note field, empty text allowed when `kind !== 'point'`.
- [ ] **Step 4:** PASS. **Step 5: Browser check:** drag an area on the water → U₀ < 1 and mean between min/max; pin it; reload; click the note → area redrawn; CSV row correct.
- [ ] **Step 7: Commit** "Add area tool and pinned measurements".

### Task 7: Compact/mobile layout and touch

**Files:** Modify `kelvin.css`, `pause-sheet.tsx` (compact branch), `loupe.tsx`, `tool-bar.tsx`.

- [ ] **Step 1:** Below 440 px or in the `compact` sheet layout: hide the compact strip; the tag becomes one line docked above the bar, clamped inside the player; the selector collapses to one icon button cycling tools (accessible name = current tool); nothing else covers the picture.
- [ ] **Step 2: Browser check** at 375×812 and 480×270: picture visible above the docked line, reticle visible, no horizontal overflow (`scrollWidth ≤ clientWidth`), tap aims (no note), Pin opens the note.
- [ ] **Step 3:** test/typecheck/build. **Step 4: Commit** "Keep the picture clear on small players".

— **cut line** (Task 8 only if Tasks 1–7 are done and verified by Nov 15 noon) —

### Task 8: Exposure map overlay

**Files:** Create `kelvin/src/video/kelvin/lib/exposure.ts`, `exposure.test.ts`, `exposure-layer.tsx`; modify `pause-sheet.tsx` (legend), `kelvin.css`.

**Interfaces:**
- Produces: `type Zone = 'crushed'|'shadow'|'mid'|'high'|'clipped'`; `zoneOf(pct: number): Zone` with thresholds < 1, < 18, < 50, ≤ 95, > 95; `falseColor(img: ImageData, palette: Record<Zone, [number, number, number]>): ImageData`. `ExposureLayer()` draws the paused frame's false colour on a canvas over the picture box at opacity 0.75 when `mode.exposure`; legend in the sheet lists the five zones with their ranges.

- [ ] **Step 1: Failing tests** for `zoneOf(0.5)='crushed'`, `zoneOf(18)='mid'`, `zoneOf(95)='high'`, `zoneOf(96)='clipped'`; `falseColor` maps a white pixel to the clipped colour.
- [ ] **Step 2:** FAIL. **Step 3:** Implement (read the frame at ≤ 640 px wide). **Step 4:** PASS.
- [ ] **Step 5: Browser check:** E toggles the map while any tool stays usable; blocked read → switch disabled with "Reading unavailable".
- [ ] **Step 6: Commit** "Add exposure map overlay".

### Task 9: Sync, verify, publish (with OK)

- [ ] **Step 1:** `npm run sync:kelvin`; root `npm run typecheck`; root build with a throwaway `JWT_SECRET`; kelvin build.
- [ ] **Step 2: Browser check** on the site dev server: home plate and `/kelvin` show the tools; no console errors.
- [ ] **Step 3:** Update `kelvin/SUBMISSION.md` and demo copy (tools, honesty line). Recapture `public/assets/projects/kelvin-cover.jpg` via `?hero`.
- [ ] **Step 4: Commit**; ask Diego before `git push origin HEAD:master` and the Vercel prebuilt deploy of `kelvin/`.

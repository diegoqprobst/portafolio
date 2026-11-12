# Kelvin — measurement tools (design addendum)

Status: draft for Diego's approval (builder check done; my calls in the Input model table and §5) · 2026-11-12 · deadline Nov 16 11:59pm PST
Extends: `docs/superpowers/specs/2026-11-11-videojs-catalog-skin-design.md` (product truth in `kelvin/PRODUCT.md`). Everything there still holds unless changed here.

## 1. Why

Diego (lighting / technical documentation) reviewed the live skin: "I'm missing a cursor on top of the screen, and measurement tools — measuring lux and other things, or dimensioning things." The critique (`.impeccable/critique/2026-11-12T19-31-44Z__kelvin-src-video-kelvin.md`, 29/40) agrees: Kelvin measures one 5×5 point at a time, its "Temperature" label overstates what it reads, and the paused mobile layout buries the picture.

Diego's decisions (2026-11-12):
- **Cursor:** a full-frame drafting crosshair while paused.
- **Tools:** all four — Compare A–B, Ruler with scale, Area, Exposure map.
- **Lux:** honest measures only. No lux and no cd/m² anywhere; say why.

## 2. Honesty rules (binding)

A video frame stores camera-processed, white-balanced, gamma-encoded *reflected* light. So:
- No lux (illuminance at a surface) and no cd/m² (needs ISO/shutter/aperture + calibration). The sheet carries one line: "Readings come from the picture, not a light meter: no lux without exposure data and a calibrated reference."
- Luminance is **relative**: linear relative luminance 0–100 % of white (from sRGB/BT.709), and differences in **stops** (log2 of the linear ratio).
- "Temperature" is renamed **"Apparent CCT"** everywhere (loupe, sheet dial, labels, demo copy). Readings above 10 000 K show "> 10 000 K" and the scale's right/left ends stay 10 000 K / 2000 K. When the colour is far from the blackbody locus (|Duv| > 0.02, or the existing saturation gate), show "—" with "off the light curve".
- Dimensions are **pixels or % of frame** until the user sets a scale from a known length; then metres/centimetres, labelled "on the reference plane" (perspective is not corrected).

## 3. Goals

- G1. **Drafting crosshair.** While paused, two hairlines span the picture through the reticle (ink, 1 px, with a dark 1 px edge for bright frames), and the reticle's position is printed at the frame edges in source pixels (`x 912`, `y 604`, of 1920×1080). Present in every tool. Never during playback.
- G2. **Tool selector.** While paused, a compact segmented control: **Point · A–B · Area · Ruler**, keys `1`–`4`. Point is today's loupe and the default; the last tool used is remembered between pauses. **Exposure is not a tool but an overlay toggle** (key `E`, a separate switch beside the selector) that can stay on while any tool is used. The scaffold's `0-9` seek-to-percent hotkey is disabled while the sheet is open (§6).
- G3. **Compare A–B.** Click / Enter sets (or re-sets) point A (persistent marker "A"); the reticle is B. The tag shows: ΔStops (B vs A, signed, one decimal), contrast ratio as the **plain linear ratio** of relative luminances (lighter:darker, so 2^|ΔStops| = ratio — not the WCAG +0.05 formula), both relative luminances, both apparent CCTs and their difference. Esc clears A, then steps back as today.
- G4. **Area.** Drag a rectangle (keyboard: Enter starts at the reticle, arrows grow it, Enter ends; a click without a drag does nothing). The tag shows mean colour (hex), mean / min / max relative luminance, **uniformity U₀ = min / mean**, mean apparent CCT. Sampling: the region's pixels at most 64×64 (downsampled), using the existing canvas read path and blocked-read handling.
- G5. **Ruler.** Drag a line (keyboard: Enter, arrows, Enter). Shows length in source px and % of frame width, with end ticks and a centred label like a dimension line. "Set scale" (button in the tag) asks for the real length of the current line (number + unit m/cm/mm); afterwards every ruler shows that unit. Scale stored per `videoId` in localStorage (`kelvin-scale-v1:<id>`), clearable.
- G6. **Exposure map.** Toggle draws a false-colour overlay of the paused frame on a canvas above the picture by relative luminance zones, with a legend in the sheet: crushed < 1 % · shadows 1–18 % · mid 18–50 % (key grey band highlighted) · highlights 50–95 % · clipped > 95 %. Exact zone colours are the builder's, inside the "colour only in plates" rule (the overlay *is* a plate). Opacity ~0.75; the picture stays recognisable.
- G7. **Critique P1/P2 fixes that touch the same code:**
  - Mobile/compact (player < 440 px wide, and the existing height-based `compact` sheet layout): no picture-covering stack, and everything stays **inside the player box** (host pages unchanged). The reading becomes a single line docked just above the bar; the tool selector collapses to one icon button that cycles tools; the compact sheet strip is hidden.
  - Touch: a tap or drag **aims**; a separate "Pin" button in the tag saves a note (no note on bare tap).
  - Discoverability: a one-line key legend in the sheet footer ("1–4 tools · E exposure · X aim · ↵ set · P pin · Esc back"), from labels.
  - Chapter title shown once (remove it from the header band when the sheet is open).
  - Mobile settings button gets an accessible name.

### Input model (my call, resolves the builder check)

| | Mouse | Keyboard (X aim mode) | Touch |
|---|---|---|---|
| Aim (move reticle / B) | move | arrows (Shift fine) | tap or drag (Point, A–B) |
| Point | click opens the note field | Enter opens the note field | "Pin" button in the tag |
| A–B: set A | click | Enter | "Set A" button in the tag |
| Area / Ruler: draw | drag | Enter, arrows, Enter | drag |
| Save measurement | "Pin" in the tag | `P` | "Pin" in the tag |

"Pin" always opens the note field prefilled empty; for measurements an empty text is allowed (the numbers are the note). A bare tap never creates a note.

## 4. Non-goals

- Lux, cd/m², EV-to-absolute conversion, camera metadata input.
- Perspective-corrected measurement, multiple simultaneous rulers/areas (one live measurement per tool; pinned ones live in notes).
- Measurements during playback.
- Colour-timeline redesign (critique P2) — only if time remains after the cut line.

## 5. Notes and CSV

`Note` gains an optional `kind: 'point' | 'compare' | 'area' | 'ruler'` and `geom` (a second point `u2,v2` for compare and ruler, the rectangle's opposite corner for area) plus `data` (the numbers shown at pin time). Storage key stays `kelvin-notes-v1`; old notes (no `kind`) load as `point`, so no migration. Clicking a pinned note seeks to its time, switches to its tool and redraws its geometry. CSV columns become: `time,kind,x,y,x2,y2,hex,cct_k,rel_lum_pct,delta_stops,contrast,uniformity,length,unit,text` (`x,y` = first point / A / start / top-left; empty where not applicable).

## 6. Constraints

- Same stack and rules as the main spec: Video.js 10.3.0 React skin in `kelvin/`, edit `kelvin/src` then `npm run sync:kelvin` for the site; tests with Vitest for all maths; one typeface (Montserrat); blueprint navy world; orange = what is live only.
- Hotkeys while paused: digits 1–5 select tools, so the scaffold's `0-9` seek-to-percent hotkey is disabled while the sheet is open (it stays on during playback).
- Pixel reads only where the browser allows (same-origin/CORS); every tool shows "Reading unavailable" on a blocked read.
- Must keep working on diegoquinde.com (home plate and /kelvin) and the contest page.

## 7. Order and cut line (my call)

1. Honesty relabel + drafting crosshair + tool selector + keys/legend + touch aim/Pin (Nov 12–13)
2. Compare A–B (Nov 13)
3. Ruler with scale (Nov 14)
4. Area (Nov 14)
5. Mobile compact rework (Nov 14–15) — a critique P1, so it is above the line.
— **cut line** — below ships only if 1–5 are done and verified by Nov 15 noon; if it slips, the `E` toggle and its legend simply do not ship —
6. Exposure map overlay (Nov 15)
Nov 15 afternoon: Safari check, publish both sites (with Diego's OK), submission text. Nov 16: buffer.

## 8. Left to the builder

Exact visuals of markers, dimension lines, the selector, the exposure palette, motion; how Area/Ruler keyboard editing feels; Duv computation method (standard CIE 1960 uv distance to the Planckian locus approximation is fine).

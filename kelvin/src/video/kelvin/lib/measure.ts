import { cctReading, relativeLuminance, toHex, type CctReading, type RGB } from './color';

/** Linear relative luminance as % of white (0–100). Relative to the picture, not a light meter. */
export const relLum = (c: RGB): number => relativeLuminance(c) * 100;

const FLOOR = 0.001;
const floor = (pct: number) => ({ v: Math.max(pct, FLOOR), floored: pct < FLOOR });

/** Difference of B against A in stops: log2 of the linear ratio. Values at black are floored at 0.001 %. */
export function deltaStops(aPct: number, bPct: number): { stops: number; floored: boolean } {
  const a = floor(aPct);
  const b = floor(bPct);
  return { stops: Math.log2(b.v / a.v), floored: a.floored || b.floored };
}

/** Plain linear contrast ratio, lighter : darker (so 2^|ΔStops| equals it). */
export function linearRatio(aPct: number, bPct: number): { ratio: number; floored: boolean } {
  const a = floor(aPct);
  const b = floor(bPct);
  return { ratio: Math.max(a.v, b.v) / Math.min(a.v, b.v), floored: a.floored || b.floored };
}

export type AreaStats = { meanHex: string; mean: number; min: number; max: number; u0: number; cct: CctReading };

/** Mean colour and luminance spread of a region; uniformity U₀ = min / mean. Null when nothing was drawn. */
export function areaStats(img: { data: Uint8ClampedArray; width: number; height: number }): AreaStats | null {
  const { data } = img;
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  let sum = 0;
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i + 3 < data.length; i += 4) {
    if (data[i + 3]! === 0) continue;
    const px = { r: data[i]!, g: data[i + 1]!, b: data[i + 2]! };
    const l = relLum(px);
    r += px.r;
    g += px.g;
    b += px.b;
    sum += l;
    min = Math.min(min, l);
    max = Math.max(max, l);
    n += 1;
  }
  if (n === 0) return null;
  const meanRgb = { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
  const mean = sum / n;
  return { meanHex: toHex(meanRgb), mean, min, max, u0: mean > 0 ? min / mean : 0, cct: cctReading(meanRgb) };
}

export type Pt = { u: number; v: number };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Rectangle spanned by two frame points, normalised and clamped to the frame. */
export function rect(a: Pt, b: Pt): { u: number; v: number; w: number; h: number } {
  const [u1, u2] = [clamp01(a.u), clamp01(b.u)].sort((x, y) => x - y) as [number, number];
  const [v1, v2] = [clamp01(a.v), clamp01(b.v)].sort((x, y) => x - y) as [number, number];
  return { u: u1, v: v1, w: u2 - u1, h: v2 - v1 };
}

/** Length of a line in source pixels and as % of the frame width. */
export function rulerLength(a: Pt, b: Pt, vw: number, vh: number): { px: number; pctWidth: number } {
  const px = Math.hypot((b.u - a.u) * vw, (b.v - a.v) * vh);
  return { px: Math.round(px * 10) / 10, pctWidth: vw ? Math.round((px / vw) * 1000) / 10 : 0 };
}

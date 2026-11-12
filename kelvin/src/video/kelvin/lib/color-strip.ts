import type { Swatch } from './palette';

export type ColorSlice = { t: number; swatches: Swatch[]; meanHex: string; cct: number | null; luminance: number };
export type ColorStrip = { version: 1; duration: number; step: number; slices: ColorSlice[] };

const HEX = /^#[0-9A-F]{6}$/i;
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

function isSlice(value: unknown): value is ColorSlice {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  return (
    isNum(s.t) &&
    typeof s.meanHex === 'string' &&
    HEX.test(s.meanHex) &&
    (s.cct === null || isNum(s.cct)) &&
    isNum(s.luminance) &&
    Array.isArray(s.swatches) &&
    s.swatches.every(
      (w) => w && typeof w === 'object' && typeof (w as Swatch).hex === 'string' && HEX.test((w as Swatch).hex) && isNum((w as Swatch).share),
    )
  );
}

/** Validates untrusted JSON; null on anything malformed so the player falls back to a plain track. */
export function parseColorStrip(json: unknown): ColorStrip | null {
  if (!json || typeof json !== 'object') return null;
  const s = json as Record<string, unknown>;
  if (s.version !== 1 || !isNum(s.duration) || !isNum(s.step) || s.step <= 0) return null;
  if (!Array.isArray(s.slices) || s.slices.length === 0 || !s.slices.every(isSlice)) return null;
  return json as ColorStrip;
}

export function sliceAt(strip: ColorStrip, time: number): ColorSlice {
  const t = Number.isFinite(time) ? Math.min(Math.max(time, 0), strip.duration) : 0;
  const index = Math.min(strip.slices.length - 1, Math.floor(t / strip.step));
  return strip.slices[index]!;
}

export function stripMatches(strip: ColorStrip, mediaDuration: number): boolean {
  return Number.isFinite(mediaDuration) && Math.abs(strip.duration - mediaDuration) <= Math.max(0.5, strip.step);
}

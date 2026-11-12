import { relLum } from './measure';

export type Zone = 'crushed' | 'shadow' | 'mid' | 'high' | 'clipped';

/** Relative-luminance zones (% of white): < 1 · 1–18 · 18–50 · 50–95 · > 95. */
export function zoneOf(pct: number): Zone {
  if (pct < 1) return 'crushed';
  if (pct < 18) return 'shadow';
  if (pct < 50) return 'mid';
  if (pct <= 95) return 'high';
  return 'clipped';
}

/** False-colour plate, cold to hot; the mid band (around key grey) is the calm green. */
export const EXPOSURE_PALETTE: Record<Zone, [number, number, number]> = {
  crushed: [91, 42, 134],
  shadow: [47, 111, 219],
  mid: [63, 178, 127],
  high: [232, 197, 71],
  clipped: [229, 72, 77],
};

export const ZONE_RANGES: Record<Zone, string> = {
  crushed: '< 1 %',
  shadow: '1–18 %',
  mid: '18–50 %',
  high: '50–95 %',
  clipped: '> 95 %',
};

type Pixels = { data: Uint8ClampedArray; width: number; height: number };

/** Each pixel replaced by its zone colour; alpha is kept. */
export function falseColor(img: Pixels, palette: Record<Zone, [number, number, number]>): Pixels {
  const out = new Uint8ClampedArray(img.data.length);
  for (let i = 0; i + 3 < img.data.length; i += 4) {
    const [r, g, b] = palette[zoneOf(relLum({ r: img.data[i]!, g: img.data[i + 1]!, b: img.data[i + 2]! }))];
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = img.data[i + 3]!;
  }
  return { data: out, width: img.width, height: img.height };
}

/** 8-bit sRGB colour. */
// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
export type RGB = { r: number; g: number; b: number };

const hex2 = (value: number) => Math.round(value).toString(16).padStart(2, '0').toUpperCase();

export function toHex({ r, g, b }: RGB): string {
  return `#${hex2(r)}${hex2(g)}${hex2(b)}`;
}

export function fromHex(hex: string): RGB {
  const value = hex.replace('#', '');
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function toLinear(value: number) {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.x relative luminance, 0–1. */
export function relativeLuminance({ r, g, b }: RGB): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function contrastRatio(a: RGB, b: RGB): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Approximate correlated colour temperature (McCamy). Null when the colour is too dark, too saturated, or out of range. */
export function estimateCct({ r, g, b }: RGB): number | null {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max < 24 || (max - min) / max > 0.45) return null;
  const [R, G, B] = [toLinear(r), toLinear(g), toLinear(b)];
  const X = 0.4124 * R + 0.3576 * G + 0.1805 * B;
  const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  const Z = 0.0193 * R + 0.1192 * G + 0.9505 * B;
  const sum = X + Y + Z;
  const n = (X / sum - 0.332) / (0.1858 - Y / sum);
  const cct = Math.round(449 * n ** 3 + 3525 * n ** 2 + 6823.3 * n + 5520.33);
  return cct >= 1500 && cct <= 12000 ? cct : null;
}

/** Position on the CTB→CTO scale: 0 = cool (10000 K), 1 = warm (2000 K), linear in mired. */
export function temperaturePosition(kelvin: number): number {
  return Math.min(1, Math.max(0, (1e6 / kelvin - 100) / 400));
}

/** Hue angle 0–360 (HSV), or null for neutrals where hue means nothing. */
export function hueOf({ r, g, b }: RGB): number | null {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d < 4) return null;
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return Math.round((h * 60 + 360) % 360);
}

function toUv({ r, g, b }: RGB) {
  const [R, G, B] = [toLinear(r), toLinear(g), toLinear(b)];
  const X = 0.4124 * R + 0.3576 * G + 0.1805 * B;
  const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  const Z = 0.0193 * R + 0.1192 * G + 0.9505 * B;
  const d = X + 15 * Y + 3 * Z || 1;
  return { u: (4 * X) / d, v: (6 * Y) / d };
}

/** Planckian locus in CIE 1960 uv (Krystek 1985 rational approximation, 1000–15000 K). */
function planckUv(t: number) {
  const u = (0.860117757 + 1.54118254e-4 * t + 1.28641212e-7 * t * t) / (1 + 8.42420235e-4 * t + 7.08145163e-7 * t * t);
  const v = (0.317398726 + 4.22806245e-5 * t + 4.20481691e-8 * t * t) / (1 - 2.89741816e-5 * t + 1.61456053e-7 * t * t);
  return { u, v };
}

/** Signed distance from the blackbody locus in CIE 1960 uv (Duv); positive = greenish, negative = magenta. */
export function duv(c: RGB): number {
  const p = toUv(c);
  let best = Infinity;
  let sign = 1;
  for (let t = 1500; t <= 15000; t += 50) {
    const q = planckUv(t);
    const d = Math.hypot(p.u - q.u, p.v - q.v);
    if (d < best) {
      best = d;
      sign = p.v >= q.v ? 1 : -1;
    }
  }
  return sign * best;
}

export type CctReading = { kind: 'ok'; k: number } | { kind: 'above' } | { kind: 'off' };

const DUV_LIMIT = 0.02;
const SCALE_MAX_K = 10000;

/** Apparent CCT of a colour as recorded (after the camera's white balance), with honest bounds. */
export function cctReading(c: RGB): CctReading {
  const k = estimateCct(c);
  if (k === null || Math.abs(duv(c)) > DUV_LIMIT) return { kind: 'off' };
  return k > SCALE_MAX_K ? { kind: 'above' } : { kind: 'ok', k };
}

export function formatCct(r: CctReading, _labels: { offCurve: string }): string {
  if (r.kind === 'ok') return `≈ ${r.k.toLocaleString('en-US')} K`;
  if (r.kind === 'above') return '> 10 000 K';
  return '—';
}

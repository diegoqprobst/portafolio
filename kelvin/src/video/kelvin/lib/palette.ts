import { toHex } from './color';

export type Swatch = { hex: string; share: number };

const MERGE_DISTANCE = 28;

type Acc = { r: number; g: number; b: number; count: number };

const mean = (a: Acc) => ({ r: a.r / a.count, g: a.g / a.count, b: a.b / a.count });
const dist = (a: Acc, b: Acc) => {
  const [x, y] = [mean(a), mean(b)];
  return Math.hypot(x.r - y.r, x.g - y.g, x.b - y.b);
};

/**
 * Dominant colours of a pixel buffer: 5-bit-per-channel histogram, buckets walked by count and greedily
 * merged into accepted swatches within RGB distance 28. Deterministic, so the build script and the browser agree.
 */
export function dominantColors(pixels: Uint8Array | Uint8ClampedArray, channels: 3 | 4, k = 5): Swatch[] {
  const buckets = new Map<number, Acc>();
  for (let i = 0; i + 2 < pixels.length; i += channels) {
    const r = pixels[i]!;
    const g = pixels[i + 1]!;
    const b = pixels[i + 2]!;
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const acc = buckets.get(key);
    if (acc) {
      acc.r += r;
      acc.g += g;
      acc.b += b;
      acc.count += 1;
    } else buckets.set(key, { r, g, b, count: 1 });
  }
  const sorted = [...buckets.values()].sort((a, b) => b.count - a.count);
  const swatches: Acc[] = [];
  for (const bucket of sorted) {
    let nearest: Acc | undefined;
    let best = Infinity;
    for (const swatch of swatches) {
      const d = dist(swatch, bucket);
      if (d < best) [best, nearest] = [d, swatch];
    }
    if (nearest && (best <= MERGE_DISTANCE || swatches.length >= k)) {
      nearest.r += bucket.r;
      nearest.g += bucket.g;
      nearest.b += bucket.b;
      nearest.count += bucket.count;
    } else swatches.push({ ...bucket });
  }
  const total = swatches.reduce((sum, s) => sum + s.count, 0);
  return swatches
    .sort((a, b) => b.count - a.count)
    .map((s) => ({ hex: toHex(mean(s)), share: s.count / total }));
}

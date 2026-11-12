import { describe, expect, test } from 'vitest';

import { fromHex } from './color';
import { dominantColors } from './palette';

function makePixels(parts: [number, number, number, number][]) {
  const out: number[] = [];
  for (const [r, g, b, count] of parts) for (let i = 0; i < count; i += 1) out.push(r, g, b);
  return new Uint8Array(out);
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const distance = (a: string, b: string) => {
  const [x, y] = [fromHex(a), fromHex(b)];
  return Math.hypot(x.r - y.r, x.g - y.g, x.b - y.b);
};

describe('dominantColors', () => {
  test('finds two colours with their shares', () => {
    const s = dominantColors(makePixels([[0x20, 0x50, 0xa0, 75], [0xe0, 0xc0, 0x90, 25]]), 3);
    expect(s).toHaveLength(2);
    expect(s[0]!.share).toBeCloseTo(0.75, 2);
    expect(s[1]!.share).toBeCloseTo(0.25, 2);
    expect(distance(s[0]!.hex, '#2050A0')).toBeLessThan(8);
    expect(distance(s[1]!.hex, '#E0C090')).toBeLessThan(8);
  });

  test('empty input gives no swatches', () => {
    expect(dominantColors(new Uint8Array(), 3)).toEqual([]);
  });

  test('never returns more than k swatches and shares sum to 1', () => {
    const rand = seeded(1);
    const px = new Uint8Array(5000 * 4).map(() => Math.floor(rand() * 256));
    const s = dominantColors(px, 4, 5);
    expect(s.length).toBeLessThanOrEqual(5);
    expect(s.reduce((sum, w) => sum + w.share, 0)).toBeCloseTo(1, 3);
  });

  test('near colours merge into one swatch', () => {
    const s = dominantColors(makePixels([[0x20, 0x50, 0xa0, 50], [0x22, 0x52, 0xa2, 50]]), 3);
    expect(s).toHaveLength(1);
    expect(s[0]!.share).toBeCloseTo(1, 3);
  });

  test('sorted by share, largest first', () => {
    const s = dominantColors(makePixels([[0, 0, 0, 10], [255, 255, 255, 60], [200, 30, 30, 30]]), 3);
    expect(s.map((w) => w.share)).toEqual([...s.map((w) => w.share)].sort((a, b) => b - a));
  });
});

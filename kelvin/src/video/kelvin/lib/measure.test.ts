import { describe, expect, test } from 'vitest';

import { areaStats, deltaStops, linearRatio, rect, relLum, rulerLength } from './measure';

const img = (pixels: number[][], width: number) => ({
  data: new Uint8ClampedArray(pixels.flat()),
  width,
  height: pixels.length / width,
});

describe('relLum', () => {
  test('white is 100 %', () => expect(relLum({ r: 255, g: 255, b: 255 })).toBeCloseTo(100, 5));
  test('black is 0 %', () => expect(relLum({ r: 0, g: 0, b: 0 })).toBe(0));
});

describe('stops and ratio', () => {
  test('twice the light is one stop', () => expect(deltaStops(10, 20).stops).toBeCloseTo(1, 6));
  test('darker B is negative', () => expect(deltaStops(20, 10).stops).toBeCloseTo(-1, 6));
  test('black A stays finite and is marked floored', () => {
    const d = deltaStops(0, 20);
    expect(Number.isFinite(d.stops)).toBe(true);
    expect(d.floored).toBe(true);
  });
  test('ratio is lighter over darker', () => expect(linearRatio(10, 40).ratio).toBeCloseTo(4, 6));
  test('ratio and stops agree', () =>
    expect(2 ** Math.abs(deltaStops(10, 40).stops)).toBeCloseTo(linearRatio(10, 40).ratio, 6));
  test('black in the ratio stays finite', () => expect(Number.isFinite(linearRatio(0, 50).ratio)).toBe(true));
});

describe('areaStats', () => {
  test('white and black average to half', () => {
    const s = areaStats(img([[255, 255, 255, 255], [0, 0, 0, 255]], 2))!;
    expect(s.mean).toBeCloseTo(50, 3);
    expect(s.min).toBe(0);
    expect(s.max).toBeCloseTo(100, 3);
    expect(s.u0).toBe(0);
  });
  test('uniform grey has uniformity 1', () => {
    const s = areaStats(img([[128, 128, 128, 255], [128, 128, 128, 255]], 2))!;
    expect(s.u0).toBeCloseTo(1, 6);
    expect(s.meanHex).toBe('#808080');
  });
  test('nothing drawn gives no reading', () => expect(areaStats(img([[10, 10, 10, 0]], 1))).toBeNull());
});

describe('geometry', () => {
  test('rect normalises and clamps to the frame', () =>
    expect(rect({ u: 0.8, v: 0.9 }, { u: 1.3, v: -0.2 })).toEqual({ u: 0.8, v: 0, w: expect.closeTo(0.2, 6), h: 0.9 }));
  test('a full-width line is 1920 px and 100 %', () =>
    expect(rulerLength({ u: 0, v: 0 }, { u: 1, v: 0 }, 1920, 1080)).toEqual({ px: 1920, pctWidth: 100 }));
  test('a zero-length line is 0', () => expect(rulerLength({ u: 0.4, v: 0.4 }, { u: 0.4, v: 0.4 }, 1920, 1080).px).toBe(0));
});

import { formatRatio, formatStops } from './measure';

describe('formatStops / formatRatio (review fix)', () => {
  test('normal positive', () => expect(formatStops(deltaStops(10, 20))).toBe('+1.0 stops'));
  test('near zero has no sign', () => expect(formatStops(deltaStops(10, 10.01))).toBe('0.0 stops'));
  test('B on black reads as at most, not at least', () => expect(formatStops(deltaStops(50, 0))).toMatch(/^≤ −\d+\.\d stops$/));
  test('A on black reads as at least', () => expect(formatStops(deltaStops(0, 50))).toMatch(/^≥ \+\d+\.\d stops$/));
  test('both on black means nothing', () => expect(formatStops(deltaStops(0, 0))).toBe('—'));
  test('ratio with a floored point is a lower bound', () => expect(formatRatio(linearRatio(0, 50))).toMatch(/^≥ \d+(\.\d)? : 1$/));
  test('ratio with both on black means nothing', () => expect(formatRatio(linearRatio(0, 0))).toBe('—'));
  test('plain ratio', () => expect(formatRatio(linearRatio(10, 40))).toBe('4.0 : 1'));
});

import { describe, expect, test } from 'vitest';

import { parseColorStrip, sliceAt, stripMatches } from './color-strip';

const slice = (t: number) => ({ t, swatches: [{ hex: '#112233', share: 1 }], meanHex: '#112233', cct: null, luminance: 0.02 });
const fixture = { version: 1, duration: 2, step: 1, slices: [slice(0), slice(1)] };

describe('parseColorStrip', () => {
  test('rejects the wrong shape', () => expect(parseColorStrip({ nope: 1 })).toBeNull());
  test('rejects null', () => expect(parseColorStrip(null)).toBeNull());
  test('rejects empty slices', () => expect(parseColorStrip({ ...fixture, slices: [] })).toBeNull());
  test('rejects a slice with a bad hex', () =>
    expect(parseColorStrip({ ...fixture, slices: [{ ...slice(0), meanHex: 'blue' }] })).toBeNull());
  test('accepts a valid strip', () => expect(parseColorStrip(fixture)).toEqual(fixture));
});

describe('sliceAt', () => {
  const strip = parseColorStrip(fixture)!;
  test('clamps negative time', () => expect(sliceAt(strip, -5).t).toBe(0));
  test('clamps time past the end', () => expect(sliceAt(strip, 99).t).toBe(1));
  test('picks the slice that contains the time', () => expect(sliceAt(strip, 1.4).t).toBe(1));
  test('NaN time gives the first slice', () => expect(sliceAt(strip, Number.NaN).t).toBe(0));
});

describe('stripMatches', () => {
  const strip = parseColorStrip(fixture)!;
  test('close duration matches', () => expect(stripMatches(strip, 2.3)).toBe(true));
  test('different video does not match', () => expect(stripMatches(strip, 60)).toBe(false));
  test('unknown duration does not match', () => expect(stripMatches(strip, Number.NaN)).toBe(false));
});

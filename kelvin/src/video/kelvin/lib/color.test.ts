import { describe, expect, test } from 'vitest';

import { contrastRatio, estimateCct, fromHex, temperaturePosition, toHex } from './color';

describe('hex conversion', () => {
  test('toHex writes uppercase #RRGGBB', () => {
    expect(toHex({ r: 75, g: 79, b: 164 })).toBe('#4B4FA4');
  });
  test('fromHex reads lowercase hex', () => {
    expect(fromHex('#e6d6b8')).toEqual({ r: 230, g: 214, b: 184 });
  });
});

describe('contrastRatio', () => {
  test('white on black is 21:1', () => {
    expect(contrastRatio(fromHex('#FFFFFF'), fromHex('#000000'))).toBeCloseTo(21, 1);
  });
  test('is symmetric', () => {
    expect(contrastRatio(fromHex('#4B4FA4'), fromHex('#E6D6B8'))).toBeCloseTo(
      contrastRatio(fromHex('#E6D6B8'), fromHex('#4B4FA4')),
      6,
    );
  });
});

describe('estimateCct', () => {
  test('white reads near D65', () => {
    const k = estimateCct({ r: 255, g: 255, b: 255 });
    expect(k).toBeGreaterThan(6200);
    expect(k).toBeLessThan(6800);
  });
  test('warm tint reads below 4000 K', () => {
    expect(estimateCct({ r: 255, g: 200, b: 150 })).toBeLessThan(4000);
  });
  test('saturated colour has no temperature', () => {
    expect(estimateCct({ r: 0, g: 0, b: 255 })).toBeNull();
  });
  test('near-black has no temperature', () => {
    expect(estimateCct({ r: 10, g: 10, b: 10 })).toBeNull();
  });
});

describe('temperaturePosition', () => {
  test('2000 K is fully warm', () => expect(temperaturePosition(2000)).toBe(1));
  test('10000 K is fully cool', () => expect(temperaturePosition(10000)).toBe(0));
  test('clamps below range', () => expect(temperaturePosition(1000)).toBe(1));
  test('clamps above range', () => expect(temperaturePosition(40000)).toBe(0));
});

import { hueOf } from './color';

describe('hueOf', () => {
  test('pure red is 0°', () => expect(hueOf({ r: 255, g: 0, b: 0 })).toBe(0));
  test('pure green is 120°', () => expect(hueOf({ r: 0, g: 255, b: 0 })).toBe(120));
  test('pure blue is 240°', () => expect(hueOf({ r: 0, g: 0, b: 255 })).toBe(240));
  test('sea water reads as cyan-blue', () => {
    const h = hueOf({ r: 0x78, g: 0x89, b: 0x90 })!;
    expect(h).toBeGreaterThan(180);
    expect(h).toBeLessThan(210);
  });
  test('neutral grey has no hue', () => expect(hueOf({ r: 128, g: 128, b: 128 })).toBeNull());
});

import { cctReading, duv, formatCct } from './color';

describe('cctReading (apparent CCT, honestly bounded)', () => {
  test('white reads near D65', () => {
    const r = cctReading({ r: 255, g: 255, b: 255 });
    expect(r.kind).toBe('ok');
    if (r.kind === 'ok') {
      expect(r.k).toBeGreaterThan(6200);
      expect(r.k).toBeLessThan(6800);
    }
  });
  test('a pale blue past 10 000 K reads as above the scale', () =>
    expect(cctReading({ r: 190, g: 215, b: 255 })).toEqual({ kind: 'above' }));
  test('saturated blue is off the light curve', () => expect(cctReading({ r: 0, g: 0, b: 255 })).toEqual({ kind: 'off' }));
  test('a green tint is off the light curve', () => expect(cctReading({ r: 200, g: 255, b: 200 })).toEqual({ kind: 'off' }));
  test('white sits on the blackbody locus', () => expect(Math.abs(duv({ r: 255, g: 255, b: 255 }))).toBeLessThan(0.005));
});

describe('formatCct', () => {
  const labels = { offCurve: 'off the light curve' };
  test('ok', () => expect(formatCct({ kind: 'ok', k: 6504 }, labels)).toBe('≈ 6,504 K'));
  test('above', () => expect(formatCct({ kind: 'above' }, labels)).toBe('> 10 000 K'));
  test('off', () => expect(formatCct({ kind: 'off' }, labels)).toBe('—'));
});

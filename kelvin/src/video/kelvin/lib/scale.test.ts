import { describe, expect, test } from 'vitest';

import { formatLength, loadScale, makeScale, saveScale, scaleKey } from './scale';

const memory = () => {
  const data = new Map<string, string>();
  return { data, getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
};

describe('makeScale', () => {
  test('a zero-length line cannot set a scale', () => expect(makeScale(0, 1, 'm')).toBeNull());
  test('a negative length is rejected', () => expect(makeScale(200, -1, 'm')).toBeNull());
  test('not-a-number is rejected', () => expect(makeScale(200, Number.NaN, 'm')).toBeNull());
  test('200 px for 1 m', () => expect(makeScale(200, 1, 'm')).toEqual({ pxPerUnit: 200, unit: 'm' }));
});

describe('scale storage', () => {
  test('key is versioned per video', () => expect(scaleKey('sea-lions')).toBe('kelvin-scale-v1:sea-lions'));
  test('round-trips', () => {
    const s = memory();
    expect(saveScale(s, 'a', { pxPerUnit: 200, unit: 'cm' })).toBe(true);
    expect(loadScale(s, 'a')).toEqual({ pxPerUnit: 200, unit: 'cm' });
  });
  test('corrupt or wrong-shaped data gives no scale', () => {
    const s = memory();
    s.data.set(scaleKey('a'), '{bad');
    expect(loadScale(s, 'a')).toBeNull();
    s.data.set(scaleKey('a'), '{"pxPerUnit":-3,"unit":"m"}');
    expect(loadScale(s, 'a')).toBeNull();
  });
  test('no storage gives no scale', () => expect(loadScale(null, 'a')).toBeNull());
});

describe('formatLength', () => {
  test('without a scale: px and % of width', () => expect(formatLength(412, null, 21.5)).toBe('412 px · 21.5 %'));
  test('with a scale in metres', () => expect(formatLength(400, { pxPerUnit: 200, unit: 'm' }, 20)).toBe('2.00 m'));
  test('with a scale in millimetres', () => expect(formatLength(50, { pxPerUnit: 10, unit: 'mm' }, 2)).toBe('5 mm'));
});

import { describe, expect, test } from 'vitest';

import { EXPOSURE_PALETTE, falseColor, zoneOf } from './exposure';

describe('zoneOf', () => {
  test('below 1 % is crushed', () => expect(zoneOf(0.5)).toBe('crushed'));
  test('1–18 % is shadow', () => expect(zoneOf(10)).toBe('shadow'));
  test('18 % starts the mid band', () => expect(zoneOf(18)).toBe('mid'));
  test('50–95 % is highlight', () => expect(zoneOf(60)).toBe('high'));
  test('95 % is still highlight', () => expect(zoneOf(95)).toBe('high'));
  test('above 95 % is clipped', () => expect(zoneOf(96)).toBe('clipped'));
});

describe('falseColor', () => {
  const one = (r: number, g: number, b: number) => ({ data: new Uint8ClampedArray([r, g, b, 255]), width: 1, height: 1 });
  test('white maps to the clipped colour', () => {
    const out = falseColor(one(255, 255, 255), EXPOSURE_PALETTE);
    expect([...out.data.slice(0, 3)]).toEqual(EXPOSURE_PALETTE.clipped);
    expect(out.data[3]).toBe(255);
  });
  test('black maps to the crushed colour', () =>
    expect([...falseColor(one(0, 0, 0), EXPOSURE_PALETTE).data.slice(0, 3)]).toEqual(EXPOSURE_PALETTE.crushed));
  test('transparent pixels stay transparent', () => {
    const out = falseColor({ data: new Uint8ClampedArray([255, 255, 255, 0]), width: 1, height: 1 }, EXPOSURE_PALETTE);
    expect(out.data[3]).toBe(0);
  });
});

import { describe, expect, test } from 'vitest';

import { safeReadPixel } from './pixels';

const ready = { readyState: 4 };

describe('safeReadPixel', () => {
  test('video without a decoded frame is not ready', () =>
    expect(safeReadPixel(() => ({ r: 1, g: 2, b: 3 }), { readyState: 1 })).toEqual({ status: 'notReady' }));
  test('a SecurityError means blocked', () =>
    expect(
      safeReadPixel(() => {
        throw new DOMException('tainted', 'SecurityError');
      }, ready),
    ).toEqual({ status: 'blocked' }));
  test('no reading means blocked', () => expect(safeReadPixel(() => null, ready)).toEqual({ status: 'blocked' }));
  test('a reading is ok', () =>
    expect(safeReadPixel(() => ({ r: 1, g: 2, b: 3 }), ready)).toEqual({ status: 'ok', rgb: { r: 1, g: 2, b: 3 } }));
});

import { averagePatch, patchOrigin } from './pixels';

describe('averagePatch', () => {
  test('a fully transparent patch (frame not drawn) is no reading', () =>
    expect(averagePatch(new Uint8ClampedArray([10, 20, 30, 0, 50, 60, 70, 0]))).toBeNull());
  test('transparent pixels do not darken the average', () =>
    expect(averagePatch(new Uint8ClampedArray([200, 100, 50, 255, 0, 0, 0, 0]))).toEqual({ r: 200, g: 100, b: 50 }));
});

describe('patchOrigin', () => {
  test('keeps the patch inside the frame at the left/top edge', () =>
    expect(patchOrigin(0, 0, 1920, 1080, 5)).toEqual({ x: 0, y: 0 }));
  test('keeps the patch inside the frame at the right/bottom edge', () =>
    expect(patchOrigin(1, 1, 1920, 1080, 5)).toEqual({ x: 1915, y: 1075 }));
  test('centres the patch elsewhere', () => expect(patchOrigin(0.5, 0.5, 1920, 1080, 5)).toEqual({ x: 957.5, y: 537.5 }));
});

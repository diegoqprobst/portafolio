import { describe, expect, test } from 'vitest';

import { sheetGeometry } from './pause-sheet';

describe('sheetGeometry', () => {
  test('wide landscape player puts the sheet beside the picture without overlap', () => {
    const g = sheetGeometry(1280, 720, 1920, 1080);
    expect(g.layout).toBe('side');
    const scale = Number(g.picture.scale);
    expect(1280 - 14 - Number(g.sheet.insetInlineStart)).toBeGreaterThanOrEqual(280);
    expect(Number(g.sheet.insetInlineStart)).toBeGreaterThan(14 + 1280 * scale);
  });
  test('large player lets the picture grow while keeping a 280px sheet column', () => {
    const g = sheetGeometry(1440, 810, 1920, 1080);
    const scale = Number(g.picture.scale);
    expect(scale).toBeGreaterThan(0.7);
    expect(1440 - 14 - Number(g.sheet.insetInlineStart)).toBeGreaterThanOrEqual(280);
    expect(56 + 810 * scale).toBeLessThanOrEqual(810 - 68);
  });
  test('portrait player puts the sheet below the picture', () => {
    const g = sheetGeometry(360, 640, 1920, 1080);
    expect(g.layout).toBe('below');
    expect(Number(g.sheet.top)).toBeGreaterThanOrEqual(56 + 360 * (1080 / 1920));
  });
  test('small landscape player falls back to the compact label', () =>
    expect(sheetGeometry(480, 270, 1920, 1080).layout).toBe('compact'));
});

import { describe, expect, test } from 'vitest';

import type { ColorStrip } from './color-strip';
import { stripBackground } from './strip-css';

const strip: ColorStrip = {
  version: 1,
  duration: 2,
  step: 1,
  slices: [
    { t: 0, meanHex: '#111111', cct: null, luminance: 0, swatches: [{ hex: '#AA0000', share: 0.75 }, { hex: '#00AA00', share: 0.25 }] },
    { t: 1, meanHex: '#111111', cct: null, luminance: 0, swatches: [{ hex: '#0000AA', share: 0.5 }, { hex: '#AAAA00', share: 0.5 }] },
  ],
};

describe('stripBackground', () => {
  const css = stripBackground(strip);
  test('uses horizontal gradients', () => expect(css.startsWith('linear-gradient(to right')).toBe(true));
  test('contains every swatch colour', () => {
    for (const hex of ['#AA0000', '#00AA00', '#0000AA', '#AAAA00']) expect(css).toContain(hex);
  });
  test('slice boundaries fall at 50%', () => expect(css).toContain('50%'));
  test('stacks one layer per band, largest share on top', () => {
    const layers = css.split(/,\s*(?=linear-gradient)/);
    expect(layers.length).toBe(2);
    expect(layers[0]).toContain('#AA0000');
  });
});

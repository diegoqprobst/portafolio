import type { ColorStrip } from './color-strip';

const pct = (n: number) => `${Number((n * 100).toFixed(3))}%`;

/**
 * The colour strip as stacked CSS backgrounds: one horizontal layer per band (largest share on top),
 * each band as tall as its average share, each slice a hard-edged column — like a row of printed swatches.
 * Use as the `background` shorthand.
 */
export function stripBackground(strip: ColorStrip): string {
  const bands = Math.max(...strip.slices.map((s) => s.swatches.length));
  const count = strip.slices.length;
  const heights = Array.from({ length: bands }, (_, band) => {
    const sum = strip.slices.reduce((acc, s) => acc + (s.swatches[band]?.share ?? 0), 0);
    return sum / count;
  });
  const total = heights.reduce((a, b) => a + b, 0) || 1;
  let top = 0;
  return heights
    .map((height, band) => {
      const h = height / total;
      const stops = strip.slices
        .map((slice, i) => {
          const swatch = slice.swatches[band] ?? slice.swatches[slice.swatches.length - 1];
          const color = swatch?.hex ?? slice.meanHex;
          return `${color} ${pct(i / count)} ${pct((i + 1) / count)}`;
        })
        .join(', ');
      const y = h >= 1 ? 0 : top / (1 - h);
      top += h;
      return `linear-gradient(to right, ${stops}) 0 ${pct(y)} / 100% ${pct(h)} no-repeat`;
    })
    .join(', ');
}

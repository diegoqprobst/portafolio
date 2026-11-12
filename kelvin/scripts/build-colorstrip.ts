/**
 * Pre-computes the colour timeline for a video.
 * Usage: npm run colorstrip -- <input> <output.json> [--step 0.25]
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

import { estimateCct, relativeLuminance, toHex } from '../src/video/kelvin/lib/color';
import type { ColorSlice, ColorStrip } from '../src/video/kelvin/lib/color-strip';
import { dominantColors } from '../src/video/kelvin/lib/palette';

const [input, output, ...rest] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: npm run colorstrip -- <input> <output.json> [--step 0.25]');
  process.exit(2);
}
const stepFlag = rest.indexOf('--step');
const step = stepFlag >= 0 ? Number(rest[stepFlag + 1]) : 0.25;

const W = 64;
const H = 36;
const duration = Number(
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', input]).toString().trim(),
);
const raw = execFileSync(
  'ffmpeg',
  ['-v', 'error', '-i', input, '-vf', `fps=1/${step},scale=${W}:${H}:flags=area`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
  { maxBuffer: 1 << 30 },
);

const frameSize = W * H * 3;
const slices: ColorSlice[] = [];
for (let offset = 0, i = 0; offset + frameSize <= raw.length; offset += frameSize, i += 1) {
  const frame = new Uint8Array(raw.buffer, raw.byteOffset + offset, frameSize);
  let r = 0;
  let g = 0;
  let b = 0;
  let lum = 0;
  for (let p = 0; p < frame.length; p += 3) {
    const px = { r: frame[p]!, g: frame[p + 1]!, b: frame[p + 2]! };
    r += px.r;
    g += px.g;
    b += px.b;
    lum += relativeLuminance(px);
  }
  const n = frame.length / 3;
  const meanRgb = { r: r / n, g: g / n, b: b / n };
  slices.push({
    t: Number((i * step).toFixed(3)),
    swatches: dominantColors(frame, 3, 5).map((s) => ({ hex: s.hex, share: Number(s.share.toFixed(4)) })),
    meanHex: toHex(meanRgb),
    cct: estimateCct({ r: Math.round(meanRgb.r), g: Math.round(meanRgb.g), b: Math.round(meanRgb.b) }),
    luminance: Number((lum / n).toFixed(4)),
  });
}

const strip: ColorStrip = { version: 1, duration: Number(duration.toFixed(3)), step, slices };
writeFileSync(output, `${JSON.stringify(strip)}\n`);
console.log(`${slices.length} slices, ${strip.duration}s → ${output}`);

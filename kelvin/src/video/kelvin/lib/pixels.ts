import type { RGB } from './color';

export type PixelReading = { status: 'ok'; rgb: RGB } | { status: 'blocked' } | { status: 'notReady' };

/** HAVE_CURRENT_DATA */
const HAVE_CURRENT_DATA = 2;

/** Wraps a pixel read so tainted canvases, Safari quirks and undecoded frames never throw into the UI. */
export function safeReadPixel(read: () => RGB | null, video: { readyState: number }): PixelReading {
  if (video.readyState < HAVE_CURRENT_DATA) return { status: 'notReady' };
  try {
    const rgb = read();
    return rgb ? { status: 'ok', rgb } : { status: 'blocked' };
  } catch {
    return { status: 'blocked' };
  }
}

/** Top-left of a size×size patch centred on (u, v), clamped so it never reaches outside the frame. */
export function patchOrigin(u: number, v: number, videoWidth: number, videoHeight: number, size: number) {
  const clamp = (n: number, max: number) => Math.min(Math.max(n, 0), Math.max(0, max - size));
  return { x: clamp(u * videoWidth - size / 2, videoWidth), y: clamp(v * videoHeight - size / 2, videoHeight) };
}

/** Alpha-weighted mean of RGBA pixels; null when nothing was drawn (all transparent). */
export function averagePatch(data: Uint8ClampedArray): RGB | null {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  for (let i = 0; i + 3 < data.length; i += 4) {
    const w = data[i + 3]!;
    r += data[i]! * w;
    g += data[i + 1]! * w;
    b += data[i + 2]! * w;
    a += w;
  }
  return a === 0 ? null : { r: Math.round(r / a), g: Math.round(g / a), b: Math.round(b / a) };
}

let scratch: HTMLCanvasElement | null = null;

/** Copies a size×size patch of the current frame centred on (u, v). Throws on a tainted canvas. */
export function readPatch(video: HTMLVideoElement, u: number, v: number, size: number): ImageData | null {
  if (!video.videoWidth || !video.videoHeight) return null;
  scratch ??= document.createElement('canvas');
  scratch.width = size;
  scratch.height = size;
  const context = scratch.getContext('2d', { willReadFrequently: true });
  if (!context) return null;
  const { x, y } = patchOrigin(u, v, video.videoWidth, video.videoHeight, size);
  context.clearRect(0, 0, size, size);
  context.drawImage(video, x, y, size, size, 0, 0, size, size);
  return context.getImageData(0, 0, size, size);
}

/** Mean colour of the 5×5 patch at (u, v); null when the frame could not be drawn. */
export function readPixel(video: HTMLVideoElement, u: number, v: number): RGB | null {
  const patch = readPatch(video, u, v, 5);
  return patch ? averagePatch(patch.data) : null;
}

/** Pixels of a frame region (normalised rect), downsampled to at most `max` px per side. Throws on a tainted canvas. */
export function readRegion(
  video: HTMLVideoElement,
  r: { u: number; v: number; w: number; h: number },
  max = 64,
): ImageData | null {
  if (!video.videoWidth || !video.videoHeight || r.w <= 0 || r.h <= 0) return null;
  const sw = r.w * video.videoWidth;
  const sh = r.h * video.videoHeight;
  const k = Math.min(1, max / Math.max(sw, sh));
  const w = Math.max(1, Math.round(sw * k));
  const h = Math.max(1, Math.round(sh * k));
  scratch ??= document.createElement('canvas');
  scratch.width = w;
  scratch.height = h;
  const context = scratch.getContext('2d', { willReadFrequently: true });
  if (!context) return null;
  context.clearRect(0, 0, w, h);
  context.drawImage(video, r.u * video.videoWidth, r.v * video.videoHeight, sw, sh, 0, 0, w, h);
  return context.getImageData(0, 0, w, h);
}

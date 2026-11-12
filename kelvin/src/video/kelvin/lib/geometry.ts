export type Box = { left: number; top: number; width: number; height: number };

/** Where the picture actually sits inside a <video> box with object-fit: contain. */
export function contentBox(el: Box, videoWidth: number, videoHeight: number): Box {
  // Read fields explicitly: a DOMRect's fields are prototype getters, so `{ ...rect }` copies nothing.
  if (!videoWidth || !videoHeight || !el.width || !el.height)
    return { left: el.left, top: el.top, width: el.width, height: el.height };
  const scale = Math.min(el.width / videoWidth, el.height / videoHeight);
  const width = videoWidth * scale;
  const height = videoHeight * scale;
  return { left: el.left + (el.width - width) / 2, top: el.top + (el.height - height) / 2, width, height };
}

/** Client point → frame coordinates (0–1), or null outside the picture. */
export function pointToUv(x: number, y: number, el: Box, videoWidth: number, videoHeight: number) {
  const box = contentBox(el, videoWidth, videoHeight);
  const u = (x - box.left) / box.width;
  const v = (y - box.top) / box.height;
  const e = 1e-9;
  if (u < -e || u > 1 + e || v < -e || v > 1 + e) return null;
  return { u: Math.min(1, Math.max(0, u)), v: Math.min(1, Math.max(0, v)) };
}

/** Frame coordinates → client point. */
export function uvToPoint(u: number, v: number, el: Box, videoWidth: number, videoHeight: number) {
  const box = contentBox(el, videoWidth, videoHeight);
  return { x: box.left + u * box.width, y: box.top + v * box.height };
}

/** Needle angle for a half-dial: −90° at min, +90° at max, clamped; NaN rests at min. */
export function gaugeAngle(value: number, min: number, max: number): number {
  if (!Number.isFinite(value) || max <= min) return -90;
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));
  return -90 + t * 180;
}

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import type { NoteStorage } from './notes';

export type Unit = 'm' | 'cm' | 'mm';
export type Scale = { pxPerUnit: number; unit: Unit };

const UNITS: Unit[] = ['m', 'cm', 'mm'];

export const scaleKey = (videoId: string) => `kelvin-scale-v1:${videoId}`;

/** A scale from a line of known real length. Null for zero-length lines or non-positive lengths. */
export function makeScale(px: number, length: number, unit: Unit): Scale | null {
  if (!Number.isFinite(px) || !Number.isFinite(length) || px <= 0 || length <= 0) return null;
  return { pxPerUnit: px / length, unit };
}

const isScale = (s: unknown): s is Scale =>
  !!s &&
  typeof s === 'object' &&
  Number.isFinite((s as Scale).pxPerUnit) &&
  (s as Scale).pxPerUnit > 0 &&
  UNITS.includes((s as Scale).unit);

export function loadScale(storage: NoteStorage | null, videoId: string): Scale | null {
  if (!storage) return null;
  try {
    const parsed: unknown = JSON.parse(storage.getItem(scaleKey(videoId)) ?? 'null');
    return isScale(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveScale(storage: NoteStorage | null, videoId: string, scale: Scale | null): boolean {
  if (!storage) return false;
  try {
    storage.setItem(scaleKey(videoId), JSON.stringify(scale));
    return true;
  } catch {
    return false;
  }
}

const DECIMALS: Record<Unit, number> = { m: 2, cm: 1, mm: 0 };

/** "412 px · 21.5 %" before a scale exists; "2.00 m" after (on the reference plane — labelled by the caller). */
export function formatLength(px: number, scale: Scale | null, pctWidth: number): string {
  if (!scale) return `${Math.round(px)} px · ${pctWidth} %`;
  return `${(px / scale.pxPerUnit).toFixed(DECIMALS[scale.unit])} ${scale.unit}`;
}

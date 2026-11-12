/** @jsxImportSource react */

import { usePlayer } from '@videojs/react/video';
import { useEffect, useState } from 'react';

import { useKelvin } from './state';

const SHOW_MS = 2500;

/** Splits "Plate II — Surface" into its plate number and title. */
export function splitChapter(text: string): { plate: string | null; title: string } {
  const match = /^(.+?)\s+[—–-]\s+(.+)$/.exec(text);
  return match ? { plate: match[1]!, title: match[2]! } : { plate: null, title: text };
}

type OverlayState = { last: number; shown: number | null };

/** Caption state machine: show on entering a chapter while playing; pausing always hides it. */
export function nextOverlay(state: OverlayState, index: number, paused: boolean): OverlayState {
  if (paused) return state.last === index && state.shown === null ? state : { last: index, shown: null };
  if (index === state.last) return state;
  return { last: index, shown: index >= 0 ? index : null };
}

/** Catalog caption that appears for a moment when playback enters a new chapter. */
export function ChapterOverlay() {
  const { mode } = useKelvin();
  const chapters = usePlayer((s) => s.chaptersCues);
  const time = usePlayer((s) => s.currentTime);
  const paused = usePlayer((s) => s.paused);
  const index = chapters?.findIndex((c) => time >= c.startTime && time < c.endTime) ?? -1;
  const [state, setState] = useState<OverlayState>({ last: -1, shown: null });
  const shown = state.shown;

  useEffect(() => setState((s) => nextOverlay(s, index, paused)), [index, paused]);

  // The hide timer belongs to the caption being shown, not to the chapter effect.
  useEffect(() => {
    if (shown === null) return;
    const timer = window.setTimeout(() => setState((s) => ({ ...s, shown: null })), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [shown]);

  if (shown === null || mode.sheet || !chapters?.[shown]) return null;
  const { plate, title } = splitChapter(chapters[shown]!.text);
  return (
    <div className="kv-chapter-overlay" aria-hidden="true">
      {plate ? <span className="kv-chapter-plate">{plate}</span> : null}
      <span className="kv-chapter-title">{title}</span>
    </div>
  );
}

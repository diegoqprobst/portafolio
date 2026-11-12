/** @jsxImportSource react */

import { usePlayer } from '@videojs/react/video';
import { useMemo, type CSSProperties, type ReactNode } from 'react';

import { stripBackground } from './lib/strip-css';
import { useKelvin } from './state';

/** Wraps the time slider: prints the colour strip into its track and marks notes above it. */
export function ColorTimeline({ children }: { children: ReactNode }) {
  const { strip, notes } = useKelvin();
  const duration = usePlayer((s) => s.duration);
  const background = useMemo(() => (strip ? stripBackground(strip) : null), [strip]);
  const style = background ? ({ '--kv-strip': background } as CSSProperties) : undefined;
  const ticks = Number.isFinite(duration) && duration > 0 ? notes : [];

  return (
    <div className="kv-seek" data-strip={background ? '' : undefined} style={style}>
      {children}
      {ticks.length > 0 ? (
        <div className="kv-note-ticks" aria-hidden="true">
          {ticks.map((note) => (
            <span
              key={note.id}
              className="kv-note-tick"
              style={{ insetInlineStart: `${Math.min(100, (note.t / duration) * 100)}%` }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import { usePlayer } from '@videojs/react/video';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

import { IconNote } from './icons';
import { estimateCct, toHex } from './lib/color';
import { pointToUv, uvToPoint } from './lib/geometry';
import { routeKey, type ArrowKey } from './lib/mode';
import { readPixel, safeReadPixel, type PixelReading } from './lib/pixels';
import { useKelvin } from './state';
import { TemperatureScale } from './temperature-scale';

const MAG_SIZE = 132;
const ZOOM = 2.5;
const ANNOUNCE_MS = 400;

type Layout = { x: number; y: number; width: number; height: number; picRight: number; picBottom: number } | null;

/** Paused-only precision reticle: magnifier, exact colour, approximate temperature, pinned notes. */
export function Loupe() {
  const { mode, dispatch, labels, addNote, notes, noteOpen, setNoteOpen, getVideo, rootRef } = useKelvin();
  const time = usePlayer((s) => s.currentTime);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const magRef = useRef<HTMLCanvasElement | null>(null);
  const noteRef = useRef<HTMLTextAreaElement | null>(null);
  const [reading, setReading] = useState<PixelReading>({ status: 'notReady' });
  const [layout, setLayout] = useState<Layout>(null);
  const [frame, setFrame] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const active = mode.loupe !== 'off';
  const { u, v } = mode.reticle;

  // Track the picture's position (it moves when the sheet frames it) and new frames after seeking.
  useEffect(() => {
    if (!active) return;
    const video = getVideo();
    if (!video) return;
    const bump = () => setFrame((n) => n + 1);
    video.addEventListener('seeked', bump);
    video.addEventListener('loadeddata', bump);
    video.addEventListener('transitionend', bump);
    window.addEventListener('resize', bump);
    const observer = new ResizeObserver(bump);
    observer.observe(video);
    const settle = window.setTimeout(bump, 320); // after the sheet's framing transition
    return () => {
      video.removeEventListener('seeked', bump);
      video.removeEventListener('loadeddata', bump);
      video.removeEventListener('transitionend', bump);
      window.removeEventListener('resize', bump);
      observer.disconnect();
      window.clearTimeout(settle);
    };
  }, [active, getVideo]);

  useLayoutEffect(() => {
    const video = getVideo();
    const root = rootRef.current;
    if (!active || !video || !root) return setLayout(null);
    const r = root.getBoundingClientRect();
    const vr = video.getBoundingClientRect();
    const p = uvToPoint(u, v, vr, video.videoWidth, video.videoHeight);
    setLayout({
      x: p.x - r.left,
      y: p.y - r.top,
      width: r.width,
      height: r.height,
      picRight: Math.min(vr.right, r.right) - r.left,
      picBottom: Math.min(vr.bottom, r.bottom) - r.top,
    });

    const next = safeReadPixel(() => readPixel(video, u, v), video);
    setReading(next);

    const canvas = magRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context && video.videoWidth) {
      const source = MAG_SIZE / ZOOM / (video.getBoundingClientRect().width / video.videoWidth);
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, MAG_SIZE, MAG_SIZE);
      try {
        context.drawImage(
          video,
          u * video.videoWidth - source / 2,
          v * video.videoHeight - source / 2,
          source,
          source,
          0,
          0,
          MAG_SIZE,
          MAG_SIZE,
        );
      } catch {
        /* drawing an unready frame can throw in some engines; the tag still shows the state */
      }
    }
  }, [active, u, v, frame, getVideo, rootRef]);

  const hex = reading.status === 'ok' ? toHex(reading.rgb) : null;
  const cct = reading.status === 'ok' ? estimateCct(reading.rgb) : null;

  // Keyboard aiming announces the reading, debounced.
  useEffect(() => {
    if (mode.loupe !== 'keyboard') return;
    const timer = window.setTimeout(() => {
      if (reading.status === 'blocked') setAnnouncement(labels.readingUnavailable);
      else if (hex) setAnnouncement(`${hex}. ${labels.temperature} ${cct === null ? '—' : `${labels.approx} ${cct} K`}`);
    }, ANNOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [mode.loupe, reading.status, hex, cct, labels]);

  useEffect(() => {
    if (mode.loupe === 'keyboard' && !noteOpen) layerRef.current?.focus();
  }, [mode.loupe, noteOpen]);

  useEffect(() => {
    if (noteOpen) noteRef.current?.focus();
  }, [noteOpen]);

  // If the loupe had focus when it closes (e.g. Space resumed playback), hand focus to Play
  // so it never falls to <body>, where the player's hotkeys stop working.
  const hadFocus = useRef(false);
  useEffect(() => {
    if (active || !hadFocus.current) return;
    hadFocus.current = false;
    // Wait for the key that resumed playback to be released: a Space keyup on a freshly focused
    // Play button would press it again and pause.
    let done = false;
    const refocus = () => {
      if (done) return;
      done = true;
      window.removeEventListener('keyup', refocus, true);
      const current = document.activeElement;
      if (!current || current === document.body || !rootRef.current?.contains(current)) {
        rootRef.current?.querySelector<HTMLElement>('.kv-key--play')?.focus();
      }
    };
    window.addEventListener('keyup', refocus, true);
    const timer = window.setTimeout(refocus, 400);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keyup', refocus, true);
    };
  }, [active, rootRef]);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (mode.loupe !== 'pointer' || noteOpen) return;
      const video = getVideo();
      if (!video) return;
      const uv = pointToUv(event.clientX, event.clientY, video.getBoundingClientRect(), video.videoWidth, video.videoHeight);
      if (uv) dispatch({ type: 'pointer', ...uv });
    },
    [mode.loupe, noteOpen, getVideo, dispatch],
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (noteOpen || event.button !== 0) return;
      const video = getVideo();
      if (!video) return;
      const uv = pointToUv(event.clientX, event.clientY, video.getBoundingClientRect(), video.videoWidth, video.videoHeight);
      if (!uv) return;
      event.preventDefault(); // keep focus for the note field instead of the layer
      dispatch({ type: 'pointer', ...uv });
      setNoteOpen(true);
    },
    [noteOpen, getVideo, dispatch, setNoteOpen],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (noteOpen || routeKey(mode, event.key) !== 'loupe') return;
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'Enter') setNoteOpen(true);
      else dispatch({ type: 'move', key: event.key as ArrowKey, fine: event.shiftKey });
    },
    [noteOpen, mode, dispatch, setNoteOpen],
  );

  const save = () => {
    const text = noteRef.current?.value.trim() ?? '';
    if (text) addNote({ t: time, u, v, text, hex, cct });
    setNoteOpen(false);
    layerRef.current?.focus();
  };

  if (!active || !layout) return null;

  // The tag stays on the picture: flip it left when it would cross the picture's right edge (or the sheet).
  const flipX = layout.x + 84 + 200 > layout.picRight;
  const flipY = layout.y > layout.picBottom * 0.6;
  const pins = notes.filter((n) => Math.abs(n.t - time) < 0.35);

  return (
    <div
      ref={layerRef}
      className="kv-loupe-layer"
      data-mode={mode.loupe}
      role="application"
      aria-roledescription={labels.loupe}
      aria-label={labels.loupe}
      aria-describedby="kv-loupe-hint"
      tabIndex={0}
      onFocus={() => {
        hadFocus.current = true;
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hadFocus.current = false;
      }}
      onPointerMove={(event) => {
        if ((event.target as HTMLElement).closest('.kv-tag')) return;
        onPointerMove(event);
      }}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest('.kv-tag')) return;
        onPointerDown(event);
      }}
      onKeyDown={onKeyDown}
    >
      <span id="kv-loupe-hint" className="kv-visually-hidden">
        {labels.loupeHint}
      </span>

      {pins.map((note) => {
        const video = getVideo();
        const root = rootRef.current;
        if (!video || !root) return null;
        const r = root.getBoundingClientRect();
        const p = uvToPoint(note.u, note.v, video.getBoundingClientRect(), video.videoWidth, video.videoHeight);
        return (
          <span key={note.id} className="kv-pin" style={{ left: p.x - r.left, top: p.y - r.top }} title={note.text}>
            <IconNote />
          </span>
        );
      })}

      <div className="kv-reticle" style={{ left: layout.x, top: layout.y }} aria-hidden="true">
        <canvas
          ref={magRef}
          className="kv-mag"
          width={MAG_SIZE}
          height={MAG_SIZE}
          data-hidden={reading.status === 'blocked' ? '' : undefined}
        />
        <svg className="kv-crosshair" viewBox="-30 -30 60 60" width="60" height="60">
          <g className="kv-crosshair-edge">
            <circle r="9" />
            <path d="M0 -27V-13M0 13V27M-27 0H-13M13 0H27" />
          </g>
          <g className="kv-crosshair-core">
            <circle r="9" />
            <path d="M0 -27V-13M0 13V27M-27 0H-13M13 0H27" />
          </g>
        </svg>
      </div>

      <div
        className="kv-tag"
        data-flip-x={flipX ? '' : undefined}
        data-flip-y={flipY ? '' : undefined}
        style={{ left: layout.x, top: layout.y }}
      >
        {reading.status === 'ok' ? (
          <>
            <div className="kv-tag-row">
              <span className="kv-swatch" style={{ background: hex ?? undefined }} aria-hidden="true" />
              <span className="kv-tag-hex">{hex}</span>
            </div>
            <div className="kv-tag-row kv-tag-k">
              <span className="kv-tag-label">{labels.temperature}</span>
              <span className="kv-tag-value">{cct === null ? '—' : `≈ ${cct.toLocaleString('en-US')} K`}</span>
            </div>
            <TemperatureScale kelvin={cct} />
          </>
        ) : (
          <p className="kv-tag-note">{reading.status === 'blocked' ? labels.readingUnavailable : labels.readingPending}</p>
        )}

        {noteOpen ? (
          <form
            className="kv-note-form"
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <textarea
              ref={noteRef}
              className="kv-note-input"
              rows={2}
              aria-label={labels.addNote}
              placeholder={labels.notePlaceholder}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  save();
                } else if (event.key === 'Escape') {
                  event.preventDefault();
                  setNoteOpen(false);
                  layerRef.current?.focus();
                }
              }}
            />
            <button type="submit" className="kv-button kv-button--primary">
              {labels.saveNote}
            </button>
          </form>
        ) : (
          <p className="kv-tag-hint" aria-hidden="true">
            {labels.addNote} ↵
          </p>
        )}
      </div>

      <span className="kv-visually-hidden" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}

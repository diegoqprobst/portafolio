/** @jsxImportSource react */

import { usePlayer } from '@videojs/react/video';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

import { Crosshair } from './crosshair';
import { IconNote } from './icons';
import { areaStats, deltaStops, linearRatio, rect, relLum, rulerLength, type AreaStats } from './lib/measure';
import { formatLength, makeScale, type Unit } from './lib/scale';
import { MeasureOverlay } from './measure-overlay';
import { cctReading, formatCct, toHex } from './lib/color';
import { contentBox, pointToUv, uvToPoint } from './lib/geometry';
import { routeKey, type ArrowKey } from './lib/mode';
import { readPixel, readRegion, safeReadPixel, type PixelReading } from './lib/pixels';
import { useKelvin } from './state';
import { TemperatureScale } from './temperature-scale';

const MAG_SIZE = 132;
const ZOOM = 2.5;
const ANNOUNCE_MS = 400;

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
  picRight: number;
  picBottom: number;
  pic: { left: number; top: number; width: number; height: number };
  vw: number;
  vh: number;
} | null;

/** Paused-only precision reticle: magnifier, exact colour, approximate temperature, pinned notes. */
export function Loupe() {
  const { mode, dispatch, labels, addNote, notes, noteOpen, setNoteOpen, getVideo, rootRef, scale, setScale } = useKelvin();
  const time = usePlayer((s) => s.currentTime);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const magRef = useRef<HTMLCanvasElement | null>(null);
  const noteRef = useRef<HTMLTextAreaElement | null>(null);
  const [reading, setReading] = useState<PixelReading>({ status: 'notReady' });
  const [readingA, setReadingA] = useState<PixelReading | null>(null);
  const [area, setArea] = useState<AreaStats | 'blocked' | null>(null);
  const [scaleOpen, setScaleOpen] = useState(false);
  const dragging = useRef(false);
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
      pic: (() => {
        const b = contentBox(vr, video.videoWidth, video.videoHeight);
        return { left: b.left - r.left, top: b.top - r.top, width: b.width, height: b.height };
      })(),
      vw: video.videoWidth,
      vh: video.videoHeight,
    });

    const next = safeReadPixel(() => readPixel(video, u, v), video);
    setReading(next);
    const a = mode.anchor;
    setReadingA(a ? safeReadPixel(() => readPixel(video, a.u, a.v), video) : null);
    const d = mode.drag;
    if (mode.tool === 'area' && d) {
      try {
        const img = readRegion(video, rect(d.from, d.to));
        setArea(img ? areaStats(img) : null);
      } catch {
        setArea('blocked');
      }
    } else setArea(null);

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
  }, [active, u, v, frame, getVideo, rootRef, mode.anchor, mode.drag, mode.tool]);

  const hex = reading.status === 'ok' ? toHex(reading.rgb) : null;
  const cctR = reading.status === 'ok' ? cctReading(reading.rgb) : null;
  const cct = cctR?.kind === 'ok' ? cctR.k : null;
  const cctText = cctR ? formatCct(cctR, labels) : '—';
  const scaleK = cctR?.kind === 'ok' ? cctR.k : cctR?.kind === 'above' ? 10000 : null;

  // Keyboard aiming announces the reading, debounced.
  useEffect(() => {
    if (mode.loupe !== 'keyboard') return;
    const timer = window.setTimeout(() => {
      if (reading.status === 'blocked') setAnnouncement(labels.readingUnavailable);
      else if (hex) setAnnouncement(`${hex}. ${labels.temperature} ${cctR?.kind === 'off' ? labels.offCurve : cctText}`);
    }, ANNOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [mode.loupe, reading.status, hex, cctR?.kind, cctText, labels]);

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

  /** Frame coordinates of a pointer, unclamped, so a drag can run past the picture edge (the reducer clamps). */
  const toUv = useCallback(
    (clientX: number, clientY: number) => {
      const video = getVideo();
      if (!video) return null;
      const box = contentBox(video.getBoundingClientRect(), video.videoWidth, video.videoHeight);
      if (!box.width || !box.height) return null;
      return { u: (clientX - box.left) / box.width, v: (clientY - box.top) / box.height };
    },
    [getVideo],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (noteOpen) return;
      if (dragging.current) {
        const uv = toUv(event.clientX, event.clientY);
        if (uv) {
          dispatch({ type: 'pointer', ...uv });
          dispatch({ type: 'dragTo', ...uv });
        }
        return;
      }
      if (mode.loupe !== 'pointer') return;
      const video = getVideo();
      if (!video) return;
      const uv = pointToUv(event.clientX, event.clientY, video.getBoundingClientRect(), video.videoWidth, video.videoHeight);
      if (uv) dispatch({ type: 'pointer', ...uv });
    },
    [mode.loupe, noteOpen, getVideo, dispatch, toUv],
  );

  /** Mouse: click acts per tool. Touch: a tap only aims (Pin / Set A live in the tag). Area and ruler draw by dragging. */
  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (noteOpen || event.button !== 0) return;
      const video = getVideo();
      if (!video) return;
      const uv = pointToUv(event.clientX, event.clientY, video.getBoundingClientRect(), video.videoWidth, video.videoHeight);
      if (!uv) return;
      const touch = event.pointerType === 'touch';
      dispatch({ type: 'pointer', ...uv });
      if (mode.tool === 'area' || mode.tool === 'ruler') {
        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        dragging.current = true;
        dispatch({ type: 'dragStart' });
        return;
      }
      if (touch) return;
      event.preventDefault(); // keep focus for the note field instead of the layer
      if (mode.tool === 'compare') dispatch({ type: 'setAnchor' });
      else setNoteOpen(true);
    },
    [noteOpen, getVideo, dispatch, setNoteOpen, mode.tool],
  );

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      dragging.current = false;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      dispatch({ type: 'dragEnd' });
    },
    [dispatch],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (noteOpen || routeKey(mode, event.key) !== 'loupe') return;
      event.preventDefault();
      event.stopPropagation();
      if (event.key !== 'Enter') {
        dispatch({ type: 'move', key: event.key as ArrowKey, fine: event.shiftKey });
        return;
      }
      if (mode.tool === 'compare') dispatch({ type: 'setAnchor' });
      else if (mode.tool === 'area' || mode.tool === 'ruler')
        dispatch({ type: mode.drag && !mode.drag.done ? 'dragEnd' : 'dragStart' });
      else setNoteOpen(true);
    },
    [noteOpen, mode, dispatch, setNoteOpen],
  );

  const lumB = reading.status === 'ok' ? relLum(reading.rgb) : null;
  const lumA = readingA?.status === 'ok' ? relLum(readingA.rgb) : null;
  const cctA = readingA?.status === 'ok' ? cctReading(readingA.rgb) : null;
  const compare =
    mode.tool === 'compare' && lumA !== null && lumB !== null
      ? { stops: deltaStops(lumA, lumB), ratio: linearRatio(lumA, lumB) }
      : null;
  const ruler =
    mode.tool === 'ruler' && mode.drag && layout ? rulerLength(mode.drag.from, mode.drag.to, layout.vw, layout.vh) : null;
  const rulerText = ruler ? formatLength(ruler.px, scale, ruler.pctWidth) : null;
  const hint =
    mode.tool === 'compare' ? labels.hintCompare : mode.tool === 'point' ? labels.hintPoint : labels.hintDrag;

  /** Pin the current reading. Measurements keep their geometry and numbers; their text may be empty. */
  const save = () => {
    const text = noteRef.current?.value.trim() ?? '';
    const base = { t: time, text, hex, cct };
    const d = mode.drag;
    if (mode.tool === 'compare' && mode.anchor && compare) {
      addNote({
        ...base,
        kind: 'compare',
        u: mode.anchor.u,
        v: mode.anchor.v,
        geom: { u2: u, v2: v },
        data: { deltaStops: compare.stops.stops, contrast: compare.ratio.ratio, relLum: lumB ?? undefined },
      });
    } else if (mode.tool === 'area' && d && area && area !== 'blocked') {
      addNote({
        ...base,
        hex: area.meanHex,
        cct: area.cct.kind === 'ok' ? area.cct.k : null,
        kind: 'area',
        u: d.from.u,
        v: d.from.v,
        geom: { u2: d.to.u, v2: d.to.v },
        data: { relLum: area.mean, uniformity: area.u0 },
      });
    } else if (mode.tool === 'ruler' && d && ruler) {
      addNote({
        ...base,
        kind: 'ruler',
        u: d.from.u,
        v: d.from.v,
        geom: { u2: d.to.u, v2: d.to.v },
        data: { length: scale ? ruler.px / scale.pxPerUnit : ruler.px },
        unit: scale?.unit ?? 'px',
      });
    } else if (text) {
      addNote({ ...base, kind: 'point', u, v });
    }
    setNoteOpen(false);
    layerRef.current?.focus();
  };

  const submitScale = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next = ruler ? makeScale(ruler.px, Number(data.get('length')), data.get('unit') as Unit) : null;
    if (next) {
      setScale(next);
      setScaleOpen(false);
      layerRef.current?.focus();
    }
  };

  if (!active || !layout) return null;

  // The tag stays on the picture: flip it left when it would cross the picture's right edge (or the sheet).
  const flipX = layout.x + 84 + 272 > layout.picRight;
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
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <span id="kv-loupe-hint" className="kv-visually-hidden">
        {labels.loupeHint}
      </span>

      <Crosshair box={layout.pic} x={layout.x} y={layout.y} videoWidth={layout.vw} videoHeight={layout.vh} />

      <MeasureOverlay
        box={layout.pic}
        tool={mode.tool}
        anchor={mode.anchor}
        from={mode.drag?.from ?? null}
        to={mode.drag?.to ?? null}
        label={rulerText ?? undefined}
      />

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
        {reading.status !== 'ok' ? (
          <p className="kv-tag-note">{reading.status === 'blocked' ? labels.readingUnavailable : labels.readingPending}</p>
        ) : mode.tool === 'compare' && compare && cctA ? (
          <>
            <div className="kv-tag-row kv-tag-k">
              <span className="kv-tag-label">{labels.deltaStops}</span>
              <span className="kv-tag-value">
                {compare.stops.floored ? '≥ ' : ''}
                {Math.abs(compare.stops.stops) < 0.05 ? '' : compare.stops.stops > 0 ? '+' : '−'}
                {Math.abs(compare.stops.stops).toFixed(1)} stops
              </span>
            </div>
            <dl className="kv-tag-grid">
              <dt>{labels.contrast}</dt>
              <dd>
                {compare.ratio.floored ? '≥ ' : ''}
                {compare.ratio.ratio.toFixed(1)} : 1
              </dd>
              <dt>{labels.relLum}</dt>
              <dd>
                A {lumA!.toFixed(1)} % · B {lumB!.toFixed(1)} %
              </dd>
              <dt>{labels.temperature}</dt>
              <dd>
                A {formatCct(cctA, labels)} · B {cctText}
              </dd>
            </dl>
          </>
        ) : mode.tool === 'area' && area === 'blocked' ? (
          <p className="kv-tag-note">{labels.readingUnavailable}</p>
        ) : mode.tool === 'area' && area && area !== 'blocked' ? (
          <>
            <div className="kv-tag-row">
              <span className="kv-swatch" style={{ background: area.meanHex }} aria-hidden="true" />
              <span className="kv-tag-hex">{area.meanHex}</span>
            </div>
            <dl className="kv-tag-grid">
              <dt>{labels.uniformity}</dt>
              <dd>{area.u0.toFixed(2)}</dd>
              <dt>
                {labels.relLum} · {labels.mean}
              </dt>
              <dd>{area.mean.toFixed(1)} %</dd>
              <dt>{labels.minMax}</dt>
              <dd>
                {area.min.toFixed(1)} – {area.max.toFixed(1)} %
              </dd>
              <dt>{labels.temperature}</dt>
              <dd>{formatCct(area.cct, labels)}</dd>
            </dl>
          </>
        ) : mode.tool === 'ruler' && ruler ? (
          <>
            <div className="kv-tag-row kv-tag-k">
              <span className="kv-tag-label">{labels.length}</span>
              <span className="kv-tag-value">{rulerText}</span>
            </div>
            <p className="kv-tag-note">
              {scale ? `${labels.referencePlane} · ${Math.round(ruler.px)} px` : `${ruler.pctWidth} % of frame width`}
            </p>
            {scaleOpen ? (
              <form
                className="kv-scale-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitScale(event.currentTarget);
                }}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === 'Escape') {
                    setScaleOpen(false);
                    layerRef.current?.focus();
                  }
                }}
              >
                <label className="kv-scale-field">
                  <span>{labels.realLength}</span>
                  <input name="length" type="number" min="0" step="any" required autoFocus className="kv-scale-input" />
                </label>
                <select name="unit" defaultValue={scale?.unit ?? 'm'} className="kv-scale-unit" aria-label="Unit">
                  <option value="m">m</option>
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                </select>
                <button type="submit" className="kv-button kv-button--primary">
                  {labels.setScale}
                </button>
              </form>
            ) : (
              <div className="kv-tag-actions">
                <button type="button" className="kv-button" onClick={() => setScaleOpen(true)} disabled={ruler.px <= 0}>
                  {labels.setScale}
                </button>
                {scale ? (
                  <button type="button" className="kv-button" onClick={() => setScale(null)}>
                    {labels.clearScale}
                  </button>
                ) : null}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="kv-tag-row">
              <span className="kv-swatch" style={{ background: hex ?? undefined }} aria-hidden="true" />
              <span className="kv-tag-hex">{hex}</span>
            </div>
            <div className="kv-tag-row kv-tag-k">
              <span className="kv-tag-label">{labels.temperature}</span>
              <span className="kv-tag-value" title={cctR?.kind === 'off' ? labels.offCurve : undefined}>{cctText}</span>
            </div>
            <TemperatureScale kelvin={scaleK} />
          </>
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
          <div className="kv-tag-foot">
            <p className="kv-tag-hint" aria-hidden="true">
              {hint}
            </p>
            <div className="kv-tag-actions">
              {mode.tool === 'compare' ? (
                <button type="button" className="kv-button" onClick={() => dispatch({ type: 'setAnchor' })}>
                  {labels.setA}
                </button>
              ) : null}
              <button type="button" className="kv-button" onClick={() => setNoteOpen(true)}>
                {labels.pin}
              </button>
            </div>
          </div>
        )}
      </div>

      <span className="kv-visually-hidden" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}

/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import { usePlayer } from '@videojs/react/video';
import { useEffect, useLayoutEffect, useState, type CSSProperties } from 'react';

import { splitChapter } from './chapter-overlay';
import { Gauge, SPECTRA } from './gauge';
import { IconClose, IconDownload } from './icons';
import { fromHex, hueOf, temperaturePosition } from './lib/color';
import { sliceAt } from './lib/color-strip';
import { formatTimecode, notesToCsv } from './lib/notes';
import { useKelvin } from './state';

type Layout = 'side' | 'below' | 'compact';
type Geometry = { layout: Layout; picture: CSSProperties; sheet: CSSProperties };

const PAD = 14;
const HEADER = 56;
const BAR = 68;
const SHEET_MIN = 280;

/** Where the picture and the sheet go for this player size. The sheet never covers the picture, except in compact. */
export function sheetGeometry(width: number, height: number, videoWidth: number, videoHeight: number): Geometry {
  const aspect = videoWidth && videoHeight ? videoHeight / videoWidth : 9 / 16;
  if (width >= 720 && height >= width * 0.42) {
    // As large as the height allows, leaving the sheet column at least SHEET_MIN wide.
    const scale = Math.min((height - HEADER - BAR) / height, (width - PAD * 3 - SHEET_MIN) / width);
    return {
      layout: 'side',
      picture: { translate: `${PAD}px ${HEADER}px`, scale: String(scale) },
      sheet: { insetInlineStart: PAD * 2 + width * scale, insetInlineEnd: PAD, top: HEADER, bottom: BAR },
    };
  }
  if (height >= width * 1.1) {
    const pictureHeight = width * aspect;
    const shift = HEADER - (height - pictureHeight) / 2;
    return {
      layout: 'below',
      picture: { translate: `0 ${shift}px` },
      sheet: { insetInline: PAD, top: HEADER + pictureHeight + 10, bottom: BAR },
    };
  }
  return { layout: 'compact', picture: {}, sheet: { insetInline: 10, top: 52 } };
}

function downloadCsv(name: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The paused frame as a page from the catalog: chapter, timecode, palette, gauges, notes. */
export function PauseSheet() {
  const { mode, dispatch, labels, strip, notes, removeNote, videoId, rootRef, getVideo } = useKelvin();
  const store = usePlayer();
  const time = usePlayer((s) => s.currentTime);
  const chapters = usePlayer((s) => s.chaptersCues);
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!mode.sheet || !root) return setGeometry(null);
    const update = () => {
      const video = getVideo();
      const r = root.getBoundingClientRect();
      setGeometry(sheetGeometry(r.width, r.height, video?.videoWidth ?? 0, video?.videoHeight ?? 0));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, [mode.sheet, rootRef, getVideo]);

  // Frame the picture: the video element itself moves, so nothing is drawn over it.
  useEffect(() => {
    const root = rootRef.current;
    const video = getVideo();
    if (!root || !video) return;
    root.dataset.sheetLayout = geometry?.layout ?? '';
    video.style.translate = (geometry?.picture.translate as string) ?? '';
    video.style.scale = (geometry?.picture.scale as string) ?? '';
    return () => {
      video.style.translate = '';
      video.style.scale = '';
      delete root.dataset.sheetLayout;
    };
  }, [geometry, rootRef, getVideo]);

  if (!mode.sheet || !geometry) return null;

  const chapterIndex = chapters?.findIndex((c) => time >= c.startTime && time < c.endTime) ?? -1;
  const chapter = chapterIndex >= 0 ? chapters![chapterIndex]! : null;
  const { plate, title } = chapter ? splitChapter(chapter.text) : { plate: null, title: '' };
  const slice = strip ? sliceAt(strip, time) : null;
  const chapterNotes = notes.filter((n) => (chapter ? n.t >= chapter.startTime && n.t < chapter.endTime : true));
  const close = () => {
    dispatch({ type: 'escape' });
    if (mode.loupe === 'keyboard') dispatch({ type: 'escape' });
    rootRef.current?.querySelector<HTMLElement>('.kv-key--play')?.focus();
  };

  const tempDisplay = slice?.cct ? `≈ ${slice.cct.toLocaleString('en-US')} K` : '—';
  const lumDisplay = slice ? `${Math.round(slice.luminance * 100)} %` : '—';
  const hue = slice ? hueOf(fromHex(slice.meanHex)) : null;

  if (geometry.layout === 'compact') {
    return (
      <section className="kv-sheet kv-sheet--compact" style={geometry.sheet} aria-label={labels.sheetTitle}>
        <span className="kv-sheet-time">{formatTimecode(time)}</span>
        {plate ? <span className="kv-sheet-plate">{plate}</span> : null}
        {slice ? (
          <span className="kv-sheet-chips" aria-hidden="true">
            {slice.swatches.slice(0, 4).map((s) => (
              <span key={s.hex} className="kv-chip" style={{ background: s.hex }} />
            ))}
          </span>
        ) : null}
        {slice ? <span className="kv-sheet-k">{tempDisplay}</span> : null}
      </section>
    );
  }

  return (
    <section className={`kv-sheet kv-sheet--${geometry.layout}`} style={geometry.sheet} aria-label={labels.sheetTitle}>
      <header className="kv-sheet-head">
        <span className="kv-sheet-kicker">{labels.sheetTitle}</span>
        <button type="button" className="kv-icon-button" aria-label={labels.closeSheet} onClick={close}>
          <IconClose />
        </button>
      </header>

      <div className="kv-sheet-chapter">
        {plate ? <span className="kv-sheet-plate">{plate}</span> : null}
        <h2 className="kv-sheet-title">{title || labels.brand}</h2>
        <dl className="kv-sheet-facts">
          <div>
            <dt>{labels.timecode}</dt>
            <dd>{formatTimecode(time)}</dd>
          </div>
        </dl>
      </div>

      {slice ? (
        <>
          <div className="kv-sheet-block">
            <h3 className="kv-sheet-label">{labels.palette}</h3>
            <ul className="kv-palette">
              {slice.swatches.map((s) => (
                <li key={s.hex} style={{ flexGrow: Math.max(0.6, s.share * 10) }}>
                  <span className="kv-palette-chip" style={{ background: s.hex }} aria-hidden="true" />
                  <span className="kv-palette-hex">{s.hex}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="kv-sheet-gauges">
            <Gauge
              label={labels.temperature}
              position={slice.cct ? temperaturePosition(slice.cct) : null}
              display={tempDisplay}
              spectrum={SPECTRA.temperature}
            />
            <Gauge
              label={labels.hue}
              position={hue === null ? null : hue / 360}
              display={hue === null ? '—' : `${hue}°`}
              spectrum={SPECTRA.hue}
            />
            <Gauge label={labels.luminance} position={slice.luminance} display={lumDisplay} spectrum={SPECTRA.luminance} />
          </div>
        </>
      ) : null}

      <div className="kv-sheet-block kv-sheet-notes">
        <h3 className="kv-sheet-label">{labels.notes}</h3>
        {chapterNotes.length === 0 ? (
          <p className="kv-sheet-empty">{labels.noNotes}</p>
        ) : (
          <ol className="kv-notes">
            {chapterNotes.map((note) => (
              <li key={note.id}>
                <button
                  type="button"
                  className="kv-note-time"
                  onClick={() => {
                    store.seek(note.t);
                    dispatch({ type: 'pointer', u: note.u, v: note.v });
                  }}
                >
                  {formatTimecode(note.t)}
                </button>
                <span className="kv-note-text">{note.text}</span>
                <button
                  type="button"
                  className="kv-icon-button kv-icon-button--small"
                  aria-label={`${labels.deleteNote}: ${note.text}`}
                  onClick={() => removeNote(note.id)}
                >
                  <IconClose />
                </button>
              </li>
            ))}
          </ol>
        )}
        {notes.length > 0 ? (
          <button
            type="button"
            className="kv-button"
            onClick={() => downloadCsv(`kelvin-notes-${videoId}.csv`, notesToCsv(notes))}
          >
            <IconDownload width={16} height={16} />
            {labels.exportCsv}
          </button>
        ) : null}
      </div>
    </section>
  );
}

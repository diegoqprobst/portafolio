/** @jsxImportSource react */

import { Container as ContainerPrimitive } from '@videojs/react';
import { usePlayer } from '@videojs/react/video';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

import { DEFAULT_LABELS, type KelvinLabels } from './labels';
import { parseColorStrip, stripMatches, type ColorStrip } from './lib/color-strip';
import { sheetLayout, type SheetLayout } from './lib/geometry';
import { INITIAL_MODE, modeReducer, specimenTime, type Mode, type ModeEvent } from './lib/mode';
import { addNote as add, loadNotes, removeNote as remove, saveNotes, type Note, type NoteStorage } from './lib/notes';
import { loadScale, saveScale, type Scale } from './lib/scale';

export interface KelvinApi {
  mode: Mode;
  dispatch(event: ModeEvent): void;
  labels: KelvinLabels;
  strip: ColorStrip | null;
  notes: Note[];
  addNote(draft: Omit<Note, 'id'>): void;
  removeNote(id: string): void;
  videoId: string;
  noteOpen: boolean;
  setNoteOpen(open: boolean): void;
  rootRef: RefObject<HTMLDivElement | null>;
  getVideo(): HTMLVideoElement | null;
  /** Ruler scale for this video (null = measure in px / % of frame). */
  scale: Scale | null;
  setScale(scale: Scale | null): void;
  /** How the pause sheet is laid out right now (null while it is closed or not measured yet). */
  sheetLayout: SheetLayout | null;
  setSheetLayout(layout: SheetLayout | null): void;
  /** The place in the sheet where the loupe's reading is shown, so nothing floats over the picture. */
  readingSlot: HTMLElement | null;
  setReadingSlot(slot: HTMLElement | null): void;
}

const KelvinContext = createContext<KelvinApi | null>(null);

export function useKelvin(): KelvinApi {
  const api = useContext(KelvinContext);
  if (!api) throw new Error('useKelvin must be used inside KelvinContainer');
  return api;
}

function getStorage(): NoteStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export interface KelvinContainerProps extends Omit<ContainerPrimitive.Props, 'children'> {
  children: ReactNode;
  videoId: string;
  colorStrip?: ColorStrip | string | undefined;
  labels?: Partial<KelvinLabels> | undefined;
  specimen?: Specimen | undefined;
}

/**
 * Open as an instrument instead of a poster: paused on the frame at `t` seconds, sheet open,
 * loupe aimed at (`u`, `v`) in frame fractions (default: the centre). Nothing is played.
 */
export interface Specimen {
  t: number;
  u?: number;
  v?: number;
}

export function KelvinContainer({
  children,
  videoId,
  colorStrip,
  labels: labelOverrides,
  specimen,
  ...props
}: KelvinContainerProps) {
  const store = usePlayer();
  const paused = usePlayer((s) => s.paused);
  const started = usePlayer((s) => s.started);
  const duration = usePlayer((s) => s.duration);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [mode, dispatch] = useReducer(modeReducer, INITIAL_MODE);
  const [notes, setNotes] = useState<Note[]>(() => loadNotes(getStorage(), videoId));
  const [noteOpen, setNoteOpen] = useState(false);
  const [sheetLayoutNow, setSheetLayout] = useState<SheetLayout | null>(null);
  const [readingSlot, setReadingSlot] = useState<HTMLElement | null>(null);
  const [scale, setScaleState] = useState<Scale | null>(() => loadScale(getStorage(), videoId));
  const [rawStrip, setRawStrip] = useState<ColorStrip | null>(() =>
    typeof colorStrip === 'object' ? parseColorStrip(colorStrip) : null,
  );

  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...labelOverrides }), [labelOverrides]);

  useEffect(() => {
    if (typeof colorStrip !== 'string') {
      setRawStrip(colorStrip ? parseColorStrip(colorStrip) : null);
      return;
    }
    let live = true;
    fetch(colorStrip)
      .then((response) => (response.ok ? response.json() : null))
      .then((json: unknown) => live && setRawStrip(parseColorStrip(json)))
      .catch(() => live && setRawStrip(null));
    return () => {
      live = false;
    };
  }, [colorStrip]);

  useEffect(() => {
    setNotes(loadNotes(getStorage(), videoId));
    setScaleState(loadScale(getStorage(), videoId));
  }, [videoId]);

  const setScale = useCallback(
    (next: Scale | null) => {
      setScaleState(next);
      saveScale(getStorage(), videoId, next);
    },
    [videoId],
  );

  useEffect(() => {
    if (!started) return;
    dispatch({ type: paused ? 'pause' : 'play' });
    if (!paused) setNoteOpen(false);
  }, [paused, started]);

  useEffect(() => {
    if (!mode.sheet) return;
    return store.requestControlsLock();
  }, [mode.sheet, store]);

  // Specimen: seek to the chosen frame without playing, and open once that frame is there to read.
  // The poster stays, untouched, where that cannot work well: a player too small to frame the picture
  // (the tools would cover it), or a browser that loads no frame before a gesture (iPhone).
  const startedRef = useRef(started);
  startedRef.current = started;
  const specimenT = specimen?.t;
  const specimenU = specimen?.u ?? 0.5;
  const specimenV = specimen?.v ?? 0.5;
  useEffect(() => {
    if (specimenT === undefined || startedRef.current) return;
    const root = rootRef.current;
    const video = root?.querySelector('video');
    if (!root || !video) return;
    let live = true;
    const roomy = () => {
      const r = root.getBoundingClientRect();
      return sheetLayout(r.width, r.height) !== 'compact';
    };
    // "Nothing has played", read from the element: seeking alone can already flip the store's `started`.
    const untouched = () => live && video.paused && video.played.length === 0 && roomy();
    const open = () => {
      if (untouched()) dispatch({ type: 'specimen', u: specimenU, v: specimenV });
    };
    const onSeeked = () => {
      if (video.readyState >= 2) open();
      else video.addEventListener('loadeddata', open, { once: true });
    };
    const arm = () => {
      if (!untouched()) return;
      video.addEventListener('seeked', onSeeked, { once: true });
      video.currentTime = specimenTime(specimenT, video.duration);
    };
    if (video.readyState >= 1) arm();
    else video.addEventListener('loadedmetadata', arm, { once: true });
    return () => {
      live = false;
      video.removeEventListener('loadedmetadata', arm);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadeddata', open);
    };
  }, [specimenT, specimenU, specimenV]);

  const addNote = useCallback(
    (draft: Omit<Note, 'id'>) =>
      setNotes((current) => {
        const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
        const next = add(current, draft, id);
        saveNotes(getStorage(), videoId, next);
        return next;
      }),
    [videoId],
  );

  const removeNote = useCallback(
    (id: string) =>
      setNotes((current) => {
        const next = remove(current, id);
        saveNotes(getStorage(), videoId, next);
        return next;
      }),
    [videoId],
  );

  const getVideo = useCallback(() => rootRef.current?.querySelector('video') ?? null, []);

  const strip = rawStrip && Number.isFinite(duration) && duration > 0 && stripMatches(rawStrip, duration) ? rawStrip : null;

  const api = useMemo<KelvinApi>(
    () => ({
      mode, dispatch, labels, strip, notes, addNote, removeNote, videoId, noteOpen, setNoteOpen, rootRef, getVideo, scale, setScale,
      sheetLayout: sheetLayoutNow, setSheetLayout, readingSlot, setReadingSlot,
    }),
    [mode, labels, strip, notes, addNote, removeNote, videoId, noteOpen, getVideo, scale, setScale, sheetLayoutNow, readingSlot],
  );

  return (
    <KelvinContext.Provider value={api}>
      <ContainerPrimitive
        ref={rootRef}
        data-sheet={mode.sheet ? '' : undefined}
        data-loupe={mode.loupe === 'off' ? undefined : mode.loupe}
        {...props}
      >
        {children}
      </ContainerPrimitive>
    </KelvinContext.Provider>
  );
}

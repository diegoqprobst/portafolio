/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
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
import { INITIAL_MODE, modeReducer, type Mode, type ModeEvent } from './lib/mode';
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
}

export function KelvinContainer({ children, videoId, colorStrip, labels: labelOverrides, ...props }: KelvinContainerProps) {
  const store = usePlayer();
  const paused = usePlayer((s) => s.paused);
  const started = usePlayer((s) => s.started);
  const duration = usePlayer((s) => s.duration);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [mode, dispatch] = useReducer(modeReducer, INITIAL_MODE);
  const [notes, setNotes] = useState<Note[]>(() => loadNotes(getStorage(), videoId));
  const [noteOpen, setNoteOpen] = useState(false);
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
    () => ({ mode, dispatch, labels, strip, notes, addNote, removeNote, videoId, noteOpen, setNoteOpen, rootRef, getVideo, scale, setScale }),
    [mode, labels, strip, notes, addNote, removeNote, videoId, noteOpen, getVideo, scale, setScale],
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

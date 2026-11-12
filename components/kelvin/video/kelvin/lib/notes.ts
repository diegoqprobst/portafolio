// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
export type NoteKind = 'point' | 'compare' | 'area' | 'ruler';
export type NoteData = { relLum?: number; deltaStops?: number; contrast?: number; uniformity?: number; length?: number };
export type Note = {
  id: string;
  t: number;
  /** First point: the reading, A, the ruler start, or the area corner. */
  u: number;
  v: number;
  text: string;
  hex: string | null;
  cct: number | null;
  kind?: NoteKind;
  /** Second point: B, the ruler end, or the area's opposite corner. */
  geom?: { u2: number; v2: number };
  data?: NoteData;
  /** Unit of data.length ('px' before a scale is set). */
  unit?: string;
};
export type NoteStorage = Pick<Storage, 'getItem' | 'setItem'>;

export const notesKey = (videoId: string) => `kelvin-notes-v1:${videoId}`;

const KINDS: NoteKind[] = ['point', 'compare', 'area', 'ruler'];
const num = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

/** Accepts stored notes from any version: missing kind → point; invalid geometry or data is dropped. */
export function normalizeNote(raw: unknown): Note | null {
  if (!raw || typeof raw !== 'object') return null;
  const x = raw as Record<string, unknown>;
  if (typeof x.id !== 'string' || !num(x.t) || !num(x.u) || !num(x.v) || typeof x.text !== 'string') return null;
  const note: Note = {
    id: x.id,
    t: x.t,
    u: x.u,
    v: x.v,
    text: x.text,
    hex: typeof x.hex === 'string' ? x.hex : null,
    cct: num(x.cct) ? x.cct : null,
    kind: KINDS.includes(x.kind as NoteKind) ? (x.kind as NoteKind) : 'point',
  };
  const g = x.geom as Record<string, unknown> | undefined;
  if (g && typeof g === 'object' && num(g.u2) && num(g.v2)) note.geom = { u2: g.u2, v2: g.v2 };
  if (x.data && typeof x.data === 'object') {
    const d = x.data as Record<string, unknown>;
    const data: NoteData = {};
    for (const k of ['relLum', 'deltaStops', 'contrast', 'uniformity', 'length'] as const) if (num(d[k])) data[k] = d[k];
    note.data = data;
  }
  if (typeof x.unit === 'string') note.unit = x.unit;
  return note;
}

export function loadNotes(storage: NoteStorage | null, videoId: string): Note[] {
  if (!storage) return [];
  try {
    const parsed: unknown = JSON.parse(storage.getItem(notesKey(videoId)) ?? '[]');
    return Array.isArray(parsed) ? parsed.map(normalizeNote).filter((n): n is Note => n !== null) : [];
  } catch {
    return [];
  }
}

export function saveNotes(storage: NoteStorage | null, videoId: string, notes: Note[]): boolean {
  if (!storage) return false;
  try {
    storage.setItem(notesKey(videoId), JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}

export function addNote(notes: Note[], draft: Omit<Note, 'id'>, id: string): Note[] {
  return [...notes, { ...draft, kind: draft.kind ?? 'point', id }].sort((a, b) => a.t - b.t);
}

export function removeNote(notes: Note[], id: string): Note[] {
  return notes.filter((n) => n.id !== id);
}

/** mm:ss.cc */
export function formatTimecode(seconds: number): string {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${(s - m * 60).toFixed(2).padStart(5, '0')}`;
}

const cell = (value: string) => (/[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

const fixed = (n: number | undefined, d: number) => (n === undefined ? '' : n.toFixed(d));

export function notesToCsv(notes: Note[]): string {
  const rows = notes.map((n) =>
    [
      formatTimecode(n.t),
      n.kind ?? 'point',
      n.u.toFixed(3),
      n.v.toFixed(3),
      fixed(n.geom?.u2, 3),
      fixed(n.geom?.v2, 3),
      n.hex ?? '',
      n.cct === null ? '' : String(n.cct),
      fixed(n.data?.relLum, 1),
      fixed(n.data?.deltaStops, 2),
      fixed(n.data?.contrast, 2),
      fixed(n.data?.uniformity, 2),
      fixed(n.data?.length, 2),
      n.unit ?? '',
      cell(n.text),
    ].join(','),
  );
  return `${['time,kind,x,y,x2,y2,hex,cct_k,rel_lum_pct,delta_stops,contrast,uniformity,length,unit,text', ...rows].join('\n')}\n`;
}

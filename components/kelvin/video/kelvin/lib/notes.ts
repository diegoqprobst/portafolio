// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
export type Note = { id: string; t: number; u: number; v: number; text: string; hex: string | null; cct: number | null };
export type NoteStorage = Pick<Storage, 'getItem' | 'setItem'>;

export const notesKey = (videoId: string) => `kelvin-notes-v1:${videoId}`;

const isNote = (n: unknown): n is Note => {
  if (!n || typeof n !== 'object') return false;
  const x = n as Record<string, unknown>;
  return typeof x.id === 'string' && typeof x.t === 'number' && typeof x.u === 'number' && typeof x.v === 'number' && typeof x.text === 'string';
};

export function loadNotes(storage: NoteStorage | null, videoId: string): Note[] {
  if (!storage) return [];
  try {
    const parsed: unknown = JSON.parse(storage.getItem(notesKey(videoId)) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isNote) : [];
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
  return [...notes, { ...draft, id }].sort((a, b) => a.t - b.t);
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

export function notesToCsv(notes: Note[]): string {
  const rows = notes.map((n) =>
    [formatTimecode(n.t), n.u.toFixed(3), n.v.toFixed(3), n.hex ?? '', n.cct === null ? '' : String(n.cct), cell(n.text)].join(','),
  );
  return `${['time,x,y,hex,cct_k,text', ...rows].join('\n')}\n`;
}

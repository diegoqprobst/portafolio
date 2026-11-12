import { describe, expect, test } from 'vitest';

import { addNote, loadNotes, normalizeNote, notesKey, notesToCsv, removeNote, saveNotes, type Note, type NoteStorage } from './notes';

function memory(): NoteStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
}
const throwing: NoteStorage = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
};
const draft = (t: number, text = 'x'): Omit<Note, 'id'> => ({ t, u: 0.5, v: 0.25, text, hex: '#AABBCC', cct: 5400 });

describe('notes storage', () => {
  test('key is versioned per video', () => expect(notesKey('sea-lions')).toBe('kelvin-notes-v1:sea-lions'));
  test('no storage gives no notes', () => expect(loadNotes(null, 'a')).toEqual([]));
  test('storage that throws gives no notes', () => expect(loadNotes(throwing, 'a')).toEqual([]));
  test('corrupt JSON gives no notes', () => {
    const s = memory();
    s.data.set(notesKey('a'), '{bad');
    expect(loadNotes(s, 'a')).toEqual([]);
  });
  test('non-array JSON gives no notes', () => {
    const s = memory();
    s.data.set(notesKey('a'), '{"t":1}');
    expect(loadNotes(s, 'a')).toEqual([]);
  });
  test('round-trips', () => {
    const s = memory();
    const notes = addNote([], draft(1), 'n1');
    expect(saveNotes(s, 'a', notes)).toBe(true);
    expect(loadNotes(s, 'a')).toEqual(notes);
  });
  test('save reports failure when storage throws', () => expect(saveNotes(throwing, 'a', [])).toBe(false));
  test('save reports failure without storage', () => expect(saveNotes(null, 'a', [])).toBe(false));
});

describe('note list', () => {
  test('addNote keeps notes ordered by time', () => {
    const notes = addNote(addNote([], draft(5), 'b'), draft(2), 'a');
    expect(notes.map((n) => n.id)).toEqual(['a', 'b']);
  });
  test('addNote does not mutate its input', () => {
    const before: Note[] = [];
    addNote(before, draft(1), 'a');
    expect(before).toEqual([]);
  });
  test('removeNote drops by id', () => {
    const notes = addNote(addNote([], draft(1), 'a'), draft(2), 'b');
    expect(removeNote(notes, 'a').map((n) => n.id)).toEqual(['b']);
  });
});

describe('notesToCsv', () => {
  test('header and quoting', () => {
    const csv = notesToCsv(addNote([], draft(4.2, 'He said "hi", then left'), 'a'));
    const [header, row] = csv.trim().split('\n');
    expect(header).toBe('time,kind,x,y,x2,y2,hex,cct_k,rel_lum_pct,delta_stops,contrast,uniformity,length,unit,text');
    expect(row).toBe('00:04.20,point,0.500,0.250,,,#AABBCC,5400,,,,,,,"He said ""hi"", then left"');
  });
  test('empty cells for missing readings', () => {
    const csv = notesToCsv(addNote([], { ...draft(0, 'plain'), hex: null, cct: null }, 'a'));
    expect(csv.trim().split('\n')[1]).toBe('00:00.00,point,0.500,0.250,,,,,,,,,,,plain');
  });
  test('newlines in text are quoted', () => {
    const csv = notesToCsv(addNote([], draft(0, 'a\nb'), 'a'));
    expect(csv).toContain('"a\nb"');
  });
});

describe('measurement notes', () => {
  test('an old note without kind loads as a point', () => {
    const n = normalizeNote({ id: 'a', t: 1, u: 0.1, v: 0.2, text: 'x', hex: null, cct: null });
    expect(n?.kind).toBe('point');
  });
  test('a corrupt geometry is dropped, the note survives', () => {
    const n = normalizeNote({ id: 'a', t: 1, u: 0.1, v: 0.2, text: 'x', hex: null, cct: null, kind: 'ruler', geom: 'x' });
    expect(n).not.toBeNull();
    expect(n?.geom).toBeUndefined();
  });
  test('not a note at all is rejected', () => expect(normalizeNote({ t: 1 })).toBeNull());
  test('a compare note exports stops and contrast', () => {
    const csv = notesToCsv(
      addNote(
        [],
        { t: 2, u: 0.1, v: 0.2, text: '', hex: null, cct: null, kind: 'compare', geom: { u2: 0.5, v2: 0.6 }, data: { deltaStops: 1.5, contrast: 2.83, relLum: 30 } },
        'c',
      ),
    );
    expect(csv.trim().split('\n')[1]).toBe('00:02.00,compare,0.100,0.200,0.500,0.600,,,30.0,1.50,2.83,,,,');
  });
  test('an area note exports uniformity', () => {
    const csv = notesToCsv(
      addNote([], { t: 0, u: 0, v: 0, text: 'water', hex: '#7E99A9', cct: null, kind: 'area', geom: { u2: 1, v2: 1 }, data: { relLum: 26, uniformity: 0.42 } }, 'a'),
    );
    expect(csv.trim().split('\n')[1]).toBe('00:00.00,area,0.000,0.000,1.000,1.000,#7E99A9,,26.0,,,0.42,,,water');
  });
  test('a ruler note exports length and unit', () => {
    const csv = notesToCsv(
      addNote([], { t: 0, u: 0, v: 0.5, text: '', hex: null, cct: null, kind: 'ruler', geom: { u2: 0.5, v2: 0.5 }, data: { length: 10 }, unit: 'm' }, 'r'),
    );
    expect(csv.trim().split('\n')[1]).toBe('00:00.00,ruler,0.000,0.500,0.500,0.500,,,,,,,10.00,m,');
  });
});

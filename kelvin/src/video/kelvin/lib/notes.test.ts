import { describe, expect, test } from 'vitest';

import { addNote, loadNotes, notesKey, notesToCsv, removeNote, saveNotes, type Note, type NoteStorage } from './notes';

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
    expect(header).toBe('time,x,y,hex,cct_k,text');
    expect(row).toBe('00:04.20,0.500,0.250,#AABBCC,5400,"He said ""hi"", then left"');
  });
  test('empty cells for missing readings', () => {
    const csv = notesToCsv(addNote([], { ...draft(0, 'plain'), hex: null, cct: null }, 'a'));
    expect(csv.trim().split('\n')[1]).toBe('00:00.00,0.500,0.250,,,plain');
  });
  test('newlines in text are quoted', () => {
    const csv = notesToCsv(addNote([], draft(0, 'a\nb'), 'a'));
    expect(csv).toContain('"a\nb"');
  });
});

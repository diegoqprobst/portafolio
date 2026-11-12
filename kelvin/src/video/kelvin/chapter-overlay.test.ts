import { describe, expect, test } from 'vitest';

import { nextOverlay, splitChapter } from './chapter-overlay';

test('splits plate and title on an em dash', () =>
  expect(splitChapter('Plate II — Surface')).toEqual({ plate: 'Plate II', title: 'Surface' }));
test('keeps plain titles whole', () => expect(splitChapter('Intro')).toEqual({ plate: null, title: 'Intro' }));

describe('nextOverlay', () => {
  test('entering a chapter while playing shows it', () =>
    expect(nextOverlay({ last: -1, shown: null }, 0, false)).toEqual({ last: 0, shown: 0 }));
  test('pausing hides the caption so it cannot get stuck', () =>
    expect(nextOverlay({ last: 0, shown: 0 }, 0, true)).toEqual({ last: 0, shown: null }));
  test('entering a chapter while paused does not show it', () =>
    expect(nextOverlay({ last: 0, shown: null }, 1, true)).toEqual({ last: 1, shown: null }));
  test('staying in the same chapter while playing keeps the state', () =>
    expect(nextOverlay({ last: 0, shown: 0 }, 0, false)).toEqual({ last: 0, shown: 0 }));
});

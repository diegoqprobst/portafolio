import { describe, expect, test } from 'vitest';

import { INITIAL_MODE, modeReducer, routeKey, specimenTime, type Mode } from './mode';

const paused = modeReducer(INITIAL_MODE, { type: 'pause' });
const keyboard = modeReducer(paused, { type: 'loupeKeyboard' });

describe('modeReducer', () => {
  test('starts closed', () =>
    expect(INITIAL_MODE).toEqual({ sheet: false, loupe: 'off', reticle: { u: 0.5, v: 0.5 }, tool: 'point', exposure: false, anchor: null, drag: null }));
  test('pause opens sheet with pointer loupe', () => expect(paused).toMatchObject({ sheet: true, loupe: 'pointer' }));
  test('play closes everything and keeps the reticle', () => {
    const moved = modeReducer(keyboard, { type: 'move', key: 'ArrowRight', fine: false });
    expect(modeReducer(moved, { type: 'play' })).toEqual({ ...INITIAL_MODE, reticle: moved.reticle });
  });
  test('L enters keyboard mode only while paused', () => {
    expect(keyboard.loupe).toBe('keyboard');
    expect(modeReducer(INITIAL_MODE, { type: 'loupeKeyboard' })).toEqual(INITIAL_MODE);
  });
  test('escape steps back: keyboard → pointer → closed', () => {
    const once = modeReducer(keyboard, { type: 'escape' });
    expect(once).toMatchObject({ sheet: true, loupe: 'pointer' });
    expect(modeReducer(once, { type: 'escape' })).toMatchObject({ sheet: false, loupe: 'off' });
  });
  test('escape with nothing open changes nothing', () => expect(modeReducer(INITIAL_MODE, { type: 'escape' })).toBe(INITIAL_MODE));
  test('pointer moves the reticle while the loupe is on', () =>
    expect(modeReducer(paused, { type: 'pointer', u: 0.2, v: 0.9 }).reticle).toEqual({ u: 0.2, v: 0.9 }));
  test('pointer is ignored while the loupe is off', () =>
    expect(modeReducer(INITIAL_MODE, { type: 'pointer', u: 0.2, v: 0.9 })).toBe(INITIAL_MODE));
  test('arrow steps 0.02, Shift steps 0.005', () => {
    expect(modeReducer(keyboard, { type: 'move', key: 'ArrowRight', fine: false }).reticle.u).toBeCloseTo(0.52);
    expect(modeReducer(keyboard, { type: 'move', key: 'ArrowUp', fine: true }).reticle.v).toBeCloseTo(0.495);
  });
  test('moves clamp to the frame', () => {
    const edge: Mode = { ...keyboard, reticle: { u: 0.995, v: 0 } };
    expect(modeReducer(edge, { type: 'move', key: 'ArrowRight', fine: false }).reticle.u).toBe(1);
    expect(modeReducer(edge, { type: 'move', key: 'ArrowUp', fine: false }).reticle.v).toBe(0);
  });
  test('moves are ignored outside keyboard mode', () =>
    expect(modeReducer(paused, { type: 'move', key: 'ArrowRight', fine: false })).toBe(paused));
});

describe('specimen (opening as an instrument)', () => {
  const opened = modeReducer(INITIAL_MODE, { type: 'specimen', u: 0.46, v: 0.6 });

  test('opens the sheet with the pointer loupe aimed at the given point', () =>
    expect(opened).toMatchObject({ sheet: true, loupe: 'pointer', reticle: { u: 0.46, v: 0.6 } }));
  test('clamps the point to the frame', () =>
    expect(modeReducer(INITIAL_MODE, { type: 'specimen', u: 1.4, v: -2 }).reticle).toEqual({ u: 1, v: 0 }));
  test('play closes it like any pause, keeping the reticle', () =>
    expect(modeReducer(opened, { type: 'play' })).toEqual({ ...INITIAL_MODE, reticle: { u: 0.46, v: 0.6 } }));
  test('Escape closes it', () => {
    expect(escapeCloses(opened)).toBe(true);
    expect(modeReducer(opened, { type: 'escape' })).toMatchObject({ sheet: false, loupe: 'off' });
  });
  test('aims a sheet that the seek itself has just opened', () =>
    // Seeking to the frame can already count as "started and paused" and open the sheet at the centre.
    expect(modeReducer(paused, { type: 'specimen', u: 0.46, v: 0.6 })).toMatchObject({
      sheet: true,
      loupe: 'pointer',
      reticle: { u: 0.46, v: 0.6 },
    }));
  test('leaves a measurement in progress alone', () => {
    const withA = modeReducer(modeReducer(paused, { type: 'tool', tool: 'compare' }), { type: 'setAnchor' });
    expect(modeReducer(withA, { type: 'specimen', u: 0.46, v: 0.6 })).toBe(withA);
    const dragging = modeReducer(modeReducer(paused, { type: 'tool', tool: 'ruler' }), { type: 'dragStart' });
    expect(modeReducer(dragging, { type: 'specimen', u: 0.46, v: 0.6 })).toBe(dragging);
  });
  test('leaves keyboard aiming alone', () =>
    expect(modeReducer(keyboard, { type: 'specimen', u: 0.46, v: 0.6 })).toBe(keyboard));
});

describe('specimenTime', () => {
  test('keeps a time inside the clip', () => expect(specimenTime(6.2, 12.4)).toBe(6.2));
  test('pulls a late time back from the very end, so there is a frame to read', () =>
    expect(specimenTime(30, 12.4)).toBeCloseTo(12.3));
  test('never goes below zero', () => expect(specimenTime(-3, 12.4)).toBe(0));
  test('without a known duration it trusts the time', () => {
    expect(specimenTime(6.2, Number.NaN)).toBe(6.2);
    expect(specimenTime(6.2, Number.POSITIVE_INFINITY)).toBe(6.2);
  });
});

describe('routeKey', () => {
  test('Escape is its own route', () => expect(routeKey(paused, 'Escape')).toBe('escape'));
  test('Space reaches the player while the sheet is open', () => expect(routeKey(paused, ' ')).toBe('player'));
  test('arrows go to the loupe in keyboard mode', () => expect(routeKey(keyboard, 'ArrowLeft')).toBe('loupe'));
  test('Enter goes to the loupe in keyboard mode', () => expect(routeKey(keyboard, 'Enter')).toBe('loupe'));
  test('arrows seek when not in keyboard mode', () => expect(routeKey(paused, 'ArrowLeft')).toBe('player'));
  test('K still reaches the player in keyboard mode', () => expect(routeKey(keyboard, 'k')).toBe('player'));
});

describe('measurement tools', () => {
  const at = (m: Mode, u: number, v: number) => modeReducer(m, { type: 'pointer', u, v });

  test('choosing a tool clears A and any drag', () => {
    const withA = modeReducer(modeReducer(paused, { type: 'tool', tool: 'compare' }), { type: 'setAnchor' });
    const next = modeReducer(withA, { type: 'tool', tool: 'ruler' });
    expect(next).toMatchObject({ tool: 'ruler', anchor: null, drag: null });
  });
  test('setAnchor drops A at the reticle', () => {
    const m = modeReducer(at(modeReducer(paused, { type: 'tool', tool: 'compare' }), 0.2, 0.3), { type: 'setAnchor' });
    expect(m.anchor).toEqual({ u: 0.2, v: 0.3 });
  });
  test('play keeps the tool and exposure but drops A and drags', () => {
    let m = modeReducer(modeReducer(paused, { type: 'tool', tool: 'area' }), { type: 'exposure' });
    m = modeReducer(m, { type: 'dragStart' });
    const played = modeReducer(m, { type: 'play' });
    expect(played).toMatchObject({ tool: 'area', exposure: true, anchor: null, drag: null, sheet: false });
  });
  test('exposure toggles', () => {
    const on = modeReducer(paused, { type: 'exposure' });
    expect(on.exposure).toBe(true);
    expect(modeReducer(on, { type: 'exposure' }).exposure).toBe(false);
  });
  test('a drag starts at the reticle, follows, clamps and ends', () => {
    let m = at(modeReducer(paused, { type: 'tool', tool: 'ruler' }), 0.1, 0.1);
    m = modeReducer(m, { type: 'dragStart' });
    m = modeReducer(m, { type: 'dragTo', u: 1.4, v: -0.3 });
    expect(m.drag).toEqual({ from: { u: 0.1, v: 0.1 }, to: { u: 1, v: 0 }, done: false });
    expect(modeReducer(m, { type: 'dragEnd' }).drag?.done).toBe(true);
  });
  test('keyboard arrows grow an unfinished drag', () => {
    let m = modeReducer(modeReducer(paused, { type: 'tool', tool: 'area' }), { type: 'loupeKeyboard' });
    m = modeReducer(m, { type: 'dragStart' });
    m = modeReducer(m, { type: 'move', key: 'ArrowRight', fine: false });
    expect(m.drag?.to.u).toBeCloseTo(0.52);
  });
  test('escape clears a drag, then A, then steps back as before', () => {
    let m = modeReducer(modeReducer(keyboard, { type: 'tool', tool: 'compare' }), { type: 'setAnchor' });
    m = modeReducer(m, { type: 'dragStart' });
    m = modeReducer(m, { type: 'escape' });
    expect(m).toMatchObject({ drag: null, loupe: 'keyboard' });
    expect(m.anchor).not.toBeNull();
    m = modeReducer(m, { type: 'escape' });
    expect(m).toMatchObject({ anchor: null, loupe: 'keyboard' });
    m = modeReducer(m, { type: 'escape' });
    expect(m.loupe).toBe('pointer');
  });
});

describe('routeKey with tools', () => {
  test('digits seek while playing', () => expect(routeKey(INITIAL_MODE, '3')).toBe('player'));
  test('digits pick a tool while paused', () => expect(routeKey(paused, '3')).toBe('tool'));
  test('E and P are tool keys while paused', () => {
    expect(routeKey(paused, 'e')).toBe('tool');
    expect(routeKey(paused, 'P')).toBe('tool');
  });
  test('5 is not a tool', () => expect(routeKey(paused, '5')).toBe('player'));
});

import { escapeCloses } from './mode';

describe('escapeCloses (review fix)', () => {
  test('clearing A does not close the sheet', () => {
    const withA = modeReducer(modeReducer(paused, { type: 'tool', tool: 'compare' }), { type: 'setAnchor' });
    expect(escapeCloses(withA)).toBe(false);
  });
  test('clearing a drag does not close the sheet', () =>
    expect(escapeCloses(modeReducer(modeReducer(paused, { type: 'tool', tool: 'ruler' }), { type: 'dragStart' }))).toBe(false));
  test('leaving keyboard aim does not close the sheet', () => expect(escapeCloses(keyboard)).toBe(false));
  test('plain pointer mode with nothing set closes the sheet', () => expect(escapeCloses(paused)).toBe(true));
});

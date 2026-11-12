import { describe, expect, test } from 'vitest';

import { INITIAL_MODE, modeReducer, routeKey, type Mode } from './mode';

const paused = modeReducer(INITIAL_MODE, { type: 'pause' });
const keyboard = modeReducer(paused, { type: 'loupeKeyboard' });

describe('modeReducer', () => {
  test('starts closed', () => expect(INITIAL_MODE).toEqual({ sheet: false, loupe: 'off', reticle: { u: 0.5, v: 0.5 } }));
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

describe('routeKey', () => {
  test('Escape is its own route', () => expect(routeKey(paused, 'Escape')).toBe('escape'));
  test('Space reaches the player while the sheet is open', () => expect(routeKey(paused, ' ')).toBe('player'));
  test('arrows go to the loupe in keyboard mode', () => expect(routeKey(keyboard, 'ArrowLeft')).toBe('loupe'));
  test('Enter goes to the loupe in keyboard mode', () => expect(routeKey(keyboard, 'Enter')).toBe('loupe'));
  test('arrows seek when not in keyboard mode', () => expect(routeKey(paused, 'ArrowLeft')).toBe('player'));
  test('K still reaches the player in keyboard mode', () => expect(routeKey(keyboard, 'k')).toBe('player'));
});

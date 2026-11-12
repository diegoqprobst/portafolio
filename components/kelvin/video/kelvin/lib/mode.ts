// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
import type { Pt } from './measure';

export type { Pt };
export type Tool = 'point' | 'compare' | 'area' | 'ruler';
export type Drag = { from: Pt; to: Pt; done: boolean };
export type Mode = {
  sheet: boolean;
  loupe: 'off' | 'pointer' | 'keyboard';
  reticle: Pt;
  tool: Tool;
  exposure: boolean;
  /** Point A of the A–B comparison. */
  anchor: Pt | null;
  /** The live area rectangle or ruler line. */
  drag: Drag | null;
};
export type ModeEvent =
  | { type: 'pause' }
  /** Open as an instrument before anything has played: sheet, loupe, and where it aims. */
  | { type: 'specimen'; u: number; v: number }
  | { type: 'tool'; tool: Tool }
  | { type: 'exposure' }
  | { type: 'setAnchor' }
  | { type: 'dragStart' }
  | { type: 'dragTo'; u: number; v: number }
  | { type: 'dragEnd' }
  | { type: 'play' }
  | { type: 'loupeKeyboard' }
  | { type: 'pointer'; u: number; v: number }
  | { type: 'escape' }
  | { type: 'move'; key: ArrowKey; fine: boolean };

export const INITIAL_MODE: Mode = {
  sheet: false,
  loupe: 'off',
  reticle: { u: 0.5, v: 0.5 },
  tool: 'point',
  exposure: false,
  anchor: null,
  drag: null,
};

export const TOOL_KEYS: Record<string, Tool> = { '1': 'point', '2': 'compare', '3': 'area', '4': 'ruler' };

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const DELTA: Record<ArrowKey, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

export function modeReducer(state: Mode, event: ModeEvent): Mode {
  switch (event.type) {
    case 'pause':
      return { ...state, sheet: true, loupe: 'pointer' };
    case 'specimen':
      // Only from the closed state: it never moves a reticle the viewer is already using.
      if (state.sheet || state.loupe !== 'off') return state;
      return { ...state, sheet: true, loupe: 'pointer', reticle: { u: clamp(event.u), v: clamp(event.v) } };
    case 'play':
      return { ...INITIAL_MODE, reticle: state.reticle, tool: state.tool, exposure: state.exposure };
    case 'tool':
      return { ...state, tool: event.tool, anchor: null, drag: null };
    case 'exposure':
      return { ...state, exposure: !state.exposure };
    case 'setAnchor':
      return state.sheet ? { ...state, anchor: { ...state.reticle } } : state;
    case 'dragStart':
      return state.sheet ? { ...state, drag: { from: { ...state.reticle }, to: { ...state.reticle }, done: false } } : state;
    case 'dragTo':
      return state.drag && !state.drag.done
        ? { ...state, drag: { ...state.drag, to: { u: clamp(event.u), v: clamp(event.v) } } }
        : state;
    case 'dragEnd':
      return state.drag ? { ...state, drag: { ...state.drag, done: true } } : state;
    case 'loupeKeyboard':
      return state.sheet ? { ...state, loupe: 'keyboard' } : state;
    case 'pointer':
      return state.loupe === 'off' ? state : { ...state, reticle: { u: clamp(event.u), v: clamp(event.v) } };
    case 'escape':
      if (state.drag) return { ...state, drag: null };
      if (state.anchor) return { ...state, anchor: null };
      if (state.loupe === 'keyboard') return { ...state, loupe: 'pointer' };
      if (state.sheet) return { ...state, sheet: false, loupe: 'off' };
      return state;
    case 'move': {
      if (state.loupe !== 'keyboard') return state;
      const step = event.fine ? 0.005 : 0.02;
      const [du, dv] = DELTA[event.key];
      const reticle = { u: clamp(state.reticle.u + du * step), v: clamp(state.reticle.v + dv * step) };
      const drag = state.drag && !state.drag.done ? { ...state.drag, to: reticle } : state.drag;
      return { ...state, reticle, drag };
    }
  }
}

/**
 * The moment a specimen opens on: inside the clip, and a little before its end so there is a frame to read.
 * With no usable duration yet (a live or still-loading source) the requested time is trusted.
 */
export function specimenTime(t: number, duration: number): number {
  const from = Math.max(0, t);
  return Number.isFinite(duration) && duration > 0 ? Math.min(from, Math.max(0, duration - 0.1)) : from;
}

/** Who handles a keydown: Kelvin's loupe, the scaffold hotkeys, or the Escape ladder. */
export function routeKey(mode: Mode, key: string): 'loupe' | 'player' | 'escape' | 'tool' {
  if (key === 'Escape') return 'escape';
  if (mode.sheet && (key in TOOL_KEYS || /^[eEpP]$/.test(key))) return 'tool';
  if (mode.loupe === 'keyboard' && (key in DELTA || key === 'Enter')) return 'loupe';
  return 'player';
}

/** Whether Escape will close the sheet (so focus should go back to Play), rather than step back one rung. */
export function escapeCloses(mode: Mode): boolean {
  return mode.sheet && !mode.drag && !mode.anchor && mode.loupe !== 'keyboard';
}

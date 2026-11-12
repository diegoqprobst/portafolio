// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
export type Mode = { sheet: boolean; loupe: 'off' | 'pointer' | 'keyboard'; reticle: { u: number; v: number } };
export type ModeEvent =
  | { type: 'pause' }
  | { type: 'play' }
  | { type: 'loupeKeyboard' }
  | { type: 'pointer'; u: number; v: number }
  | { type: 'escape' }
  | { type: 'move'; key: ArrowKey; fine: boolean };

export const INITIAL_MODE: Mode = { sheet: false, loupe: 'off', reticle: { u: 0.5, v: 0.5 } };

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
    case 'play':
      return { ...INITIAL_MODE, reticle: state.reticle };
    case 'loupeKeyboard':
      return state.sheet ? { ...state, loupe: 'keyboard' } : state;
    case 'pointer':
      return state.loupe === 'off' ? state : { ...state, reticle: { u: clamp(event.u), v: clamp(event.v) } };
    case 'escape':
      if (state.loupe === 'keyboard') return { ...state, loupe: 'pointer' };
      if (state.sheet) return { ...state, sheet: false, loupe: 'off' };
      return state;
    case 'move': {
      if (state.loupe !== 'keyboard') return state;
      const step = event.fine ? 0.005 : 0.02;
      const [du, dv] = DELTA[event.key];
      return { ...state, reticle: { u: clamp(state.reticle.u + du * step), v: clamp(state.reticle.v + dv * step) } };
    }
  }
}

/** Who handles a keydown: Kelvin's loupe, the scaffold hotkeys, or the Escape ladder. */
export function routeKey(mode: Mode, key: string): 'loupe' | 'player' | 'escape' {
  if (key === 'Escape') return 'escape';
  if (mode.loupe === 'keyboard' && (key in DELTA || key === 'Enter')) return 'loupe';
  return 'player';
}

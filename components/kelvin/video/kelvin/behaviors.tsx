/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import { useEffect } from 'react';

import { VideoGestures } from '../behaviors/gestures';
import { VideoHotkeys } from '../behaviors/hotkeys';
import { escapeCloses, routeKey, TOOL_KEYS } from './lib/mode';
import { useKelvin } from './state';

const isEditable = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/**
 * Scaffold hotkeys and gestures, routed around Kelvin's tools:
 * arrows aim the reticle in keyboard mode, typing a note silences hotkeys, clicks on the paused picture place notes.
 * Adds X (aim with keyboard) and the Escape ladder: keyboard aim → pointer → close sheet (focus back to Play).
 */
export function KelvinBehaviors() {
  const { mode, dispatch, noteOpen, setNoteOpen, rootRef } = useKelvin();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (noteOpen || isEditable(event.target) || event.defaultPrevented) return;
      if ((event.target as HTMLElement | null)?.closest?.('.media-menu-popup')) return;
      if ((event.key === 'x' || event.key === 'X') && mode.sheet && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        dispatch({ type: 'loupeKeyboard' });
        return;
      }
      const route = routeKey(mode, event.key);
      if (route === 'tool' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        const tool = TOOL_KEYS[event.key];
        if (tool) dispatch({ type: 'tool', tool });
        else if (event.key === 'e' || event.key === 'E') dispatch({ type: 'exposure' });
        else setNoteOpen(true);
        return;
      }
      if (route !== 'escape' || (!mode.sheet && mode.loupe === 'off')) return;
      event.preventDefault();
      const closing = escapeCloses(mode);
      dispatch({ type: 'escape' });
      if (closing) root.querySelector<HTMLElement>('.kv-key--play')?.focus();
    };
    root.addEventListener('keydown', onKeyDown);
    return () => root.removeEventListener('keydown', onKeyDown);
  }, [mode, dispatch, noteOpen, setNoteOpen, rootRef]);

  return (
    <>
      <VideoHotkeys disabled={noteOpen} arrowsDisabled={mode.loupe === 'keyboard'} digitsDisabled={mode.sheet} />
      <VideoGestures disabled={mode.loupe !== 'off'} />
    </>
  );
}

/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import { Hotkey } from '@videojs/react';

import { PlaybackHotkeys } from './playback-hotkeys';

export interface VideoHotkeysProps {
  disabled?: boolean | undefined;
  arrowsDisabled?: boolean | undefined;
}

export function VideoHotkeys({ disabled = false, arrowsDisabled = false }: VideoHotkeysProps = {}) {
  return (
    <>
      <PlaybackHotkeys disabled={disabled} arrowsDisabled={arrowsDisabled} />
      <Hotkey disabled={disabled} keys="f" action="toggleFullscreen" />
      <Hotkey disabled={disabled} keys="c" action="toggleSubtitles" />
      <Hotkey disabled={disabled} keys="i" action="togglePictureInPicture" />
    </>
  );
}

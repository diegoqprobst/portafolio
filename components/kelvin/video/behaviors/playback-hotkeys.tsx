/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import { Hotkey } from '@videojs/react';

export interface PlaybackHotkeysProps {
  disabled?: boolean | undefined;
  /** Kelvin: arrows belong to the loupe reticle while it is aimed with the keyboard. */
  arrowsDisabled?: boolean | undefined;
  /** Kelvin: digits pick measurement tools while paused. */
  digitsDisabled?: boolean | undefined;
}

export function PlaybackHotkeys({ disabled = false, arrowsDisabled = false, digitsDisabled = false }: PlaybackHotkeysProps = {}) {
  const arrows = disabled || arrowsDisabled;
  return (
    <>
      <Hotkey disabled={disabled} keys="Space" action="togglePaused" />
      <Hotkey disabled={disabled} keys="k" action="togglePaused" />
      <Hotkey disabled={disabled} keys="m" action="toggleMuted" />
      <Hotkey disabled={arrows} keys="ArrowRight" action="seekStep" />
      <Hotkey disabled={arrows} keys="ArrowLeft" action="seekStep" />
      <Hotkey disabled={disabled} keys="l" action="seekStep" />
      <Hotkey disabled={disabled} keys="j" action="seekStep" />
      <Hotkey disabled={arrows} keys="ArrowUp" action="volumeStep" />
      <Hotkey disabled={arrows} keys="ArrowDown" action="volumeStep" />
      <Hotkey disabled={disabled || digitsDisabled} keys="0-9" action="seekToPercent" />
      <Hotkey disabled={disabled} keys="Home" action="seekToPercent" value={0} />
      <Hotkey disabled={disabled} keys="End" action="seekToPercent" value={100} />
      <Hotkey disabled={disabled} keys=">" action="speedUp" />
      <Hotkey disabled={disabled} keys="<" action="speedDown" />
    </>
  );
}

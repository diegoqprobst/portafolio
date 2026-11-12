/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import {
  CaptionsButton as CaptionsButtonPrimitive,
  Controls,
  FullscreenButton as FullscreenButtonPrimitive,
  MuteButton as MuteButtonPrimitive,
  PlayButton as PlayButtonPrimitive,
  Time,
  Tooltip,
  VolumeSlider,
} from '@videojs/react';
import { usePlayer } from '@videojs/react/video';

import { cn } from '../../lib/resolve-class-name';

import { Button } from '../shared/button';
import { SettingsMenu } from '../shared/settings-menu';
import { TimeSlider, type ThumbnailSlot } from '../shared/time-slider';
import { ButtonTooltip } from '../shared/tooltip';
import { VideoBufferingIndicator } from '../shared/video-feedback';
import { ChapterOverlay } from './chapter-overlay';
import { ColorTimeline } from './color-timeline';
import {
  IconCaptionsOff,
  IconCaptionsOn,
  IconFullscreen,
  IconFullscreenExit,
  IconMute,
  IconPause,
  IconPlay,
  IconRestart,
  IconVolume,
} from './icons';
import { KelvinMark } from './mark';

function PlayKey() {
  return (
    <ButtonTooltip>
      <PlayButtonPrimitive render={<Button />} className="media-play-button kv-key kv-key--play">
        <IconRestart className="media-button-icon-base media-play-button-restart-icon" />
        <IconPlay className="media-button-icon-base media-play-button-play-icon" />
        <IconPause className="media-button-icon-base media-play-button-pause-icon" />
      </PlayButtonPrimitive>
    </ButtonTooltip>
  );
}

function VolumeKey() {
  return (
    <div className="kv-volume">
      <ButtonTooltip>
        <MuteButtonPrimitive render={<Button />} className="media-mute-button kv-key">
          <IconMute className="media-button-icon media-mute-button-off-icon" />
          <IconVolume className="media-button-icon media-mute-button-high-icon" />
        </MuteButtonPrimitive>
      </ButtonTooltip>
      <VolumeSlider.Root className="kv-volume-slider" orientation="horizontal" thumbAlignment="edge">
        <VolumeSlider.Track className="kv-volume-track">
          <VolumeSlider.Fill className="kv-volume-fill" />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="kv-volume-thumb" />
      </VolumeSlider.Root>
    </div>
  );
}

function CaptionsKey() {
  return (
    <ButtonTooltip>
      <CaptionsButtonPrimitive render={<Button />} className="media-captions-button kv-key kv-key--captions">
        <IconCaptionsOff className="media-button-icon media-captions-button-off-icon" />
        <IconCaptionsOn className="media-button-icon media-captions-button-on-icon" />
      </CaptionsButtonPrimitive>
    </ButtonTooltip>
  );
}

function FullscreenKey() {
  return (
    <ButtonTooltip>
      <FullscreenButtonPrimitive render={<Button />} className="media-fullscreen-button kv-key kv-key--fullscreen">
        <IconFullscreen className="media-button-icon media-fullscreen-button-enter-icon" />
        <IconFullscreenExit className="media-button-icon media-fullscreen-button-exit-icon" />
      </FullscreenButtonPrimitive>
    </ButtonTooltip>
  );
}

/** Blue title band: poster and pause only, never during playback. */
function HeaderBand() {
  const paused = usePlayer((s) => s.paused);
  const started = usePlayer((s) => s.started);
  const chapters = usePlayer((s) => s.chaptersCues);
  const time = usePlayer((s) => s.currentTime);
  const cue = chapters?.find((c) => time >= c.startTime && time < c.endTime);
  if (started && !paused) return null;
  return (
    <div className="kv-header">
      <KelvinMark />
      {cue ? <span className="kv-header-chapter">{cue.text}</span> : null}
    </div>
  );
}

/** One row, always: play · time · seek · volume · captions · settings · fullscreen. */
export function KelvinBar({ renderThumbnail }: ThumbnailSlot = {}) {
  return (
    <Controls.Root>
      <Controls.Backdrop className="video-controls-backdrop kv-backdrop" />
      <VideoBufferingIndicator />
      <Controls.Content className="video-controls-content kv-controls">
        <Tooltip.Provider>
          <HeaderBand />
          <ChapterOverlay />
          <div className="kv-corner">
            <SettingsMenu />
            <FullscreenKey />
          </div>
          <div className="video-controls-bottom kv-bar">
            <Controls.Group className="kv-row">
              <PlayKey />
              <Time.Group className={cn('media-time-group', 'kv-time')}>
                <Time.Value className="kv-time-current" type="current" />
                <Time.Separator className="kv-time-sep" />
                <Time.Value className="kv-time-duration" type="duration" />
              </Time.Group>
              <ColorTimeline>
                <TimeSlider renderThumbnail={renderThumbnail} />
              </ColorTimeline>
              <VolumeKey />
              <CaptionsKey />
              <div className="kv-settings kv-wide-only">
                <SettingsMenu />
              </div>
              <div className="kv-wide-only">
                <FullscreenKey />
              </div>
            </Controls.Group>
          </div>
        </Tooltip.Provider>
      </Controls.Content>
    </Controls.Root>
  );
}

/** @jsxImportSource react */

'use client';

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import '../styles/video/scaffold.css';
import './skin.css';
import './kelvin/kelvin.css';
import type { Container as ContainerPrimitive, Poster as PosterPrimitive, Slider as SliderPrimitive } from '@videojs/react';
import type { ReactNode } from 'react';

import { cn } from '../lib/resolve-class-name';

import type { KelvinLabels } from './kelvin/labels';
import type { ColorStrip } from './kelvin/lib/color-strip';
import { KelvinContainer, type Specimen } from './kelvin/state';
import { KelvinBar } from './kelvin/bar';
import { KelvinBehaviors } from './kelvin/behaviors';
import { Loupe } from './kelvin/loupe';
import { PauseSheet } from './kelvin/pause-sheet';
import { ErrorDialog } from './shared/error-dialog';
import { Indicators } from './shared/indicators';
import { SeekIndicator } from './shared/seek-indicator';
import { StatusAnnouncer } from './shared/status-announcer';
import { Poster } from './shared/video-feedback';

export interface VideoSkinProps extends Omit<ContainerPrimitive.Props, 'children'> {
  children?: ReactNode;
  renderPoster?: PosterPrimitive.ImageProps['render'];
  renderThumbnail?: SliderPrimitive.Thumbnail.ImageProps['render'];
  /** Stable id for this video; notes are stored per id. */
  videoId: string;
  /** Pre-computed colour timeline (object or URL). Omit for a plain track. */
  colorStrip?: ColorStrip | string;
  labels?: Partial<KelvinLabels>;
  /**
   * Open as an instrument instead of a poster: paused on the frame at `t` seconds with the sheet
   * open and the loupe aimed at (`u`, `v`). Nothing plays; Play or Escape closes it as usual.
   * Where the browser loads no frame before a gesture, the poster stays.
   */
  specimen?: Specimen;
}

export function VideoSkin({ children, className, renderPoster, renderThumbnail, ...props }: VideoSkinProps) {
  return (
    <KelvinContainer
      className={cn('media-skin', 'media-container', 'media-video', 'kv', className)}
      data-theme="scaffold"
      data-preset="video"
      {...props}
    >
      {children}
      <Poster renderImage={renderPoster} />
      <ErrorDialog />
      <KelvinBar renderThumbnail={renderThumbnail} />
      <Loupe />
      <PauseSheet />

      <KelvinBehaviors />
      <StatusAnnouncer />
      <Indicators>
        <SeekIndicator />
      </Indicators>
    </KelvinContainer>
  );
}

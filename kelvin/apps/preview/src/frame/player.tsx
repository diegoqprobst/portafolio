import { MuxVideo } from '@videojs/react/media/mux-video';
import { Video, VideoPlayer } from '@videojs/react/video';

import { VideoSkin } from '@/video/skin';

import type { PlaybackProps } from '../shell/params';

// What the preview plays: Diego's own footage. Set VITE_MUX_PLAYBACK_ID to stream it from Mux;
// without it, the local copy in apps/preview/public/media is used (development only).
const MUX_ID = import.meta.env.VITE_MUX_PLAYBACK_ID as string | undefined;
const SRC = MUX_ID ? `https://stream.mux.com/${MUX_ID}.m3u8` : './media/sea-lions.mp4';
const POSTER = MUX_ID ? `https://image.mux.com/${MUX_ID}/thumbnail.jpg?time=6` : './media/poster.jpg';
/** Chapters for the time slider, served from `apps/preview/public`. */
const CHAPTERS = './kelvin-chapters.vtt';
const STRIP = './kelvin-colorstrip.json';

/** `media` carries the workbench's playback options: autoplay, muted, loop, and preload. */
export function Player({ media }: { media?: PlaybackProps }) {
  const track = <track kind="chapters" label="English" srcLang="en" src={CHAPTERS} default />;
  return (
    <VideoPlayer poster={POSTER}>
      <VideoSkin videoId="sea-lions" colorStrip={STRIP}>
        {MUX_ID ? (
          <MuxVideo {...media} src={SRC} playsInline crossOrigin="" loop>
            {track}
          </MuxVideo>
        ) : (
          <Video {...media} src={SRC} playsInline crossOrigin="" loop>
            {track}
          </Video>
        )}
      </VideoSkin>
    </VideoPlayer>
  );
}

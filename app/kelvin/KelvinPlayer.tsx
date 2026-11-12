"use client";

import { MuxVideo } from "@videojs/react/media/mux-video";
import { Video, VideoPlayer } from "@videojs/react/video";

import "@/components/kelvin/skin.css";
import { VideoSkin } from "@/components/kelvin/video/skin";

// Streams Diego's clip from Mux when a public playback ID is set; otherwise plays the same clip
// from the site itself (/assets/video/reel.mp4, same-origin, so the loupe can read its pixels).
const MUX_ID = process.env.NEXT_PUBLIC_KELVIN_MUX_PLAYBACK_ID;

// Where the player opens when it starts as an instrument: dusk, loupe on the wall where it still catches the warm sky.
const SPECIMEN = { t: 15.7, u: 0.64, v: 0.56 };

/** `specimen` opens paused on that frame with the sheet and loupe showing. Off on the home cover, where the player is small. */
export default function KelvinPlayer({ specimen = false }: { specimen?: boolean }) {
  const track = <track kind="chapters" label="English" srcLang="en" src="/kelvin/kelvin-chapters.vtt" default />;
  const poster = MUX_ID ? `https://image.mux.com/${MUX_ID}/thumbnail.jpg?time=15.7` : "/assets/video/reel-poster.jpg";
  return (
    <VideoPlayer poster={poster}>
      <VideoSkin videoId="kelvin-reel" colorStrip="/kelvin/kelvin-colorstrip.json" specimen={specimen ? SPECIMEN : undefined}>
        {MUX_ID ? (
          <MuxVideo src={`https://stream.mux.com/${MUX_ID}.m3u8`} playsInline crossOrigin="" loop>
            {track}
          </MuxVideo>
        ) : (
          <Video src="/assets/video/reel.mp4" playsInline crossOrigin="" loop>
            {track}
          </Video>
        )}
      </VideoSkin>
    </VideoPlayer>
  );
}

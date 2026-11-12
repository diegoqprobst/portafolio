"use client";

import { MuxVideo } from "@videojs/react/media/mux-video";
import { Video, VideoPlayer } from "@videojs/react/video";

import "@/components/kelvin/skin.css";
import { VideoSkin } from "@/components/kelvin/video/skin";

// Streams Diego's clip from Mux when a public playback ID is set; otherwise plays the same clip
// from the site itself (/assets/video/reel.mp4, same-origin, so the loupe can read its pixels).
const MUX_ID = process.env.NEXT_PUBLIC_KELVIN_MUX_PLAYBACK_ID;

export default function KelvinPlayer() {
  const track = <track kind="chapters" label="English" srcLang="en" src="/kelvin/kelvin-chapters.vtt" default />;
  const poster = MUX_ID ? `https://image.mux.com/${MUX_ID}/thumbnail.jpg?time=6` : "/assets/video/reel-poster.jpg";
  return (
    <VideoPlayer poster={poster}>
      <VideoSkin videoId="sea-lions" colorStrip="/kelvin/kelvin-colorstrip.json">
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

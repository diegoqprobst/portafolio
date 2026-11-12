"use client";

import { MuxVideo } from "@videojs/react/media/mux-video";
import { Video, VideoPlayer } from "@videojs/react/video";

import "@/components/kelvin/skin.css";
import { VideoSkin } from "@/components/kelvin/video/skin";

// Production streams Diego's clip from Mux (public playback ID). Without it, the local
// copy in public/kelvin/media is used — that folder is git-ignored, so it only exists in dev.
const MUX_ID = process.env.NEXT_PUBLIC_KELVIN_MUX_PLAYBACK_ID;

export default function KelvinPlayer() {
  const track = <track kind="chapters" label="English" srcLang="en" src="/kelvin/kelvin-chapters.vtt" default />;
  const poster = MUX_ID ? `https://image.mux.com/${MUX_ID}/thumbnail.jpg?time=6` : "/kelvin/poster.jpg";
  return (
    <VideoPlayer poster={poster}>
      <VideoSkin videoId="sea-lions" colorStrip="/kelvin/kelvin-colorstrip.json">
        {MUX_ID ? (
          <MuxVideo src={`https://stream.mux.com/${MUX_ID}.m3u8`} playsInline crossOrigin="" loop>
            {track}
          </MuxVideo>
        ) : (
          <Video src="/kelvin/media/sea-lions.mp4" playsInline crossOrigin="" loop>
            {track}
          </Video>
        )}
      </VideoSkin>
    </VideoPlayer>
  );
}

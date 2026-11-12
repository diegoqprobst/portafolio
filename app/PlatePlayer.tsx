"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

// La lámina en movimiento: un reproductor Video.js montado a mano para poder
// vestirlo entero con el sistema del folleto (controles cuadrados, barra de
// progreso impresa en la segunda tinta, tiempos en la tipografía de la
// página). La piel vive en umbrella.css bajo `.u-player`.
//
// El elemento <video-js> se crea en el efecto en vez de ponerlo en el JSX:
// Video.js reemplaza el nodo al inicializar, y si React lo tuviera en su árbol
// se pelearían al desmontar.
export default function PlatePlayer({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const holderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder || playerRef.current) return;

    const el = document.createElement("video-js");
    el.classList.add("vjs-big-play-centered");
    el.setAttribute("aria-label", label);
    holder.appendChild(el);

    playerRef.current = videojs(el, {
      controls: true,
      preload: "metadata",
      fluid: true,
      playsinline: true,
      poster,
      sources: [{ src, type: "video/mp4" }],
      controlBar: { pictureInPictureToggle: false },
      userActions: { hotkeys: true },
    });

    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, [src, poster, label]);

  return <div className="u-player" ref={holderRef} data-vjs-player />;
}

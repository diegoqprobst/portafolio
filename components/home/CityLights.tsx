"use client";

import { useEffect, useRef } from "react";

// Skyline de Lumen — "una ciudad que prende las luces".
// Silueta arquitectónica en tinta sobre el papel claro; las ventanas se
// encienden en ámbar al pasar el cursor, con un titileo ambiental para que la
// ciudad respire sola. Tema de un estudio de iluminación llevado al hero.
// Canvas + rAF; respeta prefers-reduced-motion (ciudad estática con algunas
// ventanas encendidas). Anclado al fondo del hero, detrás del contenido.
export default function CityLights() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const INK = [54, 46, 36];   // tinta cálida (edificios/ventanas apagadas)
    const LIT = [247, 182, 78]; // ámbar encendido (ventana con luz)

    type Win = { x: number; y: number; w: number; h: number; amb: number; ph: number; a: number };
    type Bld = { x: number; w: number; h: number; wins: Win[] };
    let w = 0, h = 0;
    let blds: Bld[] = [];
    const ptr = { x: -9999, y: -9999, on: false };
    let lastW = 0, lastH = 0;

    function rnd(min: number, max: number) { return min + Math.random() * (max - min); }
    function rgba(c: number[], a: number) { return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }

    function build() {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return false;
      if (Math.abs(rect.width - lastW) < 1 && Math.abs(rect.height - lastH) < 1) return true;
      lastW = rect.width; lastH = rect.height;
      w = rect.width; h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      blds = [];
      let x = -rnd(0, 30);
      while (x < w) {
        const bw = rnd(40, 104);
        const bh = h * rnd(0.34, 0.96);
        const wins: Win[] = [];
        const ww = rnd(4.5, 7);
        const stepX = ww + rnd(7, 11);
        const stepY = ww + rnd(9, 13);
        const pad = 9;
        const cols = Math.max(1, Math.floor((bw - pad * 2) / stepX));
        const rows = Math.max(1, Math.floor((bh - pad * 1.5) / stepY));
        const offX = (bw - (cols - 1) * stepX) / 2;
        const top = h - bh;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            wins.push({
              x: x + offX + c * stepX - ww / 2,
              y: top + pad + r * stepY,
              w: ww,
              h: ww * 1.35,
              amb: Math.random() < 0.15 ? rnd(0.35, 0.85) : 0,
              ph: Math.random() * Math.PI * 2,
              a: 0,
            });
          }
        }
        blds.push({ x, w: bw, h: bh, wins });
        x += bw + (Math.random() < 0.32 ? rnd(5, 16) : 0);
      }
      return true;
    }

    const R = 150, R2 = R * R;
    let t = 0;
    let raf = 0;

    function draw(animate: boolean) {
      if (blds.length === 0 && !build()) {
        if (animate) raf = requestAnimationFrame(() => draw(true));
        return;
      }
      ctx!.clearRect(0, 0, w, h);
      t += 0.016;

      // Siluetas de los edificios: relleno tenue + canto superior en tinta.
      for (const b of blds) {
        const top = h - b.h;
        ctx!.fillStyle = rgba(INK, 0.045);
        ctx!.fillRect(b.x, top, b.w, b.h);
        ctx!.strokeStyle = rgba(INK, 0.16);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(b.x + 0.5, h);
        ctx!.lineTo(b.x + 0.5, top + 0.5);
        ctx!.lineTo(b.x + b.w - 0.5, top + 0.5);
        ctx!.lineTo(b.x + b.w - 0.5, h);
        ctx!.stroke();
      }

      // Ventanas: ambiental (titileo) + activación por cercanía del cursor.
      for (const b of blds) {
        for (const win of b.wins) {
          if (ptr.on) {
            const cx = win.x + win.w / 2, cy = win.y + win.h / 2;
            const dx = cx - ptr.x, dy = cy - ptr.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < R2) {
              const prox = 1 - Math.sqrt(d2) / R;
              if (prox > win.a) win.a = prox;
            }
          }
          win.a *= 0.93;
          const amb = animate ? win.amb * (0.5 + 0.5 * Math.sin(t * 1.1 + win.ph)) : win.amb;
          const lit = Math.max(amb, win.a);
          if (lit > 0.05) {
            ctx!.shadowBlur = 4 + lit * 12;
            ctx!.shadowColor = rgba(LIT, lit * 0.85);
            ctx!.fillStyle = rgba(LIT, 0.35 + lit * 0.6);
          } else {
            ctx!.shadowBlur = 0;
            ctx!.fillStyle = rgba(INK, 0.12);
          }
          ctx!.fillRect(win.x, win.y, win.w, win.h);
        }
      }
      ctx!.shadowBlur = 0;

      if (animate) raf = requestAnimationFrame(() => draw(true));
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ptr.on = x >= -R && x <= w + R && y >= -R && y <= h + R;
      ptr.x = x; ptr.y = y;
    }
    function onLeave() { ptr.on = false; }

    const ro = new ResizeObserver(() => {
      if (build() && reduce) draw(false);
    });
    ro.observe(canvas);

    if (reduce) {
      build();
      draw(false);
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(() => draw(true));
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="lumen-city" aria-hidden="true" />;
}

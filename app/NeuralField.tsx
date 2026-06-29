"use client";

import { useEffect, useRef } from "react";

// Campo neuronal del hero umbrella — "una mente encendida por dentro".
// Una constelación de nodos enlazados a sus vecinos; al pasar el cursor, los
// nodos cercanos se encienden en ámbar (la luz) y la activación se propaga por
// las conexiones, como una señal que viaja. En reposo deriva y respira tenue.
// Canvas + rAF; respeta prefers-reduced-motion (render estático). Cubre todo el
// hero detrás del texto (pointer-events: none; escucha el puntero en window).
export default function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Colores: reposo frío-tenue (la mente en calma) → activo cálido (encendida).
    const IDLE = [150, 162, 205];
    const WARM = [248, 188, 88];

    type Node = { x: number; y: number; vx: number; vy: number; a: number; ph: number };
    let w = 0, h = 0;
    let nodes: Node[] = [];
    let edges: [number, number][] = [];
    const ptr = { x: -9999, y: -9999, on: false };

    function build() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      if (w === 0 || h === 0) return;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(26, Math.min(60, Math.round((w * h) / 24000)));
      nodes = Array.from({ length: count }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x, y,
          vx: (Math.random() - 0.5) * 0.07,
          vy: (Math.random() - 0.5) * 0.07,
          a: 0,
          ph: Math.random() * Math.PI * 2,
        };
      });

      // Enlaza cada nodo a sus 2–3 vecinos más cercanos (red dispersa).
      const set = new Set<string>();
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        const d: [number, number][] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          d.push([dx * dx + dy * dy, j]);
        }
        d.sort((a, b) => a[0] - b[0]);
        const k = 2 + (i % 2);
        for (let n = 0; n < k && n < d.length; n++) {
          const j = d[n][1];
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (set.has(key)) continue;
          set.add(key);
          edges.push(i < j ? [i, j] : [j, i]);
        }
      }
    }

    const R = 170;        // radio de influencia del puntero
    const R2 = R * R;
    let t = 0;
    let raf = 0;

    function rgba(c: number[], al: number) {
      return `rgba(${c[0]},${c[1]},${c[2]},${al})`;
    }
    function mix(a: number[], b: number[], k: number) {
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    }

    function draw(animate: boolean) {
      // Auto-reparación: si aún no hay red (el layout tardó en dar tamaño),
      // reintenta construir cada frame hasta lograrlo. Cero dependencia del
      // timing del observer.
      if (nodes.length === 0) tryBuild();
      ctx!.clearRect(0, 0, w, h);
      t += 0.016;

      // Nodos: deriva suave + activación por proximidad al puntero + decaimiento.
      for (const n of nodes) {
        if (animate) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          n.x = Math.max(0, Math.min(w, n.x));
          n.y = Math.max(0, Math.min(h, n.y));
        }
        if (ptr.on) {
          const dx = n.x - ptr.x, dy = n.y - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const prox = 1 - Math.sqrt(d2) / R;
            if (prox > n.a) n.a = prox;
          }
        }
        n.a *= 0.945;
      }

      // Propagación: la señal viaja un paso por las conexiones.
      if (ptr.on) {
        for (const [i, j] of edges) {
          const s = nodes[i].a * 0.5 - 0.04;
          if (s > nodes[j].a) nodes[j].a = s;
          const s2 = nodes[j].a * 0.5 - 0.04;
          if (s2 > nodes[i].a) nodes[i].a = s2;
        }
      }

      // Aristas: alfa e intensidad según la activación de sus extremos.
      ctx!.lineWidth = 1;
      for (const [i, j] of edges) {
        const a = Math.max(nodes[i].a, nodes[j].a);
        const al = 0.08 + a * 0.52;
        ctx!.strokeStyle = rgba(mix(IDLE, WARM, a), al);
        ctx!.beginPath();
        ctx!.moveTo(nodes[i].x, nodes[i].y);
        ctx!.lineTo(nodes[j].x, nodes[j].y);
        ctx!.stroke();
      }

      // Nodos: radio y resplandor crecen con la activación; respiración tenue.
      for (const n of nodes) {
        const breathe = animate ? 0.5 + 0.5 * Math.sin(t * 0.7 + n.ph) : 1;
        const a = n.a;
        const col = mix(IDLE, WARM, a);
        const r = 1.1 + a * 2.6 + breathe * 0.5;
        if (a > 0.05) {
          ctx!.shadowBlur = 6 + a * 16;
          ctx!.shadowColor = rgba(WARM, a * 0.9);
        } else {
          ctx!.shadowBlur = 0;
        }
        ctx!.fillStyle = rgba(col, 0.42 + a * 0.56);
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx!.fill();
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

    // Sizing robusto: el efecto corre antes de que el layout asiente la altura
    // del hero, así que getBoundingClientRect puede dar 0 al principio.
    // tryBuild() solo (re)construye con tamaño válido; initBuild reintenta por
    // rAF hasta tenerlo, y el ResizeObserver cubre cambios posteriores.
    let lastW = 0, lastH = 0;
    function tryBuild() {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return false;
      if (Math.abs(rect.width - lastW) < 1 && Math.abs(rect.height - lastH) < 1) return true;
      lastW = rect.width; lastH = rect.height;
      build();
      if (reduce) draw(false);
      return true;
    }
    let tries = 0;
    let initRaf = 0;
    function initBuild() {
      if (tryBuild() || tries++ > 90) return;
      initRaf = requestAnimationFrame(initBuild);
    }
    initBuild();
    const ro = new ResizeObserver(() => tryBuild());
    ro.observe(canvas);

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(() => draw(true)); // el loop arranca y dibuja en cuanto build() puebla
    }

    return () => {
      cancelAnimationFrame(raf);
      if (initRaf) cancelAnimationFrame(initRaf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="u-neural" aria-hidden="true" />;
}

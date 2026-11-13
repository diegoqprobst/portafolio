"use client";

import { useEffect, useRef } from "react";
import "./zoom.css";

// El zoom de siete planos: la cámara entra desde una ciudad hasta una luminaria, la caja en la que
// vino de fábrica y, por último, su ficha técnica. Los cuatro primeros planos van a color y los dos
// siguientes en línea teñida: el mundo real se convierte en documentación.
//
// Las imágenes viven en /public/zoom. Cada una es un cuadrado recortado alrededor de su punto de
// entrada, así el centro del cuadro es el centro de todas y el encadenado no deriva.

/* ============================ AJUSTES ============================ */

// "scroll"  — el zoom avanza con el scroll; la sección queda pegada mientras dura.
// "auto"    — se reproduce solo, una vez, al entrar en viewport.
// "gesture" — el primer gesto de scroll lo lanza y corre a su ritmo; el scroll solo puede adelantarlo.
const TRIGGER: "scroll" | "auto" | "gesture" = "scroll";

type Segment = { type: "zoom" | "hold" | "relay" | "land"; dur: number; zoom?: number };

// dur = ms en "auto" y "gesture"; en "scroll" es el peso relativo del tramo, y las pausas se omiten.
// zoom = cuántas veces crece el plano saliente hasta que el siguiente llena el cuadro. Los planos
// están dibujados uno dentro de otro (scripts/gen-zoom-plates.py), así que este número no es libre:
// es 1200 / el tamaño al que el plano siguiente aparece dentro de este.
const SEGMENTS: Segment[] = [
  { type: "zoom", dur: 2200, zoom: 6 }, // 1→2 ciudad → fachada
  { type: "zoom", dur: 1900, zoom: 6 }, // 2→3 fachada → ventana
  { type: "zoom", dur: 1100, zoom: 2 }, // 3→4 ventana → sala
  { type: "zoom", dur: 2000, zoom: 6 }, // 4→5 sala → luminaria
  { type: "hold", dur: 400 },
  { type: "relay", dur: 1500 }, //         5→6 relevo: la caja
  { type: "hold", dur: 400 },
  { type: "land", dur: 2400 }, //          6→7 aterrizaje en la ficha
];

const SCROLL_SCREENS = 4; //    modo scroll: pantallas de recorrido en total, con la sección pegada
// De ese recorrido, la última parte es reposo: el zoom ya terminó y la ficha sigue pegada. Le da al
// suavizado sitio para asentarse antes de que la sección se suelte, aunque el scroll vaya rápido.
const SCROLL_END_HOLD = 0.6; // en pantallas
const GESTURE_SCREENS = 1.5; // modo gesture: pantallas que la sección queda pegada
const SCROLL_SMOOTHING = 0.18; // 1 = sin suavizado; no toca el scroll nativo
const FADE_IN = 0.35; //        fracción del tramo en la que el plano entrante termina de fundirse
const VIEWBOX = 1200; //        lado de cada plano en unidades propias

// La hoja que aterriza, tal como está en el plano 6, en unidades de VIEWBOX: el rectángulo blanco que
// cabe dentro de ella y su centro respecto al centro del plano. No está en el centro del dibujo, así
// que el aterrizaje acerca y desplaza la cámara a la vez.
const PAPER = { w: 170, h: 130, cx: 120, cy: 315, bleed: 1.06 };

// Hacia dónde apunta la cámara al salir de cada plano, en unidades de VIEWBOX desde su centro. Con
// los planos dibujados uno dentro de otro, el siguiente siempre está en el centro.
const FOCUS: [number, number][] = [];

// La luminaria y la caja son muy alargadas: ocupan este ancho del plano (de 1200). En pantallas
// verticales la cámara se queda un poco más lejos para que quepan enteras.
const WIDE_CONTENT = 1120;

const PLATES = ["1-ciudad", "2-edificio", "3-ventana", "4-sala", "5-luminaria"];

/* ============================ MOTOR ============================ */

function startZoom(root: HTMLElement): () => void {
  const q = <E extends HTMLElement>(sel: string) => root.querySelector<E>(sel);
  const stage = q(".uz-stage");
  const art = q(".uz-art");
  const doc = q(".uz-doc");
  const runway = q(".uz-runway");
  const probe = q(".uz-probe");
  const hint = q(".uz-hint");
  const skip = q<HTMLAnchorElement>(".uz-skip");
  if (!stage || !art || !doc || !runway || !probe) return () => {};

  // Sin movimiento: se queda el CSS por defecto, que es la ficha completa.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const mode = TRIGGER;
  const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const smooth = (t: number) => t * t * (3 - 2 * t);

  let acc = 0;
  const SEG = (mode === "scroll" ? SEGMENTS.filter((s) => s.type !== "hold") : SEGMENTS).map((s) => {
    const o = { ...s, dur: Math.max(1, s.dur), start: acc };
    acc += o.dur;
    return o;
  });
  const TOTAL = acc;
  const zoomSegs = SEG.filter((s) => s.type === "zoom");
  const relaySeg = SEG.find((s) => s.type === "relay")!;
  const landSeg = SEG.find((s) => s.type === "land")!;
  const segT = (s: { start: number; dur: number }, now: number) => smooth(clamp((now - s.start) / s.dur));

  // log-zoom acumulado al que cada plano está a escala 1
  const offs = [0];
  zoomSegs.forEach((s) => offs.push(offs[offs.length - 1] + Math.log(s.zoom ?? 1)));

  // La cámara: una sola curva de log-zoom en el tiempo (cúbica monótona). Pasa exactamente por cada
  // junta, no retrocede y su velocidad es continua; extremos y tramos planos, a velocidad 0.
  const KX = [0];
  SEG.forEach((s) => KX.push(s.start + s.dur));
  const KY = new Array<number>(KX.length).fill(0);
  const KD = new Array<number>(KX.length).fill(0);
  let K = 1; // escala a la que se detiene el último plano: 1, o menos si la pantalla es vertical
  const lastZoom = zoomSegs[zoomSegs.length - 1];
  const buildCam = () => {
    SEG.forEach((s, k) => {
      const z = s.type === "zoom" ? (s.zoom ?? 1) * (s === lastZoom ? K : 1) : 1;
      KY[k + 1] = KY[k] + Math.log(z);
    });
    KD.fill(0);
    for (let k = 1; k < KX.length - 1; k++) {
      const h0 = KX[k] - KX[k - 1];
      const h1 = KX[k + 1] - KX[k];
      const s0 = (KY[k] - KY[k - 1]) / h0;
      const s1 = (KY[k + 1] - KY[k]) / h1;
      if (s0 * s1 > 0) {
        const w1 = 2 * h1 + h0;
        const w2 = h1 + 2 * h0;
        KD[k] = (w1 + w2) / (w1 / s0 + w2 / s1);
      }
    }
  };
  const camL = (now: number) => {
    let k = 0;
    while (k < KX.length - 2 && now > KX[k + 1]) k++;
    const h = KX[k + 1] - KX[k];
    const t = clamp((now - KX[k]) / h);
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * KY[k] +
      (t3 - 2 * t2 + t) * h * KD[k] +
      (3 * t2 - 2 * t3) * KY[k + 1] +
      (t3 - t2) * h * KD[k + 1]
    );
  };

  const planes = Array.from(art.querySelectorAll<HTMLElement>("[data-plane]"));
  const p6 = art.querySelector<HTMLElement>("[data-relay-in]");
  if (!p6 || planes.length !== zoomSegs.length + 1) return () => {};
  const touched: HTMLElement[] = [...planes, p6, doc, ...(hint ? [hint] : [])];

  // Las imágenes no se piden hasta que la sección se acerca: la portada no las paga antes.
  const images = Array.from(art.querySelectorAll<HTMLImageElement>("img[data-src]"));
  const loadImages = () => {
    for (const img of images) {
      if (img.getAttribute("src")) continue;
      img.src = img.dataset.src ?? "";
      img.decode?.().catch(() => {});
    }
  };

  // Escritura con caché: solo se toca el DOM si el valor cambia. Solo transform, opacity y display.
  const cache = new WeakMap<HTMLElement, Record<string, string>>();
  const put = (el: HTMLElement, key: "t" | "o" | "d", val: string) => {
    let c = cache.get(el);
    if (!c) cache.set(el, (c = {}));
    if (c[key] === val) return;
    c[key] = val;
    if (key === "t") el.style.transform = val;
    else if (key === "o") el.style.opacity = val;
    else el.style.display = val;
  };
  const setT = (el: HTMLElement, scale: number, tx = 0, ty = 0) =>
    put(el, "t", `${tx || ty ? `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) ` : ""}scale(${scale.toFixed(5)})`);

  let Z = 8; //       zoom del aterrizaje: lo que hace falta para que la hoja cubra el cuadro
  let U = 1; //       px de pantalla por unidad de VIEWBOX
  let runwayH = 1;
  let zoomH = 1; //   tramo del recorrido en el que avanza el zoom (el resto es reposo final)
  const measure = () => {
    const W = probe.clientWidth;
    const H = probe.clientHeight;
    const S = Math.max(W, H);
    U = S / VIEWBOX;
    K = Math.min(1, (W / S) * (VIEWBOX / WIDE_CONTENT));
    buildCam();
    Z = PAPER.bleed * Math.max(W / (PAPER.w * U * K), H / (PAPER.h * U * K));
    stage.style.setProperty("--uz-s", `${S}px`);
    if (mode !== "auto") {
      runway.style.height = `${(mode === "scroll" ? SCROLL_SCREENS : GESTURE_SCREENS) * 100}vh`;
      runwayH = runway.offsetHeight || 1;
      zoomH = mode === "scroll" ? Math.max(1, runwayH - SCROLL_END_HOLD * H) : runwayH;
    }
  };

  let landed: boolean | null = null;
  let lastX = 0;
  const render = (x: number) => {
    lastX = x;
    const now = x * TOTAL;
    const L = camL(now);
    const r = segT(relaySeg, now);
    const e = segT(landSeg, now);
    const landS = Math.pow(Z, e);
    // La hoja viaja en línea recta desde su sitio hasta el centro mientras la cámara se acerca.
    const px = PAPER.cx * U * K;
    const py = PAPER.cy * U * K;
    const panX = px * (1 - e - landS);
    const panY = py * (1 - e - landS);
    const lastI = planes.length - 1;

    for (let j = 0; j <= lastI; j++) {
      const p = planes[j];
      // visible desde que el anterior empieza a crecer hasta que el siguiente llena el cuadro;
      // el último queda tapado por la caja cuando esta ya se ha fundido del todo
      // (en vertical el penúltimo sigue alrededor del último, que no llega a llenar el cuadro, y se
      // va con él en el relevo)
      const on = (j === 0 || L > offs[j - 1]) && (j >= lastI - 1 ? r < 1 : true) && (j === lastI || L < offs[j + 1]);
      put(p, "d", on ? "block" : "none");
      if (!on) continue;
      const s = Math.exp(L - offs[j]);
      if (j === lastI) setT(p, s * landS, panX, panY);
      else if (L < offs[j]) {
        // entrando: sentado en el punto de mira del plano anterior, que va camino del centro
        const [fx, fy] = FOCUS[j - 1] ?? [0, 0];
        const k = (1 - smooth(clamp((L - offs[j - 1]) / (offs[j] - offs[j - 1])))) * U;
        setT(p, s, fx * k, fy * k);
      } else {
        // saliendo: crece alrededor de su punto de mira mientras lo lleva al centro
        const [fx, fy] = FOCUS[j] ?? [0, 0];
        const k = (1 - smooth(clamp((L - offs[j]) / (offs[j + 1] - offs[j]))) - s) * U;
        setT(p, s, fx * k, fy * k);
      }
      const fadeIn = j ? clamp((L - offs[j - 1]) / (offs[j] - offs[j - 1]) / FADE_IN) : 1;
      put(p, "o", (j === lastI - 1 ? fadeIn * (1 - r) : fadeIn).toFixed(3));
    }

    // Relevo 5 → 6: nada cambia de escala; un dibujo se funde en el otro.
    put(p6, "d", r > 0 ? "block" : "none");
    if (r > 0) {
      setT(p6, K * landS, panX, panY);
      put(p6, "o", r.toFixed(3));
    }

    // Aterrizaje 6 → 7: la ficha va pegada a la hoja (misma escala relativa, mismo centro).
    setT(doc, Math.pow(Z, e - 1), px * (1 - e), py * (1 - e));
    put(doc, "o", clamp((e - 0.2) / 0.45).toFixed(3));

    if (hint) put(hint, "o", (1 - clamp(x * 40)).toFixed(3));

    const isLanded = x >= 1;
    if (isLanded !== landed) {
      landed = isLanded;
      // Al aterrizar la ficha vuelve al flujo y la sección cambia de alto. El navegador "ancla" el
      // scroll a un elemento de fuera y la página daría un salto, así que el anclaje se apaga solo
      // durante ese cambio.
      const scroller = document.documentElement;
      const before = scroller.style.overflowAnchor;
      scroller.style.overflowAnchor = "none";
      stage.classList.toggle("is-landed", isLanded);
      void stage.offsetHeight;
      scroller.style.overflowAnchor = before;
    }
  };

  /* ---------- Disparadores ---------- */
  const undo: Array<() => void> = [];
  const on = <K extends keyof WindowEventMap>(type: K, fn: (ev: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
    window.addEventListener(type, fn, opts);
    undo.push(() => window.removeEventListener(type, fn, opts));
  };
  let raf = 0;
  undo.push(() => cancelAnimationFrame(raf));

  root.classList.add("is-live", `is-${mode}`);
  measure();

  const near = new IntersectionObserver(
    (entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        loadImages();
        near.disconnect();
      }
    },
    { rootMargin: "150% 0px" },
  );
  near.observe(root);
  undo.push(() => near.disconnect());

  let skipFn = () => {};

  if (mode === "scroll") {
    let cur = 0;
    let last = 0;
    let running = false;
    const target = () => clamp(-root.getBoundingClientRect().top / zoomH);
    const tick = (ts: number) => {
      const dt = last ? Math.min(ts - last, 64) : 16.67;
      last = ts;
      const tg = target();
      // Con el scroll ya en el reposo final, se alcanza el final algo más deprisa.
      const ease = tg >= 1 ? Math.max(SCROLL_SMOOTHING, 0.3) : SCROLL_SMOOTHING;
      const k = ease >= 1 ? 1 : 1 - Math.pow(1 - ease, dt / 16.67);
      cur += (tg - cur) * k;
      // Si el scroll ya ha soltado la sección (un gesto brusco), la ficha sale terminada: a esa
      // velocidad el salto no se ve, y una ficha a medio ampliar alejándose sí.
      if (Math.abs(tg - cur) < 0.002 || -root.getBoundingClientRect().top >= runwayH) cur = tg;
      render(cur);
      if (cur !== tg) raf = requestAnimationFrame(tick);
      else {
        running = false;
        last = 0;
      }
    };
    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    cur = target();
    render(cur);
    on("scroll", kick, { passive: true }); // solo lee; nunca preventDefault
    on("resize", () => {
      measure();
      kick();
    });
    // Saltar: aquí el progreso es la posición de scroll, así que se lleva al final del recorrido.
    skipFn = () => {
      const top = Math.ceil(window.scrollY + root.getBoundingClientRect().top + runwayH);
      window.scrollTo({ top, behavior: "instant" });
      cur = 1;
      render(1);
    };
  } else if (mode === "gesture") {
    let x = 0;
    let started = false;
    let last = 0;
    let running = false;
    const scrollX = () => clamp(-root.getBoundingClientRect().top / runwayH);
    const tick = (ts: number) => {
      const dt = last ? Math.min(ts - last, 250) : 16.67;
      last = ts;
      x += dt / TOTAL; // a su ritmo
      const sx = scrollX();
      if (sx > x) x += (sx - x) * (1 - Math.pow(1 - SCROLL_SMOOTHING, dt / 16.67)); // alcanzar al usuario
      x = clamp(x);
      render(x);
      if (x < 1) raf = requestAnimationFrame(tick);
      else {
        running = false;
        last = 0;
      }
    };
    const onScroll = () => {
      if (started || root.getBoundingClientRect().top > -1) return;
      started = true;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    render(0);
    on("scroll", onScroll, { passive: true });
    onScroll();
    on("resize", () => {
      measure();
      if (!running) render(x);
    });
    skipFn = () => {
      started = true;
      x = 1;
      if (!running) render(1);
    };
  } else {
    let playing = false;
    let done = false;
    let skipped = false;
    const play = () => {
      playing = true;
      let t0 = 0;
      const f = (ts: number) => {
        if (!t0) t0 = ts;
        const x = skipped ? 1 : clamp((ts - t0) / TOTAL);
        render(x);
        if (x < 1) raf = requestAnimationFrame(f);
        else {
          playing = false;
          done = true;
        }
      };
      raf = requestAnimationFrame(f);
    };
    render(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !playing && !done) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(stage);
    undo.push(() => io.disconnect());
    on("resize", () => {
      measure();
      if (!playing) render(done ? 1 : 0);
    });
    skipFn = () => {
      skipped = true;
      io.disconnect();
      done = true;
      render(1);
    };
  }

  const onSkip = (ev: MouseEvent) => {
    ev.preventDefault();
    loadImages();
    skipFn();
    doc.focus({ preventScroll: true }); // teclado y lector de pantalla quedan en la ficha
  };
  skip?.addEventListener("click", onSkip);
  undo.push(() => skip?.removeEventListener("click", onSkip));

  // Deshacer del todo: en desarrollo React monta, desmonta y vuelve a montar.
  return () => {
    undo.forEach((fn) => fn());
    root.classList.remove("is-live", `is-${mode}`);
    stage.classList.remove("is-landed");
    stage.style.removeProperty("--uz-s");
    runway.style.height = "";
    for (const el of touched) {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.display = "";
    }
    void lastX;
  };
}

/* ============================ MARCADO ============================ */

function T({ en, es }: { en: React.ReactNode; es: React.ReactNode }) {
  return (
    <>
      <span data-en="" lang="en">
        {en}
      </span>
      <span data-es="" lang="es">
        {es}
      </span>
    </>
  );
}

const SPECS: Array<{ en: string; es: string; value: string }> = [
  { en: "Model", es: "Modelo", value: "LS-1200 / 32W / 940" },
  { en: "Luminous flux", es: "Flujo luminoso", value: "4 000 lm" },
  { en: "CCT", es: "CCT", value: "3000 K / 4000 K" },
  { en: "CRI", es: "CRI", value: "≥ 90" },
  { en: "UGR", es: "UGR", value: "< 19" },
  { en: "Protection", es: "Protección", value: "IP40 · IK06" },
  { en: "Dimensions", es: "Dimensiones", value: "1200 × 300 × 90 mm" },
  { en: "Weight", es: "Peso", value: "4.2 kg" },
  { en: "Supply", es: "Alimentación", value: "220–240 V · DALI-2" },
  { en: "Certifications", es: "Certificaciones", value: "CE · ENEC · RoHS" },
];

export default function ZoomPlates() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    return root ? startZoom(root) : undefined;
  }, []);

  return (
    <section className="uz" id="sheet" ref={rootRef} aria-label="From the city to the spec sheet">
      <div className="uz-probe" aria-hidden="true" />
      <div className="uz-stage">
        <a className="uz-skip" href="#spec-sheet">
          <T en="Skip to the sheet" es="Saltar a la ficha" />
        </a>

        {/* Planos 1–6: decorativos. El texto está todo en la ficha. */}
        <div className="uz-art" aria-hidden="true">
          {PLATES.map((name, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={name} data-plane={i + 1} data-src={`/zoom/${name}.svg`} alt="" aria-hidden="true" />
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-relay-in="" data-src="/zoom/6-caja.svg" alt="" aria-hidden="true" />
        </div>

        {/* Plano 7: la ficha. Texto vivo, en el DOM desde el principio. */}
        <article className="uz-doc" id="spec-sheet" tabIndex={-1}>
          <div className="uz-doc-in">
            <div className="uz-head">
              <p className="uz-label">
                <T en="Spec sheet · Rev. 00 · Sample data" es="Ficha técnica · Rev. 00 · Datos de muestra" />
              </p>
              <h2>
                <T en="Linear LS-1200" es="Lineal LS-1200" />
              </h2>
              <p className="uz-sub">
                <T
                  en="Surface or suspended LED luminaire · prismatic diffuser · commercial interiors"
                  es="Luminaria LED de superficie o suspendida · difusor prismático · interior comercial"
                />
              </p>
            </div>

            {/* Lámina de plano: dibujo decorativo; las cotas son texto vivo encima. */}
            <figure className="uz-plano">
              <svg viewBox="0 0 600 240" aria-hidden="true" focusable="false">
                <defs>
                  <pattern id="uz-rayado" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <path d="M0 0V5" />
                  </pattern>
                </defs>
                <g className="uz-tenue">
                  <path d="M55 140a150 150 0 1 0 300 0a150 150 0 1 0-300 0" />
                  <path d="M115 140a90 90 0 1 0 180 0a90 90 0 1 0-180 0" />
                  <path className="uz-eje" d="M205 34V222M20 140H400" />
                </g>
                <path className="uz-corte" d="M30 14H380V28H30z" />
                <path d="M30 28H380" />
                <path d="M104 28h12v6h-12zM294 28h12v6h-12zM110 34V112M300 34V112" />
                <path d="M40 118H370V152H40z" />
                <path className="uz-corte" d="M40 118H52V152H40zM358 118H370V152H358z" />
                <path d="M102 112h16v6h-16zM292 112h16v6h-16z" />
                <path className="uz-luz" d="M46 152H364V164H46z" />
                <path d="M40 170V200M370 170V200M40 192H370M35 197l10-10M365 197l10-10" />
                <path d="M376 118H398M376 164H398M390 118V164M385 123l10-10M385 169l10-10" />
                <g className="uz-tenue">
                  <path d="M477 120a28 28 0 1 0 56 0a28 28 0 1 0-56 0M449 120a56 56 0 1 0 112 0a56 56 0 1 0-112 0M421 120a84 84 0 1 0 168 0a84 84 0 1 0-168 0" />
                  <path d="M421 120H589M505 36V204M432.3 78L577.7 162M432.3 162L577.7 78M463 47.3L547 192.7M463 192.7L547 47.3" />
                </g>
                <path className="uz-lobulo" d="M505 120C462 138 452 190 505 200C558 190 548 138 505 120z" />
                <path d="M6 12h12M12 6v12M582 12h12M588 6v12M6 228h12M12 222v12M582 228h12M588 222v12" />
              </svg>
              <span className="uz-cota" style={{ left: "34.2%", top: "74%" }}>
                1200
              </span>
              <span className="uz-cota" style={{ left: "69.5%", top: "58.5%" }}>
                90
              </span>
              <span className="uz-cota" style={{ left: "84.2%", top: "8%" }}>
                cd / klm
              </span>
              <figcaption className="uz-cajetin">
                <span>
                  <T en="Plate 01" es="Lámina 01" />
                </span>
                <span>
                  <T en="Elevation · Photometry" es="Alzado · Fotometría" />
                </span>
                <span>
                  <T en="Scale 1:10" es="Esc. 1:10" />
                </span>
              </figcaption>
            </figure>

            <ul className="uz-claves">
              <li className="uz-clave-o">
                <b>4 000</b>
                <span>lm</span>
              </li>
              <li>
                <b>32</b>
                <span>W</span>
              </li>
              <li>
                <b>125</b>
                <span>lm/W</span>
              </li>
            </ul>

            <dl className="uz-specs">
              {SPECS.map((row) => (
                <div key={row.en}>
                  <dt>
                    <T en={row.en} es={row.es} />
                  </dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>

            {/* div y no <footer>/<header>: globals.css da estilo a esos elementos en toda la web. */}
            <div className="uz-foot">
              <p className="uz-closing">
                <T en="The real world, set down as documentation." es="El mundo real, puesto en un documento." />
              </p>
              <a className="uz-btn" href="#work">
                <T en="See the work" es="Ver el trabajo" />
              </a>
            </div>
          </div>
        </article>

        <p className="uz-hint" aria-hidden="true">
          <T en="Scroll" es="Desplaza" />
        </p>
      </div>
      <div className="uz-runway" aria-hidden="true" />
    </section>
  );
}

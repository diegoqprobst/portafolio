"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

// ─────────────────────────────────────────────────────────────
// StorySection — la home como historia: problema → conflicto →
// resolución, con el momento de marca "orden en el caos":
// fragmentos de documento que empiezan dispersos y se ALINEAN en
// una grilla conforme scrolleas (scroll-scrubbed con Framer Motion).
//
// Base v1 para iterar el "feel" después. SSR-safe, transform-only,
// y respeta prefers-reduced-motion (cae a versión estática ordenada).
// Bilingüe vía el sistema data-en/data-es del sitio.
// ─────────────────────────────────────────────────────────────

// 9 fragmentos → grilla 3×3. Posición de caos (rotación + offset px)
// hardcodeada para ser determinista (sin Math.random → SSR-safe).
const FRAGMENTS = [
  { r: -13, x: -60, y: -34 },
  { r: 10, x: 48, y: -56 },
  { r: -7, x: 70, y: 20 },
  { r: 15, x: -78, y: 30 },
  { r: -18, x: 22, y: 64 },
  { r: 8, x: -34, y: -70 },
  { r: 19, x: 64, y: 58 },
  { r: -10, x: -52, y: 66 },
  { r: 6, x: 40, y: 8 },
];

function Fragment({
  progress,
  chaos,
  reduced,
}: {
  progress: MotionValue<number>;
  chaos: { r: number; x: number; y: number };
  reduced: boolean;
}) {
  // De caos (progress 0.45) a orden (progress 0.85). Antes del acto 3
  // siguen dispersos; en el acto 3 se asientan en su celda.
  const rotate = useTransform(progress, [0.45, 0.85], [chaos.r, 0]);
  const x = useTransform(progress, [0.45, 0.85], [chaos.x, 0]);
  const y = useTransform(progress, [0.45, 0.85], [chaos.y, 0]);
  // Acento: rojo (tensión) en el conflicto → ámbar (orden) en la resolución.
  // OJO: usar rgba (NO oklch) — Framer Motion no interpola oklch y lanza
  // excepción en el cliente.
  const accent = useTransform(
    progress,
    [0.4, 0.55, 0.85],
    ["rgba(255,255,255,0.14)", "rgba(216,64,64,0.55)", "rgba(245,166,35,0.9)"]
  );

  return (
    <motion.div
      className="frag"
      style={reduced ? undefined : { rotate, x, y }}
    >
      <motion.div className="frag-band" style={reduced ? undefined : { background: accent }} />
      <div className="frag-line" style={{ width: "80%" }} />
      <div className="frag-line" style={{ width: "55%" }} />
      <div className="frag-img" />
      <div className="frag-line" style={{ width: "70%" }} />
    </motion.div>
  );
}

function Act({
  progress,
  range,
  act,
  titleEn,
  titleEs,
  subEn,
  subEs,
  reduced,
  cta,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  act: { en: string; es: string };
  titleEn: string;
  titleEs: string;
  subEn: string;
  subEs: string;
  reduced: boolean;
  cta?: boolean;
}) {
  const [a, b] = range;
  // Aparece al entrar a su tramo, desaparece al salir.
  const opacity = useTransform(
    progress,
    [a - 0.08, a, b - 0.02, b + 0.06],
    [0, 1, 1, 0]
  );
  const yMove = useTransform(progress, [a - 0.08, a, b + 0.06], [24, 0, -24]);

  return (
    <motion.div
      className="story-act"
      style={reduced ? undefined : { opacity, y: yMove }}
    >
      <div className="story-eyebrow">
        <span data-en="">{act.en}</span>
        <span data-es="">{act.es}</span>
      </div>
      <h2 className="story-h">
        <span data-en="">{titleEn}</span>
        <span data-es="">{titleEs}</span>
      </h2>
      <p className="story-sub">
        <span data-en="">{subEn}</span>
        <span data-es="">{subEs}</span>
      </p>
      {cta && (
        <a href="#services" className="story-cta">
          <span data-en="">See how it works</span>
          <span data-es="">Mira cómo funciona</span>
          <span aria-hidden="true">→</span>
        </a>
      )}
    </motion.div>
  );
}

export default function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      id="story"
      className={`story ${reduced ? "story--static" : ""}`}
      aria-label="How Lumen Studio works"
    >
      <div className="story-sticky">
        <div className="story-copy">
          <Act
            progress={scrollYProgress}
            range={[0.0, 0.34]}
            act={{ en: "Act 1 · The problem", es: "Acto 1 · El problema" }}
            titleEn="Your product data is chaos."
            titleEs="Tus datos de producto son un caos."
            subEn="Supplier PDFs, mismatched specs, files everywhere, versions that don't agree."
            subEs="PDFs de proveedor, specs que no cuadran, archivos por todos lados, versiones que no coinciden."
            reduced={reduced}
          />
          <Act
            progress={scrollYProgress}
            range={[0.34, 0.62]}
            act={{ en: "Act 2 · The cost", es: "Acto 2 · El costo" }}
            titleEn="And it's costing you."
            titleEs="Y te está costando."
            subEn="40 hours a month rebuilding the same documents. Errors that reach distributors. Deals that stall because the catalog isn't ready."
            subEs="40 horas al mes rehaciendo los mismos documentos. Errores que llegan a los distribuidores. Negocios que se frenan porque el catálogo no está listo."
            reduced={reduced}
          />
          <Act
            progress={scrollYProgress}
            range={[0.66, 1.0]}
            act={{ en: "Act 3 · The order", es: "Acto 3 · El orden" }}
            titleEn="Lumen Studio brings order."
            titleEs="Lumen Studio pone orden."
            subEn="One system — data merge, styles, automation — turns the chaos into catalogs and spec sheets that stay perfectly consistent."
            subEs="Un sistema — data merge, estilos, automatización — convierte el caos en catálogos y fichas perfectamente consistentes."
            reduced={reduced}
            cta
          />
        </div>

        <div className="story-stage" aria-hidden="true">
          <div className="story-grid">
            {FRAGMENTS.map((chaos, i) => (
              <Fragment key={i} progress={scrollYProgress} chaos={chaos} reduced={reduced} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

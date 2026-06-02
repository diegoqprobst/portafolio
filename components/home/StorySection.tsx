"use client";

import { motion, useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// StorySection v2 — la home como historia en 3 ESCENAS discretas
// (problema → costo → orden). Sin scroll-scrubbing ("perilla"):
// cada escena ocupa la pantalla y se ANIMA al entrar (gesto de
// scroll = siguiente acto). El momento de marca "orden en el caos"
// es el payoff del Acto 3: los fragmentos se asientan en una grilla
// al llegar.
//
// Solo whileInView (sin useScroll/useTransform) → sin los crashes de
// offsets del scroll-timeline. SSR-safe, respeta prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

// Posiciones de caos (determinista, SSR-safe).
const FRAGMENTS = [
  { r: -13, x: -46, y: -28 },
  { r: 10, x: 40, y: -44 },
  { r: -7, x: 54, y: 16 },
  { r: 15, x: -58, y: 24 },
  { r: -16, x: 18, y: 50 },
  { r: 8, x: -28, y: -54 },
  { r: 17, x: 50, y: 46 },
  { r: -10, x: -42, y: 52 },
  { r: 6, x: 30, y: 6 },
];

function FragInner() {
  return (
    <>
      <div className="frag-band" />
      <div className="frag-line" style={{ width: "82%" }} />
      <div className="frag-line" style={{ width: "55%" }} />
      <div className="frag-img" />
      <div className="frag-line" style={{ width: "70%" }} />
    </>
  );
}

function Frags({ ordered, reduced }: { ordered: boolean; reduced: boolean }) {
  return (
    <div className="scene-frags" aria-hidden="true">
      {FRAGMENTS.map((c, i) => {
        // Escena ORDEN: animan de caos → celda al entrar (el payoff).
        if (ordered && !reduced) {
          return (
            <motion.div
              key={i}
              className="frag frag--amber"
              initial={{ x: c.x, y: c.y, rotate: c.r, opacity: 0.35 }}
              whileInView={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.85, ease: EASE, delay: i * 0.04 }}
            >
              <FragInner />
            </motion.div>
          );
        }
        // Escena PROBLEMA: dispersos (estáticos). Reduced motion: ordenados.
        const style = reduced
          ? undefined
          : { transform: `translate(${c.x}px, ${c.y}px) rotate(${c.r}deg)` };
        return (
          <div key={i} className={`frag ${ordered ? "frag--amber" : ""}`} style={style}>
            <FragInner />
          </div>
        );
      })}
    </div>
  );
}

function Copy({
  eyebrowEn,
  eyebrowEs,
  titleEn,
  titleEs,
  subEn,
  subEs,
  reduced,
  cta,
}: {
  eyebrowEn: string;
  eyebrowEs: string;
  titleEn: string;
  titleEs: string;
  subEn: string;
  subEs: string;
  reduced: boolean;
  cta?: boolean;
}) {
  const anim = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: false, amount: 0.6 },
        transition: { duration: 0.7, ease: EASE },
      };
  return (
    <motion.div className="scene-copy" {...anim}>
      <div className="story-eyebrow">
        <span data-en="">{eyebrowEn}</span>
        <span data-es="">{eyebrowEs}</span>
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
  const reduced = useReducedMotion() ?? false;
  const costAnim = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: false, amount: 0.6 },
        transition: { duration: 0.7, ease: EASE },
      };

  return (
    <section id="story" className="story" aria-label="How Lumen Studio works">
      {/* Acto 1 — Problema */}
      <div className="scene scene--split">
        <Copy
          eyebrowEn="Act 1 · The problem"
          eyebrowEs="Acto 1 · El problema"
          titleEn="Your product data is chaos."
          titleEs="Tus datos de producto son un caos."
          subEn="Supplier PDFs, mismatched specs, files everywhere, versions that don't agree."
          subEs="PDFs de proveedor, specs que no cuadran, archivos por todos lados, versiones que no coinciden."
          reduced={reduced}
        />
        <Frags ordered={false} reduced={reduced} />
      </div>

      {/* Acto 2 — Costo */}
      <div className="scene scene--center">
        <motion.div className="scene-copy scene-copy--center" {...costAnim}>
          <div className="story-eyebrow">
            <span data-en="">Act 2 · The cost</span>
            <span data-es="">Acto 2 · El costo</span>
          </div>
          <h2 className="story-h">
            <span data-en="">And it&apos;s costing you.</span>
            <span data-es="">Y te está costando.</span>
          </h2>
          <div className="cost-row">
            <span className="cost-chip">
              <span data-en="">40h/month rebuilding docs</span>
              <span data-es="">40h/mes rehaciendo docs</span>
            </span>
            <span className="cost-chip">
              <span data-en="">Errors reach distributors</span>
              <span data-es="">Errores que llegan al distribuidor</span>
            </span>
            <span className="cost-chip">
              <span data-en="">Deals stall, no catalog</span>
              <span data-es="">Negocios frenados sin catálogo</span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* Acto 3 — Orden (payoff: caos → grilla) */}
      <div className="scene scene--split scene--order">
        <Copy
          eyebrowEn="Act 3 · The order"
          eyebrowEs="Acto 3 · El orden"
          titleEn="Lumen Studio brings order."
          titleEs="Lumen Studio pone orden."
          subEn="One system — data merge, styles, automation — turns the chaos into catalogs and spec sheets that stay perfectly consistent."
          subEs="Un sistema — data merge, estilos, automatización — convierte el caos en catálogos y fichas perfectamente consistentes."
          reduced={reduced}
          cta
        />
        <Frags ordered reduced={reduced} />
      </div>
    </section>
  );
}

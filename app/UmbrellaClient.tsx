"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Brain,
  FlaskConical,
  Gamepad2,
  Lightbulb,
  Mail,
  PenLine,
} from "lucide-react";
import "./umbrella.css";

// Raíz umbrella de Diego — "una mente encendida por dentro".
// Una sola narrativa (psicología × IA para salud mental × juego), no un
// portafolio de cards. Tinta índigo drenched + una luz cálida que la habita;
// cada mundo tiene su luz de firma. English-first (audiencia objetivo) con el
// toggle EN/ES de todo el sitio: spans data-en/data-es + clase lang-* en <body>.

// Helper tipado para la variable CSS de la luz de cada mundo.
const self = (v: string): React.CSSProperties =>
  ({ "--u-self": v } as React.CSSProperties);

// Colibrí de marca (manual de marca de Diego) — silueta de línea, inlineada
// para teñirla con la luz del tema vía `currentColor` (lo pone ámbar en CSS).
function Colibri({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="2 12 114 74"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 42 L42 48" />
      <path d="M42 48 Q52 38 64 44 Q78 51 76 62 Q73 70 60 68 Q47 65 42 48 Z" />
      <circle cx="49" cy="46" r="1.4" fill="currentColor" stroke="none" />
      <path d="M60 50 Q66 24 96 16 Q78 38 68 56" />
      <path d="M76 62 L106 64" />
      <path d="M76 64 L108 74" />
      <path d="M74 66 L100 80" />
    </svg>
  );
}

const MILESTONES = [
  {
    when: "2026 · Now",
    en: {
      t: "Corpus + simulator, published",
      d: "A clinically reviewed corpus of brief-therapy interventions and the family-systems simulator go public — including the part nobody has seen: systemic homeostasis animated by AI agents.",
    },
    es: {
      t: "Corpus + simulador, publicados",
      d: "El corpus de intervenciones de terapia breve con revisión clínica y el simulador de sistemas familiares se hacen públicos — incluida la parte que nadie ha visto: homeostasis sistémica animada por agentes de IA.",
    },
  },
  {
    when: "Late 2026",
    en: {
      t: "Open benchmark v1 + leaderboard",
      d: "Can frontier models detect symmetrical escalation or a double bind? Can they produce a valid reframe? Benchmark in Spanish and English, run against frontier models, results published openly — plus a preprint.",
    },
    es: {
      t: "Benchmark abierto v1 + leaderboard",
      d: "¿Detectan los modelos frontier una escalada simétrica o un doble vínculo? ¿Producen una reestructuración válida? Benchmark en español e inglés, corrido contra modelos frontier, resultados publicados en abierto — más un preprint.",
    },
  },
  {
    when: "2027",
    en: {
      t: "Clinical validation + community",
      d: "Blind studies with practicing therapists (can they tell simulations from real vignettes? do they agree when labeling?), journal submission, and the real adoption goal: therapists actually using the tools.",
    },
    es: {
      t: "Validación clínica + comunidad",
      d: "Estudios a ciegas con terapeutas en ejercicio (¿distinguen simulaciones de viñetas reales? ¿coinciden al etiquetar?), envío a journal, y la meta real de adopción: terapeutas usando las herramientas.",
    },
  },
  {
    when: "2028",
    en: {
      t: "The reference, either way",
      d: "Two papers, a cited benchmark, an international venue. Floor of the plan: becoming the Spanish-speaking reference in AI evaluation for psychotherapy.",
    },
    es: {
      t: "El referente, en cualquier escenario",
      d: "Dos papers, un benchmark citado, escena internacional. Piso del plan: ser el referente hispanohablante en evaluación de IA para psicoterapia.",
    },
  },
];

export default function UmbrellaClient() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = (localStorage.getItem("lang") as "en" | "es") || "en";
    setLang(saved);
  }, []);

  useEffect(() => {
    document.body.className = `lang-${lang}`;
    localStorage.setItem("lang", lang);
  }, [lang]);

  // Motion: revelados, luz por mundo y aura que sigue al cursor. La clase `js`
  // solo se añade aquí — así, sin JS o en headless, todo se renderiza visible
  // (los .u-reveal no esconden contenido por defecto).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("js");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveals = root.querySelectorAll<HTMLElement>(".u-reveal");
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealIO.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => revealIO.observe(el));

    const worlds = root.querySelectorAll<HTMLElement>("[data-glow]");
    const glowIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.4) {
            const g = (e.target as HTMLElement).dataset.glow;
            if (g) root.style.setProperty("--u-glow", g);
          }
        });
      },
      { threshold: [0.4, 0.65] }
    );
    worlds.forEach((el) => glowIO.observe(el));

    let raf = 0;
    const onMove = (ev: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        root.style.setProperty("--u-mx", `${ev.clientX}px`);
        root.style.setProperty("--u-my", `${ev.clientY}px`);
      });
    };
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!reduce && fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    return () => {
      revealIO.disconnect();
      glowIO.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="umbra" ref={rootRef} id="top">
      <div className="u-aura" aria-hidden="true" />

      {/* ── Nav ── */}
      <nav className="u-nav">
        <div className="u-nav-inner">
          <a href="#top" className="u-mark" aria-label="Diego Quinde">
            <Colibri className="u-colibri" />
            Diego Quinde
          </a>
          <div className="u-nav-links">
            <a href="#work" className="u-nav-link">
              <span data-en="">Work</span>
              <span data-es="">Trabajo</span>
            </a>
            <a href="#roadmap" className="u-nav-link">
              Roadmap
            </a>
            <a href="#contact" className="u-nav-link">
              <span data-en="">Contact</span>
              <span data-es="">Contacto</span>
            </a>
            <Link href="/lumen" className="u-nav-link u-nav-link--lumen">
              Lumen Studio
            </Link>
            <div className="lang-toggle">
              <button
                className={`lang-btn${lang === "en" ? " active" : ""}`}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <span className="lang-sep">|</span>
              <button
                className={`lang-btn${lang === "es" ? " active" : ""}`}
                onClick={() => setLang("es")}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="u-main">
        {/* ── Hero ── */}
        <section className="u-hero">
          <div className="u-orb" aria-hidden="true" />
          <div className="u-hero-kicker u-mono">
            <span data-en="">Clinical psychologist · AI · in public</span>
            <span data-es="">Psicólogo clínico · IA · en público</span>
          </div>
          <h1 className="u-hero-h1">
            <span data-en="">
              Clinical psychologist <em>building AI</em> for mental health.
            </span>
            <span data-es="">
              Psicólogo clínico <em>construyendo IA</em> para salud mental.
            </span>
          </h1>
          <p className="u-hero-sub">
            <span data-en="">
              I work where psychotherapy meets language models:{" "}
              <strong>open-source evaluations</strong> for AI in psychotherapy, a
              brief-therapy simulator, a game about peace conflicts — and Lumen
              Studio, the documentation studio that funds the mission. Building in
              public, in English and Spanish.
            </span>
            <span data-es="">
              Trabajo donde la psicoterapia se cruza con los modelos de lenguaje:{" "}
              <strong>evaluaciones open-source</strong> de IA en psicoterapia, un
              simulador de terapia breve, un juego sobre conflictos de paz — y
              Lumen Studio, el estudio de documentación que financia la misión.
              Construyendo en público, en inglés y español.
            </span>
          </p>
          <a href="#thesis" className="u-hero-scroll u-mono">
            <span data-en="">The throughline</span>
            <span data-es="">El hilo conductor</span>
            <ArrowDown className="u-arrow" width={14} height={14} />
          </a>
        </section>

        {/* ── Tesis / hilo conductor ── */}
        <section id="thesis" className="u-thesis scroll-mt-28">
          <p className="u-thesis-p u-reveal">
            <span data-en="">
              Three crafts, one obsession: <em>understanding the mind</em> — and
              building for it.
            </span>
            <span data-es="">
              Tres oficios, una obsesión: <em>entender la mente</em> y construir
              para ella.
            </span>
          </p>
          <p className="u-thesis-note u-reveal">
            <span data-en="">
              Psychotherapy taught me how people actually change. Language models
              let me build the tools to study it at scale. A studio for lighting
              brands funds the work while it&apos;s young. Different surfaces, same
              question.
            </span>
            <span data-es="">
              La psicoterapia me enseñó cómo cambia la gente de verdad. Los
              modelos de lenguaje me dejan construir las herramientas para
              estudiarlo a escala. Un estudio para marcas de iluminación financia
              el trabajo mientras es joven. Superficies distintas, la misma
              pregunta.
            </span>
          </p>
        </section>

        {/* ── Los mundos ── */}
        <section id="work" className="u-worlds scroll-mt-28">
          {/* Flagship — AI × Psychotherapy */}
          <article
            className="u-world u-world--flagship u-reveal"
            data-glow="var(--u-ai)"
            style={self("var(--u-ai)")}
          >
            <div className="u-world-head">
              <div className="u-world-aside">
                <Colibri className="u-world-colibri" />
                <span className="u-tag u-mono">
                  <Brain />
                  <span data-en="">AI × Psychotherapy</span>
                  <span data-es="">IA × Psicoterapia</span>
                </span>
                <span className="u-status">
                  <span className="u-status-dot u-status-dot--live" />
                  <span data-en="">Building now</span>
                  <span data-es="">En construcción</span>
                </span>
              </div>
              <h2 className="u-world-title">
                <span data-en="">Open-source evals for psychotherapy</span>
                <span data-es="">Evals open-source para psicoterapia</span>
              </h2>
            </div>
            <div className="u-world-body">
              <p className="u-world-desc">
                <span data-en="">
                  A brief-therapy simulator where AI agents enact family systems —
                  systemic homeostasis, resistance, escalation — built on a
                  clinically reviewed corpus of strategic and systemic
                  interventions. The goal: an open benchmark that measures whether
                  frontier models can recognize and produce real therapeutic
                  moves. In Spanish and English, because multilingual safety is an
                  open gap.
                </span>
                <span data-es="">
                  Un simulador de terapia breve donde agentes de IA encarnan
                  sistemas familiares — homeostasis sistémica, resistencia,
                  escalada — construido sobre un corpus de intervenciones
                  estratégicas y sistémicas con revisión clínica. La meta: un
                  benchmark abierto que mida si los modelos frontier reconocen y
                  producen movimientos terapéuticos reales. En español e inglés,
                  porque la seguridad multilingüe es una carencia abierta.
                </span>
              </p>
              <span className="u-world-meta">
                <FlaskConical />
                <span data-en="">First public release: 2026 · open benchmark to follow</span>
                <span data-es="">Primera publicación: 2026 · benchmark abierto después</span>
              </span>
            </div>
          </article>

          {/* Lumen Studio */}
          <article
            className="u-world u-reveal"
            data-glow="var(--u-light)"
            style={self("var(--u-light)")}
          >
            <div className="u-world-aside">
              <Colibri className="u-world-colibri" />
              <span className="u-tag u-mono">
                <Lightbulb />
                Studio
              </span>
              <span className="u-status">
                <span className="u-status-dot" />
                <span data-en="">Active · client work</span>
                <span data-es="">Activo · clientes</span>
              </span>
              <h2 className="u-world-title">Lumen Studio</h2>
            </div>
            <div className="u-world-body">
              <p className="u-world-desc">
                <span data-en="">
                  Technical catalogs, spec sheets and submittals for lighting
                  brands — automated with InDesign + AI pipelines, built on IES,
                  NFPA and EN standards. The studio that funds the rest.
                </span>
                <span data-es="">
                  Catálogos técnicos, fichas y submittals para marcas de
                  iluminación — automatizados con InDesign + pipelines de IA,
                  sobre normas IES, NFPA y EN. El estudio que financia el resto.
                </span>
              </p>
              <div className="u-spec" aria-hidden="true">
                <div className="u-spec-row">
                  <span className="u-spec-k">Standards</span>
                  <span className="u-spec-v">IES · NFPA · EN</span>
                </div>
                <div className="u-spec-row">
                  <span className="u-spec-k">Output</span>
                  <span className="u-spec-v">Catalogs · Specs · Submittals</span>
                </div>
                <div className="u-spec-row">
                  <span className="u-spec-k">Pipeline</span>
                  <span className="u-spec-v">InDesign + AI</span>
                </div>
              </div>
              <div className="u-links">
                <Link href="/lumen" className="u-link u-link--primary">
                  <span data-en="">Visit the studio</span>
                  <span data-es="">Visitar el estudio</span>
                  <ArrowRight />
                </Link>
                <Link href="/luxarmonie" className="u-link u-link--muted">
                  <span data-en="">Case study</span>
                  <span data-es="">Caso de estudio</span>
                </Link>
                <Link href="/tools/lumen-calculator" className="u-link u-link--muted">
                  <span data-en="">Free lumen calculator</span>
                  <span data-es="">Calculadora de lúmenes</span>
                </Link>
              </div>
            </div>
          </article>

          {/* Peace-conflicts game */}
          <article
            className="u-world u-reveal"
            data-glow="var(--u-play)"
            style={self("var(--u-play)")}
          >
            <div className="u-world-aside">
              <Colibri className="u-world-colibri" />
              <span className="u-tag u-mono">
                <Gamepad2 />
                <span data-en="">Game</span>
                <span data-es="">Juego</span>
              </span>
              <span className="u-status">
                <span className="u-status-dot" />
                <span data-en="">In development</span>
                <span data-es="">En desarrollo</span>
              </span>
              <h2 className="u-world-title">
                <span data-en="">A game about peace conflicts</span>
                <span data-es="">Un juego sobre conflictos de paz</span>
              </h2>
            </div>
            <div className="u-world-body">
              <p className="u-world-desc">
                <span data-en="">
                  Exploring conflict, mediation and de-escalation through play — a
                  psychologist&apos;s take on how peace is actually negotiated. To
                  be published.
                </span>
                <span data-es="">
                  Explorar el conflicto, la mediación y la de-escalada a través
                  del juego — la mirada de un psicólogo sobre cómo se negocia la
                  paz en la práctica. Próximamente publicado.
                </span>
              </p>
              <span className="u-world-meta">
                <span data-en="">Details soon</span>
                <span data-es="">Detalles pronto</span>
              </span>
            </div>
          </article>
        </section>

        {/* ── Roadmap ── */}
        <section id="roadmap" className="u-roadmap scroll-mt-28">
          <div className="u-section-head u-reveal">
            <span className="u-section-kicker u-mono">Roadmap</span>
            <h2 className="u-section-title">
              <span data-en="">Building in public — the 24-month plan</span>
              <span data-es="">Construyendo en público — el plan a 24 meses</span>
            </h2>
            <p className="u-section-sub">
              <span data-en="">
                Rule #1: what doesn&apos;t get published doesn&apos;t build
                reputation. These are the public milestones.
              </span>
              <span data-es="">
                Regla nº 1: lo que no se publica no construye reputación. Estos son
                los hitos públicos.
              </span>
            </p>
          </div>

          <div className="u-timeline">
            {MILESTONES.map((m) => (
              <div key={m.when} className="u-milestone u-reveal">
                <div className="u-milestone-when">{m.when}</div>
                <div>
                  <h3 className="u-milestone-t">
                    <span data-en="">{m.en.t}</span>
                    <span data-es="">{m.es.t}</span>
                  </h3>
                  <p className="u-milestone-d">
                    <span data-en="">{m.en.d}</span>
                    <span data-es="">{m.es.d}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="u-writing u-reveal">
            <PenLine />
            <span data-en="">Writing — first posts coming soon.</span>
            <span data-es="">Blog — primeros posts muy pronto.</span>
          </div>
        </section>

        {/* ── Contacto ── */}
        <section id="contact" className="u-contact scroll-mt-28">
          <h2 className="u-contact-h u-reveal">
            <span data-en="">
              Let&apos;s <em>talk</em>.
            </span>
            <span data-es="">
              <em>Hablemos</em>.
            </span>
          </h2>
          <p className="u-contact-p u-reveal">
            <span data-en="">
              Therapy × AI, evals, research collaborations, or the game — write me.
              For lighting documentation work, head to the studio.
            </span>
            <span data-es="">
              Terapia × IA, evals, colaboraciones de investigación o el juego —
              escríbeme. Para documentación técnica de iluminación, ve al estudio.
            </span>
          </p>
          <div className="u-reveal">
            <a href="mailto:diegoaquinde@gmail.com" className="u-mailto">
              diegoaquinde@gmail.com
            </a>
            <div>
              <Link href="/lumen#contact" className="u-contact-alt">
                <Lightbulb />
                <span data-en="">…or talk to Lumen Studio</span>
                <span data-es="">…o habla con Lumen Studio</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="u-footer">
        <div className="u-footer-inner">
          <span className="u-footer-brand">
            <Colibri className="u-colibri u-colibri--sm" />
            © 2026 Diego Quinde
          </span>
          <span style={{ display: "inline-flex", gap: 20, flexWrap: "wrap" }}>
            <Link href="/lumen">Lumen Studio</Link>
            <Link href="/privacidad">
              <span data-en="">Privacy</span>
              <span data-es="">Privacidad</span>
            </Link>
            <a href="mailto:diegoaquinde@gmail.com">
              <Mail width={13} height={13} style={{ display: "inline" }} />
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

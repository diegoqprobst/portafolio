"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FlaskConical,
  Gamepad2,
  Lightbulb,
  Mail,
  PenLine,
} from "lucide-react";

// Perfil umbrella de Diego: psicólogo clínico construyendo IA para salud
// mental, con Lumen Studio y el juego como líneas paralelas. English-first
// (la audiencia objetivo lee inglés) con el mismo toggle EN/ES del resto del
// sitio: spans data-en/data-es + clase lang-* en <body> (CSS en globals).
export default function UmbrellaClient() {
  const [lang, setLang] = useState<"en" | "es">("en");

  useEffect(() => {
    const saved = (localStorage.getItem("lang") as "en" | "es") || "en";
    setLang(saved);
  }, []);

  useEffect(() => {
    document.body.className = `lang-${lang}`;
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <div className="min-h-screen" style={{ background: "#0d1117", color: "#fff" }}>
      {/* fondo suave */}
      <div className="fixed inset-0 pointer-events-none opacity-25 z-[0]">
        <div className="absolute top-[-12%] left-[-8%] w-[38%] h-[38%] rounded-full bg-electric blur-[130px]" />
        <div className="absolute bottom-[-12%] right-[-8%] w-[32%] h-[32%] rounded-full bg-blue-700 blur-[130px]" />
      </div>

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
        style={{ background: "rgba(13,17,23,0.85)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#top" className="text-2xl font-black tracking-tighter gradient-text">
              DQ
            </a>
            <div className="flex items-center gap-5 sm:gap-7">
              <a
                href="#work"
                className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-white/50 hover:text-electric transition-colors"
              >
                <span data-en="">Work</span>
                <span data-es="">Trabajo</span>
              </a>
              <a
                href="#roadmap"
                className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-white/50 hover:text-electric transition-colors"
              >
                Roadmap
              </a>
              <a
                href="#contact"
                className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-white/50 hover:text-electric transition-colors"
              >
                <span data-en="">Contact</span>
                <span data-es="">Contacto</span>
              </a>
              <Link
                href="/lumen"
                className="text-xs font-bold uppercase tracking-widest text-amber-400/90 hover:text-amber-300 transition-colors"
              >
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
        </div>
      </nav>

      <main id="top" className="relative z-[1] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Hero ── */}
        <section className="pt-44 pb-20">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-6">
            Diego Quinde
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-8 max-w-4xl">
            <span data-en="">
              Clinical psychologist <span className="gradient-text">building AI</span> for
              mental health.
            </span>
            <span data-es="">
              Psicólogo clínico <span className="gradient-text">construyendo IA</span> para
              salud mental.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl font-light">
            <span data-en="">
              I work where psychotherapy meets language models: open-source
              evaluations for AI in psychotherapy, a brief-therapy simulator, a
              game about peace conflicts — and Lumen Studio, the technical
              documentation studio that funds the mission. Building in public,
              in English and Spanish.
            </span>
            <span data-es="">
              Trabajo donde la psicoterapia se cruza con los modelos de
              lenguaje: evaluaciones open-source de IA en psicoterapia, un
              simulador de terapia breve, un juego sobre conflictos de paz — y
              Lumen Studio, el estudio de documentación técnica que financia la
              misión. Construyendo en público, en inglés y español.
            </span>
          </p>
        </section>

        {/* ── Ventures ── */}
        <section id="work" className="pb-24 scroll-mt-28">
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-white/40 mb-8">
            <span data-en="">What I&apos;m building</span>
            <span data-es="">Qué estoy construyendo</span>
          </h2>

          <div className="space-y-6">
            {/* AI × Psychotherapy — flagship */}
            <div className="rounded-3xl border border-electric/25 bg-electric/5 p-8 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-electric bg-electric/10 border border-electric/20 rounded-full">
                  <Brain className="w-3.5 h-3.5" />
                  <span data-en="">AI × Psychotherapy</span>
                  <span data-es="">IA × Psicoterapia</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-green-400/90 bg-green-500/10 border border-green-500/20 rounded-full">
                  <span data-en="">Building now</span>
                  <span data-es="">En construcción</span>
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                <span data-en="">Open-source evals for psychotherapy</span>
                <span data-es="">Evals open-source para psicoterapia</span>
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-3xl mb-6">
                <span data-en="">
                  A brief-therapy simulator where AI agents enact family systems
                  — systemic homeostasis, resistance, escalation — built on a
                  clinically reviewed corpus of strategic and systemic
                  interventions. The goal: an open benchmark that measures
                  whether frontier models can recognize and produce real
                  therapeutic moves. In Spanish and English, because
                  multilingual safety is an open gap.
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
              <div className="flex items-center gap-2 text-sm text-white/40">
                <FlaskConical className="w-4 h-4" />
                <span data-en="">First public release: 2026 · open benchmark to follow</span>
                <span data-es="">Primera publicación: 2026 · benchmark abierto después</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lumen Studio */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 flex flex-col">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Studio
                  </span>
                  <span className="inline-flex items-center px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-white/40 bg-white/5 border border-white/10 rounded-full">
                    <span data-en="">Active · client work</span>
                    <span data-es="">Activo · clientes</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Lumen Studio</h3>
                <p className="text-gray-400 leading-relaxed text-[15px] mb-6 flex-1">
                  <span data-en="">
                    Technical catalogs, spec sheets and submittals for lighting
                    brands — automated with InDesign + AI pipelines. Built on
                    IES, NFPA and EN standards. The studio that funds the rest.
                  </span>
                  <span data-es="">
                    Catálogos técnicos, fichas y submittals para marcas de
                    iluminación — automatizados con InDesign + pipelines de IA.
                    Sobre normas IES, NFPA y EN. El estudio que financia el
                    resto.
                  </span>
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <Link
                    href="/lumen"
                    className="inline-flex items-center gap-2 text-sm font-bold text-electric hover:gap-3 transition-all"
                  >
                    <span data-en="">Visit the studio</span>
                    <span data-es="">Visitar el estudio</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/luxarmonie"
                    className="inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-electric transition-colors"
                  >
                    <span data-en="">Case study</span>
                    <span data-es="">Caso de estudio</span>
                  </Link>
                  <Link
                    href="/tools/lumen-calculator"
                    className="inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-electric transition-colors"
                  >
                    <span data-en="">Free lumen calculator</span>
                    <span data-es="">Calculadora de lúmenes</span>
                  </Link>
                </div>
              </div>

              {/* Peace-conflicts game */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 flex flex-col">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-purple-400 bg-purple-400/10 border border-purple-400/20 rounded-full">
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span data-en="">Game</span>
                    <span data-es="">Juego</span>
                  </span>
                  <span className="inline-flex items-center px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-white/40 bg-white/5 border border-white/10 rounded-full">
                    <span data-en="">In development</span>
                    <span data-es="">En desarrollo</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">
                  <span data-en="">A game about peace conflicts</span>
                  <span data-es="">Un juego sobre conflictos de paz</span>
                </h3>
                <p className="text-gray-400 leading-relaxed text-[15px] mb-6 flex-1">
                  <span data-en="">
                    Exploring conflict, mediation and de-escalation through play
                    — a psychologist&apos;s take on how peace is actually
                    negotiated. To be published.
                  </span>
                  <span data-es="">
                    Explorar el conflicto, la mediación y la de-escalada a
                    través del juego — la mirada de un psicólogo sobre cómo se
                    negocia la paz en la práctica. Próximamente publicado.
                  </span>
                </p>
                <div className="text-sm text-white/35 font-bold">
                  <span data-en="">Details soon</span>
                  <span data-es="">Detalles pronto</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Roadmap (building in public) ── */}
        <section id="roadmap" className="pb-24 scroll-mt-28">
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-white/40 mb-3">
            Roadmap
          </h2>
          <p className="text-2xl sm:text-3xl font-bold mb-3 max-w-2xl">
            <span data-en="">Building in public — the 24-month plan</span>
            <span data-es="">Construyendo en público — el plan a 24 meses</span>
          </p>
          <p className="text-gray-500 mb-10 max-w-2xl">
            <span data-en="">
              Rule #1: what doesn&apos;t get published doesn&apos;t build
              reputation. These are the public milestones.
            </span>
            <span data-es="">
              Regla nº 1: lo que no se publica no construye reputación. Estos
              son los hitos públicos.
            </span>
          </p>

          <div className="space-y-0">
            {[
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
            ].map((m, i) => (
              <div
                key={m.when}
                className={`flex gap-6 py-6 ${i > 0 ? "border-t border-white/8" : ""}`}
              >
                <div className="w-28 shrink-0 text-xs font-bold uppercase tracking-widest text-electric pt-1">
                  {m.when}
                </div>
                <div>
                  <div className="font-bold text-white mb-1.5">
                    <span data-en="">{m.en.t}</span>
                    <span data-es="">{m.es.t}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                    <span data-en="">{m.en.d}</span>
                    <span data-es="">{m.es.d}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2.5 text-sm text-white/35">
            <PenLine className="w-4 h-4" />
            <span data-en="">Writing — first posts coming soon.</span>
            <span data-es="">Blog — primeros posts muy pronto.</span>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="pb-28 scroll-mt-28">
          <div className="rounded-3xl border border-electric/20 bg-electric/5 p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              <span data-en="">Let&apos;s talk</span>
              <span data-es="">Hablemos</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              <span data-en="">
                Therapy × AI, evals, research collaborations, or the game —
                write me. For lighting documentation work, head to the studio.
              </span>
              <span data-es="">
                Terapia × IA, evals, colaboraciones de investigación o el juego
                — escríbeme. Para documentación técnica de iluminación, ve al
                estudio.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:diegoaquinde@gmail.com"
                className="inline-flex items-center justify-center gap-2 bg-electric text-white px-7 py-3.5 rounded-2xl font-bold hover:bg-blue-500 transition-colors"
              >
                <Mail className="w-5 h-5" />
                diegoaquinde@gmail.com
              </a>
              <Link
                href="/lumen#contact"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-3.5 rounded-2xl font-bold hover:border-amber-400/50 hover:text-amber-300 transition-colors"
              >
                <Lightbulb className="w-5 h-5" />
                Lumen Studio
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-[1] border-t border-white/5 py-8 px-4 text-center">
        <p className="text-gray-700 text-xs uppercase tracking-[0.4em]">
          © 2026 Diego Quinde ·{" "}
          <Link href="/lumen" className="hover:text-amber-300 transition-colors">
            Lumen Studio
          </Link>{" "}
          ·{" "}
          <Link href="/privacidad" className="hover:text-electric transition-colors">
            <span data-en="">Privacy</span>
            <span data-es="">Privacidad</span>
          </Link>
        </p>
      </footer>
    </div>
  );
}

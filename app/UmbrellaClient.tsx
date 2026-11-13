"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import "./umbrella.css";

// Video.js solo baja cuando hace falta; el resto de la página no lo paga.
// Kelvin, the Video.js v10 skin (see /kelvin). Client-only: it reads the video frame in the browser.
const KelvinPlayer = dynamic(() => import("./kelvin/KelvinPlayer"), { ssr: false });
import { FEATURED_WORK } from "@/lib/featured-work";
import { HACKATHONS } from "@/lib/hackathons";
import ZoomPlates from "./ZoomPlates";

// Raíz umbrella de diegoquinde.com — el folleto de exposición técnica.
// Una sola narrativa impresa: portada de tinta plana, banda de especificación,
// láminas numeradas, registro de experiencia, calendario y plancha de cierre.
// Bilingüe EN/ES con el toggle de todo el sitio (spans data-en/data-es + clase
// lang-* en <body>), ahora con atributo lang en cada capa para que un motor de
// respuesta sepa qué idioma está leyendo.

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

// Colibrí de marca (manual de marca de Diego) — trazo de línea, sin cambios.
// En la portada se graba solo a la carga, como una plancha entintándose. El
// largo de cada trazo va medido aquí (getTotalLength del propio path) para que
// la animación sea CSS pura: si dependiera de JS, el dibujo no empezaría hasta
// que hidrate y la portada se vería vacía ese rato.
const stroke = (i: number, len: number) =>
  ({ ["--i"]: i, ["--len"]: len }) as React.CSSProperties;

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
      <path d="M6 42 L42 48" style={stroke(0, 39)} />
      <path d="M42 48 Q52 38 64 44 Q78 51 76 62 Q73 70 60 68 Q47 65 42 48 Z" style={stroke(1, 97)} />
      <circle cx="49" cy="46" r="1.4" fill="currentColor" stroke="none" />
      <path d="M60 50 Q66 24 96 16 Q78 38 68 56" style={stroke(2, 104)} />
      <path d="M76 62 L106 64" style={stroke(3, 33)} />
      <path d="M76 64 L108 74" style={stroke(3.4, 36)} />
      <path d="M74 66 L100 80" style={stroke(3.8, 32)} />
    </svg>
  );
}

const CONTENTS = [
  { no: "01", href: "#moving-plate", en: "Moving plate", es: "Lámina en movimiento" },
  { no: "02", href: "#work", en: "Selected work", es: "Trabajo seleccionado" },
  { no: "03", href: "#prototypes", en: "Prototypes", es: "Prototipos" },
  { no: "04", href: "#practice", en: "Practice", es: "Práctica" },
  { no: "05", href: "#record", en: "Record", es: "Registro" },
  { no: "06", href: "#schedule", en: "Schedule", es: "Calendario" },
  { no: "07", href: "#contact", en: "Contact", es: "Contacto" },
];

const SCHEDULE = [
  {
    when: "2026 · Now",
    whenEs: "2026 · Ahora",
    en: {
      t: "Corpus and simulator, published",
      d: "A clinically reviewed corpus of brief-therapy interventions and the family-systems simulator go public, including the part nobody has seen: systemic homeostasis enacted by AI agents.",
    },
    es: {
      t: "Corpus y simulador, publicados",
      d: "El corpus de intervenciones de terapia breve con revisión clínica y el simulador de sistemas familiares se hacen públicos, incluida la parte que nadie ha visto: homeostasis sistémica representada por agentes de IA.",
    },
  },
  {
    when: "Late 2026",
    whenEs: "Fin de 2026",
    en: {
      t: "Open benchmark v1 and leaderboard",
      d: "Can frontier models detect symmetrical escalation or a double bind? Can they produce a valid reframe? Benchmark in Spanish and English, run against frontier models, results published openly, plus a preprint.",
    },
    es: {
      t: "Benchmark abierto v1 y leaderboard",
      d: "¿Detectan los modelos frontier una escalada simétrica o un doble vínculo? ¿Producen una reestructuración válida? Benchmark en español e inglés, corrido contra modelos frontier, resultados publicados en abierto, más un preprint.",
    },
  },
  {
    when: "2027",
    whenEs: "2027",
    en: {
      t: "Clinical validation and community",
      d: "Blind studies with practicing therapists: can they tell simulations from real vignettes, and do they agree when labeling? Journal submission, and the real adoption goal: therapists actually using the tools.",
    },
    es: {
      t: "Validación clínica y comunidad",
      d: "Estudios a ciegas con terapeutas en ejercicio: ¿distinguen simulaciones de viñetas reales?, ¿coinciden al etiquetar? Envío a journal, y la meta real de adopción: terapeutas usando las herramientas.",
    },
  },
  {
    when: "2028",
    whenEs: "2028",
    en: {
      t: "The reference, either way",
      d: "Two papers, a cited benchmark, an international venue. Floor of the plan: the Spanish-speaking reference in AI evaluation for psychotherapy.",
    },
    es: {
      t: "El referente, en cualquier escenario",
      d: "Dos papers, un benchmark citado, escena internacional. Piso del plan: el referente hispanohablante en evaluación de IA para psicoterapia.",
    },
  },
];

const PROJECT_TYPES = [
  { value: "", en: "Select one", es: "Elige una" },
  { value: "Lighting submittal", en: "Lighting submittal", es: "Submittal de iluminación" },
  { value: "Technical catalog", en: "Technical catalog", es: "Catálogo técnico" },
  { value: "Spec sheets", en: "Spec / cut sheets", es: "Fichas técnicas" },
  { value: "Product data", en: "Product data extraction", es: "Extracción de datos de producto" },
  { value: "Deck or report", en: "Deck or report", es: "Deck o informe" },
  { value: "Other", en: "Something else", es: "Otra cosa" },
];

export default function UmbrellaClient() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [sending, setSending] = useState(false);
  const [formState, setFormState] = useState<"idle" | "ok" | "error">("idle");
  const [formMsg, setFormMsg] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = (localStorage.getItem("lang") as "en" | "es") || "en";
    setLang(saved);
  }, []);

  useEffect(() => {
    document.body.className = `lang-${lang}`;
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  // Movimiento: una sola gramática. El filete de registro barre de izquierda a
  // derecha, el contenido sube detrás, y el colibrí se graba una vez a la
  // carga. La clase `js` solo se añade aquí: sin JS o en headless todo se
  // renderiza visible.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    root.querySelectorAll<HTMLElement>(".u-reg, .u-rise").forEach((el) => io.observe(el));

    const onScroll = () => {
      runRef.current?.classList.toggle("past", window.scrollY > window.innerHeight * 0.62);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setSending(true);
    setFormState("idle");
    setFormMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        // La API responde en español; la superficie puede estar en inglés, así
        // que el estado se cuenta aquí y no se reenvía el texto del servidor.
        throw new Error(res.status === 429 ? "rate" : "fail");
      }
      form.reset();
      setFormState("ok");
      setFormMsg(
        lang === "es"
          ? "Recibido. Te respondo al correo que dejaste, normalmente en un día hábil."
          : "Received. I reply to the address you left, usually within one business day."
      );
    } catch (err) {
      const rate = err instanceof Error && err.message === "rate";
      setFormState("error");
      setFormMsg(
        rate
          ? lang === "es"
            ? "Demasiados envíos seguidos. Prueba en unos minutos o escríbeme a diegoaquinde@gmail.com."
            : "Too many sends in a row. Try again in a few minutes, or email diegoaquinde@gmail.com."
          : lang === "es"
            ? "No se pudo enviar. Escríbeme a diegoaquinde@gmail.com."
            : "It did not send. Email me at diegoaquinde@gmail.com."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="umbra" ref={rootRef} id="top">
      {/* ── Running head ── */}
      <nav className="u-run" ref={runRef} aria-label="Primary">
        <div className="u-run-inner">
          <a href="#top" className="u-run-mark">
            <Colibri />
            Diego Quinde
          </a>
          <div className="u-run-nav">
            <a href="#moving-plate">
              <T en="Player" es="Reproductor" />
            </a>
            <a href="#work">
              <T en="Work" es="Trabajo" />
            </a>
            <a href="#practice">
              <T en="Practice" es="Práctica" />
            </a>
            <a href="#record">
              <T en="Record" es="Registro" />
            </a>
            <Link href="/lumen" className="u-run-studio">
              Lumen Studio
            </Link>
            <a href="#contact" className="u-run-contact">
              <T en="Contact" es="Contacto" />
            </a>
            <div className="u-lang">
              <button
                type="button"
                className={lang === "en" ? "active" : ""}
                onClick={() => setLang("en")}
                aria-label="English"
              >
                EN
              </button>
              <span className="sep">/</span>
              <button
                type="button"
                className={lang === "es" ? "active" : ""}
                onClick={() => setLang("es")}
                aria-label="Español"
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Portada ── */}
        <header className="u-plate">
          <div className="u-sheet u-cover">
            <div>
              <h1 className="u-cover-name" data-mis={"Diego\nQuinde"}>
                <span>Diego</span>
                <span>Quinde</span>
              </h1>
              <div className="u-cover-rule" />
              <p className="u-cover-stand">
                <T
                  en={
                    <>
                      An exhibit of <strong>technical documentation for lighting
                      brands</strong> — submittals, spec sheets and catalogs — and of
                      open research on AI for psychotherapy.
                    </>
                  }
                  es={
                    <>
                      Una exposición de <strong>documentación técnica para marcas de
                      iluminación</strong> — submittals, fichas y catálogos — y de
                      investigación abierta sobre IA para psicoterapia.
                    </>
                  }
                />
              </p>
            </div>
            <div className="u-cover-aside">
              <div className="u-cover-art">
                <Colibri />
              </div>
              <p className="u-imprint">
                <T en="Edition MMXXVI" es="Edición MMXXVI" />
                <br />
                <T en="Seven sections · EN / ES" es="Siete secciones · EN / ES" />
                <br />
                <T en="Miami, Florida" es="Miami, Florida" />
              </p>
            </div>
          </div>
        </header>

        {/* ── 01 · Lámina en movimiento ── */}
        <span className="u-reg" aria-hidden="true" />
        <section className="u-section u-section--sheet" id="moving-plate">
          <div className="u-sheet">
            <div className="u-head u-rise">
              <span className="u-head-no" aria-hidden="true">
                01
              </span>
              <div>
                <h2 className="u-h2">
                  <T en="A plate that moves." es="Una lámina que se mueve." />
                </h2>
                <p className="u-lede u-head-sub">
                  <T
                    en="Kelvin, a Video.js player I designed for reviewing light. It plays with one row of controls; pause it and the frame becomes an instrument: a loupe, a drafting crosshair and tools that compare two points in stops, measure areas and lengths, and map the exposure."
                    es="Kelvin, un reproductor Video.js que diseñé para revisar la luz. Se reproduce con una sola fila de controles; al pausar, el fotograma se vuelve un instrumento: una lupa, una retícula de dibujo y herramientas que comparan dos puntos en pasos f, miden áreas y longitudes y mapean la exposición."
                  />
                </p>
              </div>
            </div>

            <figure className="u-moving u-rise">
              <KelvinPlayer />
              <figcaption className="u-exhibit-cap">
                <span>
                  <T en="Plate 01 · in motion" es="Lámina 01 · en movimiento" />
                </span>
                <span>
                  <T en="Own footage · pause, then move over the picture" es="Toma propia · pausa y mueve el cursor sobre la imagen" />
                </span>
                <Link href="/kelvin">
                  <T en="How it works" es="Cómo funciona" />
                </Link>
              </figcaption>
            </figure>

            <table className="u-spec u-moving-spec u-rise">
              <tbody>
                <tr>
                  <th scope="row">
                    <T en="Player" es="Reproductor" />
                  </th>
                  <td>Kelvin · <T en="Video.js 10 skin, designed and built by me" es="piel para Video.js 10, diseñada y construida por mí" /></td>
                </tr>
                <tr>
                  <th scope="row">
                    <T en="Format" es="Formato" />
                  </th>
                  <td>{process.env.NEXT_PUBLIC_KELVIN_MUX_PLAYBACK_ID ? "HLS · Mux · 1920×1080" : "MP4 · H.264 · 1280×720"}</td>
                </tr>
                <tr>
                  <th scope="row">
                    <T en="Runtime" es="Duración" />
                  </th>
                  <td>0:25</td>
                </tr>
                <tr>
                  <th scope="row">
                    <T en="Controls" es="Controles" />
                  </th>
                  <td>
                    <T
                      en="Space plays · X aims the loupe · Enter pins a note · Esc steps back"
                      es="Espacio reproduce · X apunta la lupa · Enter fija una nota · Esc retrocede"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Banda de especificación ── */}
        <section className="u-spec-band" aria-label="Specification">
          <div className="u-sheet u-spec-grid">
            <table className="u-spec">
              <tbody>
                <tr>
                  <th scope="row">
                    <T en="Discipline" es="Disciplina" />
                  </th>
                  <td>
                    <T
                      en="Technical documentation, editorial design, product data, AI systems"
                      es="Documentación técnica, diseño editorial, datos de producto, sistemas de IA"
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <T en="Standards" es="Normas" />
                  </th>
                  <td>IES · NFPA · EN</td>
                </tr>
                <tr>
                  <th scope="row">
                    <T en="Output" es="Entregables" />
                  </th>
                  <td>
                    <T
                      en="Submittals · Spec sheets · Catalogs · Decks"
                      es="Submittals · Fichas · Catálogos · Decks"
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <T en="Pipeline" es="Pipeline" />
                  </th>
                  <td>
                    <T en="Adobe InDesign + AI extraction" es="Adobe InDesign + extracción con IA" />
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <T en="Based in" es="Base" />
                  </th>
                  <td>
                    <T
                      en="Miami, Florida · working in English and Spanish"
                      es="Miami, Florida · trabajo en inglés y español"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <nav aria-label="Contents">
              <p className="u-label" style={{ marginBottom: 10 }}>
                <T en="Contents" es="Índice" />
              </p>
              <ul className="u-contents">
                {CONTENTS.map((c) => (
                  <li key={c.no}>
                    <a href={c.href}>
                      <span className="no">{c.no}</span>
                      <T en={c.en} es={c.es} />
                      <span className="dots" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a href="#contact" className="u-act">
              <span className="u-act-t">
                <T en="Start a document" es="Empezar un documento" />
              </span>
              <span className="u-act-d">
                <T
                  en="Send the brief and the product data you have. You get a scope and a date back."
                  es="Envía el encargo y los datos de producto que tengas. Te devuelvo alcance y fecha."
                />
              </span>
              <span className="u-act-m">diegoaquinde@gmail.com</span>
            </a>
          </div>
        </section>

        {/* ── El zoom: de la ciudad a la ficha técnica ── */}
        <ZoomPlates />

        {/* ── Declaración ── */}
        <section className="u-statement" id="statement">
          <div className="u-sheet">
            <h2 className="u-statement-h u-rise">
              <T
                en={
                  <>
                    Three crafts, <em>one obsession:</em> understanding the mind, and
                    building for it.
                  </>
                }
                es={
                  <>
                    Tres oficios, <em>una obsesión:</em> entender la mente y construir
                    para ella.
                  </>
                }
              />
            </h2>
            <div className="u-statement-cols">
              <p className="u-rise">
                <T
                  en="I am a clinical psychologist who produces technical documentation. I turn fragmented product data, research and strategy into documents a committee can approve: lighting submittals, spec sheets, catalogs, decks and reports — assembled against IES, NFPA and EN requirements on an InDesign and AI pipeline. Recent work spans public infrastructure in the United States, lighting e-commerce in France and healthcare strategy in the United States."
                  es="Soy psicólogo clínico y produzco documentación técnica. Convierto datos de producto fragmentados, investigación y estrategia en documentos que un comité puede aprobar: submittals de iluminación, fichas, catálogos, decks e informes, armados contra requisitos IES, NFPA y EN sobre un pipeline de InDesign e IA. El trabajo reciente abarca infraestructura pública en Estados Unidos, comercio de iluminación en Francia y estrategia sanitaria en Estados Unidos."
                />
              </p>
              <p className="u-rise" style={{ ["--u-delay" as string]: "90ms" }}>
                <T
                  en="Psychotherapy taught me how people actually read, decide and resist — which is the whole job when a document has to survive a review committee. Language models let me study that at scale, so the second half of the work is an open-source benchmark for AI in psychotherapy. A studio for lighting brands funds the research while it is young. Different surfaces, one question."
                  es="La psicoterapia me enseñó cómo leen, deciden y se resisten las personas de verdad, que es el trabajo entero cuando un documento tiene que sobrevivir a un comité de revisión. Los modelos de lenguaje me dejan estudiarlo a escala, así que la otra mitad del trabajo es un benchmark open-source de IA para psicoterapia. Un estudio para marcas de iluminación financia la investigación mientras es joven. Superficies distintas, una pregunta."
                />
              </p>
            </div>
          </div>
        </section>

        {/* ── 02 · Trabajo seleccionado ── */}
        <span className="u-reg" aria-hidden="true" />
        <section className="u-section" id="work">
          <div className="u-sheet">
            <div className="u-head u-rise">
              <span className="u-head-no" aria-hidden="true">
                02
              </span>
              <div>
                <h2 className="u-h2">
                  <T en="Complex inputs. Clear outcomes." es="Entradas complejas. Resultados claros." />
                </h2>
                <p className="u-lede u-head-sub">
                  <T
                    en="Four documents delivered in 2026. Each one started as scattered product data, research or a spreadsheet, and ended as something a team could sell, approve or publish."
                    es="Cuatro documentos entregados en 2026. Cada uno empezó como datos de producto dispersos, investigación o una hoja de cálculo, y terminó como algo que un equipo pudo vender, aprobar o publicar."
                  />
                </p>
              </div>
            </div>

            <div className="u-exhibits">
              {FEATURED_WORK.map((project, i) => (
                <a
                  key={project.title}
                  href={project.href}
                  className="u-exhibit u-rise"
                  style={{ ["--u-delay" as string]: `${i * 60}ms` }}
                  target={project.kind === "document" ? "_blank" : undefined}
                  rel={project.kind === "document" ? "noopener noreferrer" : undefined}
                >
                  <div className="u-plate-img">
                    <span className="u-plate-no">
                      <T en={`Plate ${i + 1}`} es={`Lámina ${i + 1}`} />
                    </span>
                    <Image
                      src={project.image}
                      alt={`${project.title} — document preview`}
                      width={720}
                      height={450}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="u-exhibit-t">{project.title}</h3>
                    <p className="u-exhibit-cap">
                      <span>{project.client}</span>
                      <span>{project.year}</span>
                    </p>
                    <p className="u-exhibit-note u-dim">
                      <T en={project.service.en} es={project.service.es} />
                    </p>
                    <p className="u-exhibit-note">
                      <T en={project.outcome.en} es={project.outcome.es} />
                    </p>
                    <span className="u-read">
                      <T
                        en={project.kind === "case-study" ? "Read the case" : "Open the document"}
                        es={project.kind === "case-study" ? "Leer el caso" : "Abrir el documento"}
                      />
                      <ArrowUpRight />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 03 · Prototipos ── */}
        <span className="u-reg" aria-hidden="true" />
        <section className="u-section" id="prototypes">
          <div className="u-sheet">
            <div className="u-head u-rise">
              <span className="u-head-no" aria-hidden="true">
                03
              </span>
              <div>
                <h2 className="u-h2">
                  <T en="Built fast. Built carefully." es="Rápido, pero con cuidado." />
                </h2>
                <p className="u-lede u-head-sub">
                  <T
                    en="Two agent prototypes from 2026 hackathons, where the interesting part was deciding what the model must never do."
                    es="Dos prototipos de agentes de hackathons de 2026, donde lo interesante fue decidir qué nunca debe hacer el modelo."
                  />
                </p>
              </div>
            </div>

            <div className="u-exhibits">
              {HACKATHONS.map((h, i) => (
                <article
                  key={h.title}
                  className="u-exhibit u-rise"
                  style={{ ["--u-delay" as string]: `${i * 60}ms` }}
                >
                  <div>
                    <h3 className="u-exhibit-t">{h.title}</h3>
                    <p className="u-exhibit-cap">
                      <span>{h.event}</span>
                      <span>{h.year}</span>
                    </p>
                    <p className="u-exhibit-note u-dim">
                      <T en={h.role.en} es={h.role.es} />
                    </p>
                    <p className="u-exhibit-note">
                      <T en={h.summary.en} es={h.summary.es} />
                    </p>
                  </div>
                  <div>
                    <p className="u-label">
                      <T en="Findings" es="Hallazgos" />
                    </p>
                    <ul className="u-findings">
                      {h.highlights.en.map((_, k) => (
                        <li key={k}>
                          <T en={h.highlights.en[k]} es={h.highlights.es[k]} />
                        </li>
                      ))}
                    </ul>
                    <p className="u-stack">{h.stack}</p>
                    <div className="u-links-row">
                      {h.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="u-read"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <T en={link.label.en} es={link.label.es} />
                          <ArrowUpRight />
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04 · Práctica ── */}
        <span className="u-reg" aria-hidden="true" />
        <section className="u-section u-section--ink" id="practice">
          <div className="u-sheet">
            <div className="u-head u-rise">
              <span className="u-head-no" aria-hidden="true">
                04
              </span>
              <div>
                <h2 className="u-h2">
                  <T en="Three divisions, one desk." es="Tres divisiones, un escritorio." />
                </h2>
                <p className="u-lede u-head-sub">
                  <T
                    en="What is running right now, what it is for, and how far along it is."
                    es="Qué está corriendo ahora, para qué es y en qué punto está."
                  />
                </p>
              </div>
            </div>

            <div className="u-depts">
              {/* Lumen Studio */}
              <article className="u-dept u-rise">
                <div className="u-dept-side">
                  <div className="u-dept-art">
                    <Colibri />
                  </div>
                  <h3 className="u-h3">Lumen Studio</h3>
                  <span className="u-state u-state--live">
                    <b />
                    <T en="Active · client work" es="Activo · clientes" />
                  </span>
                </div>
                <div>
                  <p className="u-body">
                    <T
                      en="Technical catalogs, spec sheets and submittals for lighting brands, automated with InDesign and AI pipelines and built on IES, NFPA and EN standards. This is the studio that funds the rest, and the work most people hire me for."
                      es="Catálogos técnicos, fichas y submittals para marcas de iluminación, automatizados con InDesign y pipelines de IA, sobre normas IES, NFPA y EN. Es el estudio que financia el resto, y el trabajo por el que más me contratan."
                    />
                  </p>
                  <table className="u-spec u-exhibit-spec">
                    <tbody>
                      <tr>
                        <th scope="row">
                          <T en="Standards" es="Normas" />
                        </th>
                        <td>IES · NFPA · EN</td>
                      </tr>
                      <tr>
                        <th scope="row">
                          <T en="Output" es="Entregables" />
                        </th>
                        <td>
                          <T
                            en="Catalogs · Spec sheets · Submittals"
                            es="Catálogos · Fichas · Submittals"
                          />
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Pipeline</th>
                        <td>
                          <T en="InDesign + AI extraction" es="InDesign + extracción con IA" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="u-links-row" style={{ marginTop: 4 }}>
                    <Link href="/lumen" className="u-read">
                      <T en="Visit the studio" es="Visitar el estudio" />
                      <ArrowUpRight />
                    </Link>
                    <Link href="/tools/lumen-calculator" className="u-read">
                      <T en="Free lumen calculator" es="Calculadora de lúmenes" />
                      <ArrowUpRight />
                    </Link>
                  </div>
                </div>
              </article>

              {/* AI × Psicoterapia */}
              <article className="u-dept u-rise">
                <div className="u-dept-side">
                  <h3 className="u-h3">
                    <T
                      en="Open-source evals for psychotherapy"
                      es="Evals open-source para psicoterapia"
                    />
                  </h3>
                  <span className="u-state u-state--live">
                    <b />
                    <T en="Building now" es="En construcción" />
                  </span>
                </div>
                <div>
                  <p className="u-body">
                    <T
                      en="A brief-therapy simulator where AI agents enact family systems — systemic homeostasis, resistance, escalation — built on a clinically reviewed corpus of strategic and systemic interventions. The goal is an open benchmark that measures whether frontier models can recognize and produce real therapeutic moves, in Spanish and English, because multilingual safety is an open gap."
                      es="Un simulador de terapia breve donde agentes de IA encarnan sistemas familiares — homeostasis sistémica, resistencia, escalada — construido sobre un corpus de intervenciones estratégicas y sistémicas con revisión clínica. La meta es un benchmark abierto que mida si los modelos frontier reconocen y producen movimientos terapéuticos reales, en español e inglés, porque la seguridad multilingüe es una carencia abierta."
                    />
                  </p>
                  <p className="u-note">
                    <T
                      en="First public release planned for 2026; the open benchmark follows. Nothing is published yet."
                      es="Primera publicación prevista para 2026; el benchmark abierto va después. Todavía no hay nada publicado."
                    />
                  </p>
                </div>
              </article>

              {/* Juego */}
              <article className="u-dept u-rise">
                <div className="u-dept-side">
                  <h3 className="u-h3">
                    <T en="A game about peace conflicts" es="Un juego sobre conflictos de paz" />
                  </h3>
                  <span className="u-state">
                    <b />
                    <T en="In development" es="En desarrollo" />
                  </span>
                </div>
                <div>
                  <p className="u-body">
                    <T
                      en="Conflict, mediation and de-escalation explored through play: a psychologist's take on how peace is actually negotiated."
                      es="Conflicto, mediación y de-escalada explorados a través del juego: la mirada de un psicólogo sobre cómo se negocia la paz en la práctica."
                    />
                  </p>
                  <p className="u-note">
                    <T en="Details to be published." es="Detalles por publicar." />
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── 05 · Registro ── */}
        <span className="u-reg" aria-hidden="true" />
        <section className="u-section" id="record">
          <div className="u-sheet">
            <div className="u-head u-rise">
              <span className="u-head-no" aria-hidden="true">
                05
              </span>
              <div>
                <h2 className="u-h2">
                  <T en="Work inside delivery teams." es="Trabajo dentro de equipos de entrega." />
                </h2>
                <p className="u-lede u-head-sub">
                  <T
                    en="Client delivery and AI data work, with an emphasis on clear requirements, consistent quality and useful handoffs."
                    es="Entrega a clientes y trabajo con datos de IA, con foco en requisitos claros, calidad consistente y traspasos útiles."
                  />
                </p>
              </div>
            </div>

            <table className="u-record u-rise">
              <thead>
                <tr>
                  <th scope="col">
                    <T en="Organization" es="Organización" />
                  </th>
                  <th scope="col">
                    <T en="Role" es="Rol" />
                  </th>
                  <th scope="col">
                    <T en="What the work was" es="En qué consistió" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">It&apos;s Rappid</th>
                  <td className="u-record-role">Forward Web Developer Engineer</td>
                  <td>
                    <T
                      en="Refined product catalogs and automated systems for client delivery, translating requirements into reliable web-ready outputs."
                      es="Puse a punto catálogos de productos y sistemas automatizados para clientes, convirtiendo requisitos en entregables web confiables."
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">iWallet</th>
                  <td className="u-record-role">Data Annotator</td>
                  <td>
                    <T
                      en="Annotated complex source material for an AI initiative and documented decision rules and quality checks, so review became consistent and repeatable."
                      es="Anoté material técnico complejo para una iniciativa de IA y documenté criterios de decisión y controles de calidad, para que la revisión fuera consistente y reproducible."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 06 · Calendario ── */}
        <span className="u-reg" aria-hidden="true" />
        <section className="u-section" id="schedule">
          <div className="u-sheet">
            <div className="u-head u-rise">
              <span className="u-head-no" aria-hidden="true">
                06
              </span>
              <div>
                <h2 className="u-h2">
                  <T en="The 24-month plan, in public." es="El plan a 24 meses, en público." />
                </h2>
                <p className="u-lede u-head-sub">
                  <T
                    en="What does not get published does not build reputation. These are stated plans, not delivered work."
                    es="Lo que no se publica no construye reputación. Son planes declarados, no trabajo entregado."
                  />
                </p>
              </div>
            </div>

            <div className="u-sched u-rise">
              {SCHEDULE.map((m) => (
                <div className="u-sched-row" key={m.when}>
                  <div className="u-sched-when">
                    <T en={m.when} es={m.whenEs} />
                  </div>
                  <div>
                    <h3 className="u-sched-t">
                      <T en={m.en.t} es={m.es.t} />
                    </h3>
                    <p className="u-sched-d">
                      <T en={m.en.d} es={m.es.d} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="u-note u-rise">
              <T en="Writing: first posts coming soon." es="Blog: primeros posts muy pronto." />
            </p>
          </div>
        </section>

        {/* ── 07 · Contacto ── */}
        <section className="u-close" id="contact">
          <div className="u-sheet u-close-grid">
            <div>
              <h2 className="u-close-h">
                <T en="Let's talk." es="Hablemos." />
              </h2>
              <p className="u-close-p">
                <T
                  en="Need submittals, spec sheets or a catalog produced? Or complex research, product data or strategy turned into something people can act on? Tell me what you are building."
                  es="¿Necesitas producir submittals, fichas o un catálogo? ¿O convertir investigación, datos de producto o estrategia compleja en algo sobre lo que se pueda actuar? Cuéntame qué estás construyendo."
                />
              </p>
              <a href="mailto:diegoaquinde@gmail.com" className="u-mail">
                diegoaquinde@gmail.com
              </a>
              <div className="u-close-alt">
                <Link href="/lumen#contact">
                  <T en="Talk to Lumen Studio" es="Hablar con Lumen Studio" />
                </Link>
                <a
                  href="https://www.upwork.com/freelancers/diegoaq"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <T en="Hire on Upwork" es="Contratar en Upwork" />
                </a>
              </div>
            </div>

            <form className="u-form" onSubmit={onSubmit} noValidate={false}>
              <div className="u-field-row">
                <label className="u-field">
                  <span>
                    <T en="Name" es="Nombre" />
                  </span>
                  <input name="name" type="text" required maxLength={120} autoComplete="name" />
                </label>
                <label className="u-field">
                  <span>
                    <T en="Company" es="Empresa" />
                  </span>
                  <input name="company" type="text" maxLength={120} autoComplete="organization" />
                </label>
              </div>
              <label className="u-field">
                <span>
                  <T en="Email" es="Correo" />
                </span>
                <input name="email" type="email" required maxLength={200} autoComplete="email" />
              </label>
              <label className="u-field">
                <span>
                  <T en="What do you need" es="Qué necesitas" />
                </span>
                <select name="project_type" defaultValue="">
                  {PROJECT_TYPES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {lang === "es" ? p.es : p.en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="u-field">
                <span>
                  <T en="The brief" es="El encargo" />
                </span>
                <textarea
                  name="message"
                  rows={4}
                  maxLength={5000}
                  placeholder={
                    lang === "es"
                      ? "Qué documento, para quién, y para cuándo."
                      : "Which document, for whom, and by when."
                  }
                />
              </label>
              <div className="u-hp" aria-hidden="true">
                <label>
                  Website
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <button className="u-submit" type="submit" disabled={sending}>
                {sending ? (
                  <T en="Sending…" es="Enviando…" />
                ) : (
                  <T en="Send the brief" es="Enviar el encargo" />
                )}
              </button>
              <p className="u-form-msg" data-state={formState} role="status" aria-live="polite">
                {formMsg}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="u-colophon">
        <div className="u-sheet u-colophon-inner">
          <span className="u-colophon-mark">
            <Colibri />
            <span style={{ color: "var(--u-carbon-2)" }}>© 2026 Diego Quinde</span>
          </span>
          <span>
            <T
              en="Set in Montserrat and Helvetica Neue. Printed in one ink."
              es="Compuesto en Montserrat y Helvetica Neue. Impreso a una tinta."
            />
          </span>
          <span className="u-colophon-links">
            <Link href="/lumen">Lumen Studio</Link>
            <Link href="/privacidad">
              <T en="Privacy" es="Privacidad" />
            </Link>
            <a href="mailto:diegoaquinde@gmail.com">
              <T en="Email" es="Correo" />
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

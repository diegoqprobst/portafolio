import Image from "next/image";

export default function Hero() {
  return (
    <>
      {/* ══════════ HERO ════════════════════════════════════════ */}
      <section id="hero" className="hero">
        <div className="hero-glow">
          <div className="hero-glow-a" />
          <div className="hero-glow-b" />
        </div>
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <span className="lumen-mark" />
              Lumen Studio
              <span className="he-tag">
                <span data-en="">— Technical clarity for product brands</span>
                <span data-es="">— Claridad técnica para marcas de producto</span>
              </span>
            </div>

            <a
              href="https://www.upwork.com/freelancers/diegoaq?mp_source=share"
              className="hero-badge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="hero-badge-dot" />
              <span data-en="">Available on Upwork · Project Catalog</span>
              <span data-es="">Disponible en Upwork · Project Catalog</span>
              <span className="hb-arrow">↗</span>
            </a>

            <h1 className="hero-h1">
              <span data-en="">
                Technical product catalogs & spec sheets that stay{" "}
                <em>perfectly consistent.</em>
              </span>
              <span data-es="">
                Catálogos y fichas técnicas de producto,{" "}
                <em>perfectamente consistentes.</em>
              </span>
            </h1>

            <p className="hero-sub">
              <span data-en="">
                Lumen Studio turns raw specs, supplier PDFs, and half-finished
                layouts into print- and digital-ready catalogs, spec sheets, and
                submittals in <strong>Adobe InDesign</strong> — automated for
                speed and consistency, for lighting and industrial brands selling
                internationally.
              </span>
              <span data-es="">
                Lumen Studio convierte specs crudos, PDFs de proveedor y maquetas
                a medias en catálogos, fichas técnicas y submittals listos para
                impresión y digital en <strong>Adobe InDesign</strong> —
                automatizados para velocidad y consistencia, para marcas de
                iluminación e industriales que venden en mercados internacionales.
              </span>
            </p>

            <div className="hero-actions">
              <a href="#contact" className="btn-primary">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span data-en="">Start a conversation</span>
                <span data-es="">Iniciar conversación</span>
              </a>
              <a href="#projects" className="btn-ghost">
                <span data-en="">See my work</span>
                <span data-es="">Ver proyectos</span>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  viewBox="0 0 24 24"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <div className="hero-stat-val">−75%</div>
                <div className="hero-stat-lbl">
                  <span data-en="">Manual hours, avg.</span>
                  <span data-es="">Horas manuales, prom.</span>
                </div>
              </div>
              <div>
                <div className="hero-stat-val">200+</div>
                <div className="hero-stat-lbl">
                  <span data-en="">Docs built</span>
                  <span data-es="">Docs producidos</span>
                </div>
              </div>
              <div>
                <div className="hero-stat-val">4+ yrs</div>
                <div className="hero-stat-lbl">
                  <span data-en="">In the industry</span>
                  <span data-es="">En la industria</span>
                </div>
              </div>
            </div>

            <a href="#story" className="hero-scroll-hint">
              <span data-en="">See how I work</span>
              <span data-es="">Cómo trabajo</span>
              <span className="hsh-arrow" aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="hero-photo-wrap">
            <div className="hero-photo-bg" />
            <Image
              src="/IMG_6290.JPG"
              alt="Diego Quinde"
              className="hero-photo"
              width={380}
              height={507}
              priority
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: "3/4",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
            <div className="hero-photo-badge">
              <div className="hero-photo-badge-icon">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{ color: "var(--accent)" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="hero-photo-badge-text">
                <strong>Diego Quinde</strong>
                <span>
                  <span data-en="">Founder, Lumen Studio · InDesign &amp; Automation</span>
                  <span data-es="">Fundador, Lumen Studio · InDesign y Automatización</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider-line" />

    </>
  );
}

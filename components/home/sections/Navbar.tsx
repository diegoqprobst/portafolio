export default function Navbar({ lang, setLangState, mobileOpen, setMobileOpen }: { lang: "en" | "es"; setLangState: (l: "en" | "es") => void; mobileOpen: boolean; setMobileOpen: (value: boolean | ((prev: boolean) => boolean)) => void }) {
  return (
    <>
      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="#hero" className="nav-logo">
            <span className="lumen-mark" />
            {"Lumen "}
            <span className="wm-studio">Studio</span>
          </a>
          <ul className="nav-links">
            <li>
              <a href="#about">
                <span data-en="">About</span>
                <span data-es="">Sobre mí</span>
              </a>
            </li>
            <li>
              <a href="#projects">
                <span data-en="">Projects</span>
                <span data-es="">Proyectos</span>
              </a>
            </li>
            <li>
              <a href="#services">
                <span data-en="">Services</span>
                <span data-es="">Servicios</span>
              </a>
            </li>
            <li>
              <a href="#testimonials">
                <span data-en="">Clients</span>
                <span data-es="">Clientes</span>
              </a>
            </li>
            <li>
              <a href="#contact">
                <span data-en="">Contact</span>
                <span data-es="">Contacto</span>
              </a>
            </li>
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="lang-toggle">
              <button
                className={`lang-btn${lang === "en" ? " active" : ""}`}
                onClick={() => setLangState("en")}
              >
                EN
              </button>
              <span className="lang-sep">|</span>
              <button
                className={`lang-btn${lang === "es" ? " active" : ""}`}
                onClick={() => setLangState("es")}
              >
                ES
              </button>
            </div>
            <a href="#contact" className="nav-cta">
              <span data-en="">Let&apos;s Talk</span>
              <span data-es="">Hablemos</span>
            </a>
            <button
              className="mobile-menu-btn"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="19" y2="6" />
                <line x1="3" y1="12" x2="19" y2="12" />
                <line x1="3" y1="18" x2="19" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ─────────────────────────────────────── */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        {[
          ["#about", "About", "Sobre mí"],
          ["#projects", "Projects", "Proyectos"],
          ["#services", "Services", "Servicios"],
          ["#testimonials", "Clients", "Clientes"],
          ["#contact", "Contact", "Contacto"],
        ].map(([href, en, es]) => (
          <a key={href} href={href} onClick={() => setMobileOpen(false)}>
            <span data-en="">{en}</span>
            <span data-es="">{es}</span>
          </a>
        ))}
      </div>

    </>
  );
}

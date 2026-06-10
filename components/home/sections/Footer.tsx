export default function Footer() {
  return (
    <>
      {/* ══════════ FOOTER ═══════════════════════════════════════ */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">
            <span className="lumen-mark" />
            {"Lumen "}
            <span className="wm-studio">Studio</span>
          </div>
          <div className="footer-copy">
            © 2026 Lumen Studio · Diego Quinde · diegoquinde.com
          </div>
          <div className="footer-links">
            <a href="mailto:diegoaquinde@gmail.com">Email</a>
            <a
              href="https://www.upwork.com/freelancers/diegoaq?mp_source=share"
              target="_blank"
              rel="noopener noreferrer"
            >
              Upwork
            </a>
            <a href="/saratoga">
              <span data-en="">Case Study</span>
              <span data-es="">Caso de Estudio</span>
            </a>
            <a href="/privacidad">
              <span data-en="">Privacy</span>
              <span data-es="">Privacidad</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

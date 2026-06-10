import type { FormEvent } from "react";

export default function Contact({ handleContactSubmit, contactStatus }: { handleContactSubmit: (e: FormEvent<HTMLFormElement>) => void; contactStatus: { kind: "ok" | "error"; msg: string } | null }) {
  return (
    <>
      {/* ══════════ CONTACT ══════════════════════════════════════ */}
      <section id="contact">
        <div className="section">
          <div className="section-header reveal">
            <div className="section-label">
              <span data-en="">Contact</span>
              <span data-es="">Contacto</span>
            </div>
            <h2 className="section-title">
              <span data-en="">Let&apos;s talk about your project</span>
              <span data-es="">Hablemos sobre tu proyecto</span>
            </h2>
          </div>
          <div className="contact-grid">
            <div>
              <p className="contact-body reveal">
                <span data-en="">
                  I work with product brands — lighting, industrial and beyond —
                  that need catalogs and spec sheets done right, consistent, and
                  on time.{" "}
                  <strong>Tell me what you&apos;re building</strong> and I&apos;ll tell
                  you how Lumen Studio can help.
                </span>
                <span data-es="">
                  Trabajo con marcas de producto — iluminación, industriales y
                  más — que necesitan catálogos y fichas técnicas bien hechos,
                  consistentes y a tiempo.{" "}
                  <strong>Cuéntame qué estás construyendo</strong> y te diré
                  cómo Lumen Studio puede ayudar.
                </span>
              </p>
              <div className="contact-options">
                <a href="mailto:diegoaquinde@gmail.com" className="contact-opt reveal">
                  <div className="contact-opt-icon">✉️</div>
                  <div className="contact-opt-text">
                    <strong>Email</strong>
                    <span>diegoaquinde@gmail.com</span>
                  </div>
                </a>
                <a
                  href="https://www.upwork.com/freelancers/diegoaq?mp_source=share"
                  className="contact-opt reveal"
                  style={{ transitionDelay: "60ms" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="contact-opt-icon">💼</div>
                  <div className="contact-opt-text">
                    <strong>Upwork</strong>
                    <span>
                      <span data-en="">Hire me through Upwork</span>
                      <span data-es="">Contrátame por Upwork</span>
                    </span>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <form
                className="contact-form reveal"
                onSubmit={handleContactSubmit}
              >
                {/* Honeypot anti-spam: oculto para humanos, los bots lo rellenan. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                <div className="form-row">
                  <input type="text" name="name" placeholder="Name" required />
                  <input type="text" name="company" placeholder="Company" />
                </div>
                <input type="email" name="email" placeholder="Email" required />
                <select name="project_type" defaultValue="">
                  <option value="" disabled>
                    Project type…
                  </option>
                  <option value="catalog">Product Catalog (InDesign)</option>
                  <option value="specsheet">Spec &amp; Data Sheets</option>
                  <option value="standardization">Document Standardization</option>
                  <option value="automation">Production Automation</option>
                  <option value="other">Other / Otro</option>
                </select>
                <textarea name="message" placeholder="Tell me about your project…" />
                <button type="submit" className="form-submit">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    viewBox="0 0 24 24"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span data-en="">Send message</span>
                  <span data-es="">Enviar mensaje</span>
                </button>
                <p
                  className={`form-status ${contactStatus?.kind === "error" ? "form-status-error" : "form-status-ok"}`}
                  role={contactStatus?.kind === "error" ? "alert" : "status"}
                  aria-live="polite"
                  style={contactStatus ? undefined : { display: "none" }}
                >
                  {contactStatus?.msg}
                </p>
                <p className="form-privacy-note">
                  <span data-en="">
                    By submitting you accept our{" "}
                    <a href="/privacidad">privacy policy</a>.
                  </span>
                  <span data-es="">
                    Al enviar aceptas nuestra{" "}
                    <a href="/privacidad">política de privacidad</a>.
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

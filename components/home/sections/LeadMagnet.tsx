export default function LeadMagnet({ leadEmail, setLeadEmail, leadConsent, setLeadConsent, leadDone, leadError, handleLeadSubmit }: { leadEmail: string; setLeadEmail: (v: string) => void; leadConsent: boolean; setLeadConsent: (v: boolean) => void; leadDone: boolean; leadError: string; handleLeadSubmit: () => void }) {
  return (
    <>
      {/* ══════════ LEAD MAGNET ═════════════════════════════════ */}
      <section id="lead-magnet">
        <div className="section">
          <div className="lead-magnet-card reveal">
            <div>
              <div className="lead-magnet-pre">
                <span data-en="">Free Resource</span>
                <span data-es="">Recurso Gratuito</span>
              </div>
              <h2 className="lead-magnet-title">
                <span data-en="">
                  The Product Catalog &amp; Spec Sheet Prep Checklist
                </span>
                <span data-es="">
                  El Checklist de Preparación de Catálogos y Fichas Técnicas
                </span>
              </h2>
              <p className="lead-magnet-desc">
                <span data-en="">
                  The exact checklist I run before any product catalog or spec
                  sheet goes to print or platform. Covers spec completeness,
                  image requirements, table consistency, and brand alignment.
                </span>
                <span data-es="">
                  El checklist exacto que corro antes de que cualquier catálogo o
                  ficha técnica vaya a impresión o plataforma. Cubre completitud
                  de specs, requerimientos de imagen, consistencia de tablas y
                  alineación de marca.
                </span>
              </p>
              <div className="lead-magnet-items">
                <div className="lead-magnet-item">
                  <span data-en="">Actionable checks, nothing generic</span>
                  <span data-es="">Verificaciones accionables, nada genérico</span>
                </div>
                <div className="lead-magnet-item">
                  <span data-en="">
                    Works for catalogs, spec sheets &amp; submittals
                  </span>
                  <span data-es="">
                    Sirve para catálogos, fichas técnicas y submittals
                  </span>
                </div>
                <div className="lead-magnet-item">
                  <span data-en="">Print + digital ready criteria</span>
                  <span data-es="">Criterios listos para impresión y digital</span>
                </div>
              </div>
            </div>

            <div>
              <div className="lead-checklist-visual reveal" style={{ marginBottom: 24 }}>
                <div className="lead-cv-title">
                  <span data-en="">Preview</span>
                  <span data-es="">Vista previa</span>
                </div>
                <div className="lead-cv-item">
                  <span className="lead-cv-num">01</span>
                  <span className="lead-cv-text">
                    <span data-en="">
                      Product naming follows one consistent convention (brand +
                      series + key spec)
                    </span>
                    <span data-es="">
                      El nombre de producto sigue una convención consistente
                      (marca + serie + spec clave)
                    </span>
                  </span>
                </div>
                <div className="lead-cv-item">
                  <span className="lead-cv-num">05</span>
                  <span className="lead-cv-text">
                    <span data-en="">
                      Every spec field has a source and a unit — no blanks, no
                      guesses
                    </span>
                    <span data-es="">
                      Cada campo de spec tiene fuente y unidad — sin vacíos, sin
                      suposiciones
                    </span>
                  </span>
                </div>
                <div className="lead-cv-item">
                  <span className="lead-cv-num">12</span>
                  <span className="lead-cv-text">
                    <span data-en="">
                      Images meet resolution + crop rules and are named to match
                      SKUs
                    </span>
                    <span data-es="">
                      Las imágenes cumplen reglas de resolución + recorte y se
                      nombran según SKU
                    </span>
                  </span>
                </div>
                <div className="lead-cv-item" style={{ opacity: 0.4 }}>
                  <span className="lead-cv-num">…</span>
                  <span className="lead-cv-text">
                    <span data-en="">More checks in the full document</span>
                    <span data-es="">
                      Más verificaciones en el documento completo
                    </span>
                  </span>
                </div>
              </div>

              {leadDone ? (
                <div className="lead-done" role="status">
                  <div className="lead-done-icon">✓</div>
                  <p className="lead-done-title">
                    <span data-en="">You&apos;re in — here&apos;s your checklist:</span>
                    <span data-es="">¡Listo! Aquí está tu checklist:</span>
                  </p>
                  <a href="/checklist" className="lead-form-submit" target="_blank" rel="noopener">
                    <span data-en="">Open the checklist</span>
                    <span data-es="">Abrir el checklist</span>
                  </a>
                  <p className="lead-form-note">
                    <span data-en="">We&apos;ll also email you a copy.</span>
                    <span data-es="">También te enviamos una copia por email.</span>
                  </p>
                </div>
              ) : (
                <div className="lead-form">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                  />
                  <label className="lead-consent">
                    <input
                      type="checkbox"
                      checked={leadConsent}
                      onChange={(e) => setLeadConsent(e.target.checked)}
                    />
                    <span>
                      <span data-en="">
                        I agree to receive the checklist by email and accept the{" "}
                        <a href="/privacidad">privacy policy</a>.
                      </span>
                      <span data-es="">
                        Acepto recibir el checklist por email y la{" "}
                        <a href="/privacidad">política de privacidad</a>.
                      </span>
                    </span>
                  </label>
                  <button className="lead-form-submit" onClick={handleLeadSubmit}>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span data-en="">Get the checklist</span>
                    <span data-es="">Quiero el checklist</span>
                  </button>
                  <p className="lead-form-note">
                    <span data-en="">No spam. Instant access + a copy by email.</span>
                    <span data-es="">Sin spam. Acceso instantáneo + copia por email.</span>
                  </p>
                  {leadError && (
                    <p className="form-status form-status-error" role="alert">
                      {leadError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <hr className="divider-line" />

    </>
  );
}

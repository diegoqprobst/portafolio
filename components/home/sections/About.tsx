import type { HomeMetric } from "@/lib/home-content";

export default function About({ metrics, aboutParasEn, aboutParasEs }: { metrics: HomeMetric[]; aboutParasEn: string[]; aboutParasEs: string[] }) {
  return (
    <>
      {/* ══════════ ABOUT ═══════════════════════════════════════ */}
      <section id="about">
        <div className="section">
          <div className="section-header reveal">
            <div className="section-label">
              <span data-en="">The studio</span>
              <span data-es="">El estudio</span>
            </div>
            <h2 className="section-title">
              <span data-en="">Order in the chaos of product data</span>
              <span data-es="">Orden en el caos de los datos de producto</span>
            </h2>
            <p className="section-sub">
              <span data-en="">
                Lumen Studio is Diego Quinde. I build the systems behind
                perfectly consistent documentation — it started in lighting (IES
                photometrics, NFPA 70, driver specs) and now serves product
                brands across industries.
              </span>
              <span data-es="">
                Lumen Studio es Diego Quinde. Construyo los sistemas detrás de una
                documentación perfectamente consistente — empezó en iluminación
                (fotometría IES, NFPA 70, specs de drivers) y hoy sirve a marcas
                de producto de cualquier industria.
              </span>
            </p>
          </div>

          <div className="about-grid">
            <div>
              <div className="about-body reveal">
                <div data-en="">
                  {aboutParasEn.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div data-es="">
                  {aboutParasEs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="about-highlights">
                {[
                  {
                    icon: "📋",
                    en: "Standards-ready output",
                    es: "Salida lista para estándares",
                    descEn:
                      "Catalogs and spec sheets that hold up to NFPA / IES and your own brand guidelines — no back-and-forth.",
                    descEs:
                      "Catálogos y fichas que cumplen NFPA / IES y tus propias guías de marca — sin ida y vuelta.",
                    delay: undefined,
                  },
                  {
                    icon: "⚡",
                    en: "End-to-end Automation",
                    es: "Automatización de punta a punta",
                    descEn:
                      "From raw supplier PDFs to branded, structured product docs — the volume manual work can't match.",
                    descEs:
                      "De PDFs crudos de proveedor a documentos de producto estructurados y con branding — el volumen que el trabajo manual no iguala.",
                    delay: "80ms",
                  },
                  {
                    icon: "🎯",
                    en: "I follow your brief, exactly",
                    es: "Sigo tu brief al pie de la letra",
                    descEn:
                      "Reliability and consistency first — same design, fixed and aligned, no surprise redesigns.",
                    descEs:
                      "Confiabilidad y consistencia primero — mismo diseño, corregido y alineado, sin rediseños sorpresa.",
                    delay: "160ms",
                  },
                ].map((item) => (
                  <div
                    key={item.en}
                    className="about-item reveal"
                    style={
                      item.delay ? { transitionDelay: item.delay } : undefined
                    }
                  >
                    <div className="about-item-icon">{item.icon}</div>
                    <div className="about-item-text">
                      <strong>
                        <span data-en="">{item.en}</span>
                        <span data-es="">{item.es}</span>
                      </strong>
                      <span>
                        <span data-en="">{item.descEn}</span>
                        <span data-es="">{item.descEs}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="stack-chips reveal" style={{ marginTop: 28 }}>
                {[
                  "Adobe InDesign",
                  "Data Merge",
                  "GREP Styles",
                  "Python",
                  "Claude Code",
                  "n8n",
                  "NFPA 70 / IES",
                  "Excel / Sheets",
                ].map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="about-metrics">
              <div className="metric-big reveal">
                <div className="val">−75%</div>
                <div className="lbl">
                  <span data-en="">Manual work reduction</span>
                  <span data-es="">Reducción de trabajo manual</span>
                </div>
                <div className="sub">
                  <span data-en="">
                    Average across automation projects. Luxarmonie: 40h/month →
                    10h.
                  </span>
                  <span data-es="">
                    Promedio en proyectos de automatización. Luxarmonie: 40h/mes
                    → 10h.
                  </span>
                </div>
              </div>

              <div className="metric-grid">
                {metrics.map((m, i) => (
                  <div
                    key={m.value + m.label_en + i}
                    className="metric-sm reveal"
                    style={{ transitionDelay: `${60 + i * 60}ms` }}
                  >
                    <div className="val">{m.value}</div>
                    <div className="lbl">
                      <span data-en="">{m.label_en}</span>
                      <span data-es="">{m.label_es}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider-line" />

    </>
  );
}

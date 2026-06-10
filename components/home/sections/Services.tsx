import type { HomeService } from "@/lib/home-content";

export default function Services({ services }: { services: HomeService[] }) {
  return (
    <>
      {/* ══════════ SERVICES ════════════════════════════════════ */}
      <section id="services">
        <div className="section">
          <div className="section-header reveal">
            <div className="section-label">
              <span data-en="">Services</span>
              <span data-es="">Servicios</span>
            </div>
            <h2 className="section-title">
              <span data-en="">What I build for you</span>
              <span data-es="">Lo que construyo para ti</span>
            </h2>
            <p className="section-sub">
              <span data-en="">
                Concrete deliverables. No vague &quot;strategy&quot; — systems
                that run.
              </span>
              <span data-es="">
                Entregables concretos. Sin &quot;estrategia&quot; vaga —
                sistemas que funcionan.
              </span>
            </p>
          </div>

          <div className="services-grid">
            {services.map((s, i) => (
              <div
                key={s.title_en + i}
                className="service-card reveal"
                style={i > 0 ? { transitionDelay: `${i * 80}ms` } : undefined}
              >
                {(s.badge_en || s.badge_es) && (
                  <span className="service-badge">
                    <span data-en="">{s.badge_en}</span>
                    <span data-es="">{s.badge_es}</span>
                  </span>
                )}
                <div className="service-icon">{s.icon}</div>
                <div className="service-title">
                  <span data-en="">{s.title_en}</span>
                  <span data-es="">{s.title_es}</span>
                </div>
                <p className="service-desc">
                  <span data-en="">{s.desc_en}</span>
                  <span data-es="">{s.desc_es}</span>
                </p>
                <ul className="service-deliverables">
                  {s.deliverables.map((d, j) => (
                    <li key={j}>
                      <span data-en="">{d.en}</span>
                      <span data-es="">{d.es}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider-line" />

    </>
  );
}

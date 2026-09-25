export default function Testimonials() {
  return (
    <>
      {/* ══════════ TESTIMONIALS ════════════════════════════════ */}
      <section id="testimonials">
        <div className="section">
          <div className="section-header reveal">
            <div className="section-label">
              <span data-en="">Social Proof</span>
              <span data-es="">Prueba Social</span>
            </div>
            <h2 className="section-title">
              <span data-en="">What clients say</span>
              <span data-es="">Qué dicen los clientes</span>
            </h2>
          </div>
          <div className="testimonials-grid">
            {[
              {
                quoteEn:
                  "Diego transformed our product documentation process. What used to take our team 40 hours a month now runs automatically. The accuracy is remarkable — no more manual errors in technical specs.",
                quoteEs:
                  "Diego transformó nuestro proceso de documentación de productos. Lo que le tomaba a nuestro equipo 40 horas al mes ahora corre automáticamente. La precisión es notable — sin más errores manuales en especificaciones técnicas.",
                initials: "LC",
                name: "Laurent C.",
                role: "CEO · Luxarmonie, France",
                delay: undefined,
              },
              {
                quoteEn:
                  "The proposal Diego built for our Saratoga bid was on another level — technically solid, professionally presented, and actually compliant with local standards. It gave us a real edge.",
                quoteEs:
                  "La propuesta que Diego construyó para nuestra licitación en Saratoga estaba en otro nivel — técnicamente sólida, presentada profesionalmente y realmente conforme a los estándares locales. Nos dio una ventaja real.",
                initials: "CL",
                name: (
                  <>
                    <span data-en="">Client</span>
                    <span data-es="">Cliente</span>
                  </>
                ),
                roleEn: "Public lighting project · name withheld",
                roleEs: "Proyecto de iluminación pública · nombre reservado",
                delay: "80ms",
              },
              {
                quoteEn:
                  "He doesn't just deliver documents — he builds the system that generates them. The catalog was great, but what impressed us most was the automation underneath. We can now update 200 products in minutes.",
                quoteEs:
                  "No solo entrega documentos — construye el sistema que los genera. El catálogo fue genial, pero lo que más nos impresionó fue la automatización debajo. Ahora podemos actualizar 200 productos en minutos.",
                initials: "AP",
                name: "Andrés P.",
                roleEn: "Operations Director · Revem, Ecuador",
                roleEs: "Director de Operaciones · Revem, Ecuador",
                delay: "160ms",
              },
            ].map((t) => (
              <div
                key={t.initials}
                className="testimonial-card reveal"
                style={t.delay ? { transitionDelay: t.delay } : undefined}
              >
                <p className="testimonial-quote">
                  <span data-en="">{t.quoteEn}</span>
                  <span data-es="">{t.quoteEs}</span>
                </p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">
                      {t.role ? (
                        t.role
                      ) : (
                        <>
                          <span data-en="">{t.roleEn}</span>
                          <span data-es="">{t.roleEs}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="testimonials-note reveal">
            <span data-en="">
              * Some client identities are withheld for privacy.
            </span>
            <span data-es="">
              * Algunas identidades de clientes se omiten por privacidad.
            </span>
          </p>
        </div>
      </section>

      <hr className="divider-line" />

    </>
  );
}

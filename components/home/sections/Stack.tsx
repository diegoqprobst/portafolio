export default function Stack() {
  return (
    <>
      {/* ══════════ STACK ════════════════════════════════════════ */}
      <section id="stack">
        <div className="section">
          <div className="section-header reveal">
            <div className="section-label">Stack</div>
            <h2 className="section-title">
              <span data-en="">Tools &amp; technologies</span>
              <span data-es="">Herramientas y tecnologías</span>
            </h2>
          </div>
          <div className="stack-grid">
            {[
              { icon: "🤖", name: "Claude Code", en: "AI-driven automation", es: "Automatización con IA", d: undefined },
              { icon: "🔄", name: "n8n", en: "Workflow orchestration", es: "Orquestación de flujos", d: "40ms" },
              { icon: "🛸", name: "Antigravity", en: "Data pipelines", es: "Pipelines de datos", d: "80ms" },
              { icon: "🐍", name: "Python", en: "Data processing", es: "Procesamiento de datos", d: "120ms" },
              { icon: "📐", name: "Adobe InDesign", en: "Catalog automation", es: "Automatización de catálogos", d: "160ms" },
              { icon: "🎨", name: "Adobe Illustrator", en: "Technical submittals", es: "Submittals técnicos", d: "200ms" },
              { icon: "📊", name: "Excel / Sheets", en: "Compliance matrices", es: "Matrices de cumplimiento", d: "240ms" },
              { icon: "📋", name: "NFPA 70 / IES", en: "Standards mastery", es: "Dominio de estándares", d: "280ms" },
            ].map((s) => (
              <div
                key={s.name}
                className="stack-item reveal"
                style={s.d ? { transitionDelay: s.d } : undefined}
              >
                <div className="stack-item-icon">{s.icon}</div>
                <div className="stack-item-name">{s.name}</div>
                <div className="stack-item-role">
                  <span data-en="">{s.en}</span>
                  <span data-es="">{s.es}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider-line" />

    </>
  );
}

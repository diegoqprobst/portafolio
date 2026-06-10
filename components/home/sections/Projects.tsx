import ProjectRow from "@/components/home/ProjectRow";

export default function Projects({ openProject, toggleProject }: { openProject: string | null; toggleProject: (id: string) => void }) {
  return (
    <>
      {/* ══════════ PROJECTS ════════════════════════════════════ */}
      <section id="projects">
        <div className="section">
          <div className="section-header reveal">
            <div className="section-label">
              <span data-en="">Work</span>
              <span data-es="">Proyectos</span>
            </div>
            <h2 className="section-title">
              <span data-en="">Projects with measurable results</span>
              <span data-es="">Proyectos con resultados medibles</span>
            </h2>
            <p className="section-sub">
              <span data-en="">
                Each engagement is a complete system — not a script, a solution.
              </span>
              <span data-es="">
                Cada proyecto es un sistema completo — no un script, una
                solución.
              </span>
            </p>
          </div>

          <div className="projects-list">
            <ProjectRow
              id="p1"
              num="01"
              title="Luxarmonie Product Intelligence"
              tags={["Python", "Claude API", "E-commerce", "France"]}
              metricVal="−75%"
              metricLbl={{ en: "Manual load", es: "Carga manual" }}
              isOpen={openProject === "p1"}
              onToggle={() => toggleProject("p1")}
              delay={undefined}
              descEn="French e-commerce with Chinese supplier catalogs in inconsistent formats. Manual spec extraction was 40 hours/month, error-prone, and impossible to scale. Built an intelligent extraction pipeline that reads supplier PDFs, normalises specs, and generates e-commerce-ready product descriptions automatically."
              descEs="E-commerce francés con catálogos de proveedores chinos en formatos inconsistentes. La extracción manual de specs era 40 horas/mes, propensa a errores e imposible de escalar. Construí un pipeline de extracción inteligente que lee PDFs de proveedor, normaliza specs y genera descripciones de producto listas para e-commerce automáticamente."
              resultsEn={[
                "Manual load: 40h/month → 10h/month (−75%)",
                "Data integrity: 99.2%",
                "E-commerce descriptions generated automatically",
              ]}
              resultsEs={[
                "Carga manual: 40h/mes → 10h/mes (−75%)",
                "Integridad de datos: 99.2%",
                "Descripciones e-commerce generadas automáticamente",
              ]}
              imgSrc="/assets/projects/1.jpg"
              imgAlt="Luxarmonie dashboard"
              caseStudyHref="/luxarmonie"
            />

            <ProjectRow
              id="p2"
              num="02"
              title="CRE Reporting Automation"
              tags={["Python", "Adobe InDesign", "Data-to-Design"]}
              metricVal="−95%"
              metricLbl={{ en: "Time per report", es: "Tiempo por reporte" }}
              isOpen={openProject === "p2"}
              onToggle={() => toggleProject("p2")}
              delay="60ms"
              descEn="Real estate firm producing 200+ financial PDF reports manually — 30–40 min each, high error rate, inconsistent branding. Built a 'Data-to-Design' pipeline using Python + Adobe InDesign scripting: raw spreadsheet data in, branded PDF out. The same architecture now powers automated lighting catalogs."
              descEs="Firma de real estate producía 200+ reportes financieros PDF manualmente — 30–40 min cada uno, alta tasa de errores, branding inconsistente. Construí un pipeline 'Data-to-Design' con Python + scripting de Adobe InDesign: datos de hoja de cálculo dentro, PDF con branding afuera. La misma arquitectura ahora impulsa catálogos de iluminación automatizados."
              resultsEn={[
                "40 min → 2 min per report (−95%)",
                "Zero typos across all 200+ documents",
                "Consistent branding across every output",
              ]}
              resultsEs={[
                "40 min → 2 min por reporte (−95%)",
                "Cero errores tipográficos en los 200+ documentos",
                "Branding consistente en todos los outputs",
              ]}
              imgSrc="/assets/projects/2.jpg"
              imgAlt="CRE report"
            />

            <ProjectRow
              id="p3"
              num="03"
              title="Saratoga Public Lighting Proposal"
              tags={["Claude Code", "Adobe Illustrator", "NFPA / IES", "Utah, USA"]}
              metricVal="100%"
              metricLbl={{ en: "Municipal compliant", es: "Cumplimiento municipal" }}
              isOpen={openProject === "p3"}
              onToggle={() => toggleProject("p3")}
              delay="120ms"
              descEn="A lighting contractor bidding on public parks illumination in Saratoga Springs, Utah — no regulatory analysis, no compliance argument, no chance of winning. Researched Saratoga's municipal ordinances and IES/NFPA standards, built a compliance matrix, then redesigned the entire submittal in Adobe Illustrator as a professional tender document."
              descEs="Un contratista de iluminación licitando alumbrado de parques públicos en Saratoga Springs, Utah — sin análisis normativo, sin argumento de cumplimiento, sin chances de ganar. Investigué las ordenanzas municipales de Saratoga y estándares IES/NFPA, construí una matriz de cumplimiento y rediseñé todo el submittal en Adobe Illustrator como documento de licitación profesional."
              resultsEn={[
                "100% compliant with Saratoga Springs municipal standards",
                "Data-backed submittal that reads professional to the committee",
                "Client entered the bid with a real technical edge",
              ]}
              resultsEs={[
                "100% conforme con estándares municipales de Saratoga Springs",
                "Submittal respaldado por datos que se ve profesional ante el comité",
                "Cliente entró a la licitación con ventaja técnica real",
              ]}
              imgSrc="/assets/projects/submittal-sample.png"
              imgAlt="Saratoga proposal"
              caseStudyHref="/saratoga"
            />

            <ProjectRow
              id="p4"
              num="04"
              title="LED Driver Technical Documentation"
              tags={["Data Analysis", "NFPA / NEC", "US Market"]}
              metricVal="US"
              metricLbl={{ en: "Market unlocked", es: "Mercado desbloqueado" }}
              isOpen={openProject === "p4"}
              onToggle={() => toggleProject("p4")}
              delay="180ms"
              descEn="Lighting manufacturer with raw laboratory data — not distribution-ready for the US market. Without NFPA/NEC-compliant documentation, products couldn't be sold to American distributors. Interpreted lab reports and transformed them into a structured technical catalog aligned with US standards."
              descEs="Fabricante de iluminación con datos de laboratorio crudos — no aptos para distribución en el mercado americano. Sin documentación conforme a NFPA/NEC, los productos no podían venderse a distribuidores americanos. Interpreté reportes de laboratorio y los transformé en un catálogo técnico estructurado alineado con estándares de EE.UU."
              resultsEn={[
                "100% NFPA/NEC-compliant catalog for US distributors",
                "Lab data converted into commercial value",
                "Product ready for US market entry",
              ]}
              resultsEs={[
                "Catálogo 100% conforme NFPA/NEC para distribuidores USA",
                "Datos de laboratorio convertidos en valor comercial",
                "Producto listo para entrada al mercado americano",
              ]}
              imgSrc="/assets/projects/4.jpg"
              imgAlt="LED documentation"
            />

            <ProjectRow
              id="p5"
              num="05"
              title="Revem — Full Design & Automation Ops"
              tags={["AI Imagery", "E-commerce", "InDesign", "Ecuador"]}
              metricVal="Sold"
              metricLbl={{ en: "Out on AI products", es: "Agotado con IA" }}
              isOpen={openProject === "p5"}
              onToggle={() => toggleProject("p5")}
              delay="240ms"
              descEn="Full design and automation operations for Revem: 200+ page product catalog, e-commerce store, and AI-generated product imagery placed in iconic Ecuador locations. Products with AI-treated imagery sold out. Untreated products had significantly lower impact — the data proved the ROI of visual investment."
              descEs="Operaciones completas de diseño y automatización para Revem: catálogo de producto de 200+ páginas, e-commerce y imágenes de producto generadas con IA en locaciones icónicas de Ecuador. Los productos con imágenes tratadas con IA se agotaron. Los productos sin tratamiento tuvieron impacto significativamente menor — los datos probaron el ROI de la inversión visual."
              resultsEn={[
                "AI-treated products → sold out",
                "200+ page catalog + full e-commerce operational",
                "Visual ROI proven: treated vs untreated side-by-side",
              ]}
              resultsEs={[
                "Productos con imágenes IA → agotados",
                "Catálogo de 200+ páginas + e-commerce completo operativo",
                "ROI visual probado: tratados vs no tratados cara a cara",
              ]}
              imgSrc="/assets/projects/revem.jpg"
              imgAlt="Revem operations"
            />

            <ProjectRow
              id="p6"
              num="06"
              title="Wellness Commerce — Sales Deck"
              tags={["B2B Sales Deck", "PowerPoint", "Healthcare", "Financial Modeling"]}
              metricVal="$15.4M"
              metricLbl={{ en: "Revenue model", es: "Modelo de ingresos" }}
              isOpen={openProject === "p6"}
              onToggle={() => toggleProject("p6")}
              delay="300ms"
              descEn="A health system needed a full 14-slide pitch deck to sell CFOs and CMOs on a wellness commerce platform — patient journey, revenue cascade, sensitivity analysis, and partner acquisition story. Built in PowerPoint with live chart data linked to the financial model."
              descEs="Un sistema de salud necesitaba un deck de 14 slides para vender la plataforma de wellness commerce a CFOs y CMOs — patient journey, cascada de ingresos, análisis de sensibilidad e historia de adquisición de socios. Construido en PowerPoint con datos de gráficos vinculados al modelo financiero."
              resultsEn={[
                "14-slide deck with embedded financial charts",
                "Revenue cascade: 1M patients → $15.4M sales → $3.9M earnings at 25% margin",
                "Investor-ready with sensitivity grid and 5-year growth projection",
              ]}
              resultsEs={[
                "Deck de 14 slides con gráficos financieros integrados",
                "Cascada de ingresos: 1M pacientes → $15.4M ventas → $3.9M earnings al 25% de margen",
                "Listo para inversores con grilla de sensibilidad y proyección de crecimiento a 5 años",
              ]}
              imgSrc="/assets/projects/wellnova-deck-cover.png"
              imgAlt="Wellness commerce sales deck"
              docHref="/wellnova-sales-deck.pdf"
            />

            <ProjectRow
              id="p7"
              num="07"
              title="Wellness Commerce — Interactive Pro Forma"
              tags={["Financial Modeling", "HTML/CSS", "Healthcare", "Data Visualization"]}
              metricVal="26 pg"
              metricLbl={{ en: "Interactive model", es: "Modelo interactivo" }}
              isOpen={openProject === "p7"}
              onToggle={() => toggleProject("p7")}
              delay="360ms"
              descEn="Designed and coded a 26-page interactive financial pro forma for a health system wellness commerce platform — six-filter revenue cascade, per-page sensitivity analysis, and three SVG data visualizations, built in HTML/CSS and rendered to print-ready PDFs."
              descEs="Diseñé y codifiqué un pro forma financiero interactivo de 26 páginas para una plataforma de wellness commerce en sistemas de salud — cascada de ingresos de seis filtros, análisis de sensibilidad por página y tres visualizaciones SVG de datos, construido en HTML/CSS y renderizado a PDFs listos para imprimir."
              resultsEn={[
                "26-page document: 12-page wireframe + 14-page charts version",
                "Six-filter revenue model fully coherent end-to-end",
                "SVG charts re-coordinated to match model figures exactly",
              ]}
              resultsEs={[
                "26 páginas: wireframe de 12 páginas + versión de gráficos de 14 páginas",
                "Modelo de ingresos de seis filtros completamente coherente de punta a punta",
                "Gráficos SVG re-coordinados para coincidir exactamente con las cifras del modelo",
              ]}
              imgSrc="/assets/projects/wellnova-proforma-cover.png"
              imgAlt="Wellness commerce pro forma wireframe"
              docHref="/wellnova-proforma.pdf"
            />

            <ProjectRow
              id="p8"
              num="08"
              title="Healthcare IT — Agile Leadership Series"
              tags={["Editorial Design", "Healthcare IT", "Content Strategy", "HTML/CSS"]}
              metricVal="13 pg"
              metricLbl={{ en: "Leadership guide", es: "Guía de liderazgo" }}
              isOpen={openProject === "p8"}
              onToggle={() => toggleProject("p8")}
              delay="420ms"
              descEn="Reconstructed a 10-chapter leadership guide on Agile transformation in healthcare IT as a polished 13-page editorial publication — two health-system case studies with quantified outcomes, executive narrative, and an austere charcoal/white/ochre design system built from scratch in HTML/CSS."
              descEs="Reconstruí una guía de liderazgo de 10 capítulos sobre transformación Agile en TI de salud como una publicación editorial de 13 páginas — dos casos de estudio de sistemas de salud con resultados cuantificados, narrativa ejecutiva y un sistema de diseño austero carbón/blanco/ocre construido desde cero en HTML/CSS."
              resultsEn={[
                "13-page editorial publication built from raw source content",
                "Two enterprise case studies with quantified turnaround outcomes",
                "Design system aligned to executive brand aesthetic (charcoal + ochre)",
              ]}
              resultsEs={[
                "Publicación editorial de 13 páginas construida desde contenido fuente crudo",
                "Dos casos de estudio empresariales con resultados de transformación cuantificados",
                "Sistema de diseño alineado a estética de marca ejecutiva (carbón + ocre)",
              ]}
              imgSrc="/assets/projects/agile-cover.png"
              imgAlt="Healthcare IT agile leadership guide"
              docHref="/agile-transformation.pdf"
            />
          </div>
        </div>
      </section>

      <hr className="divider-line" />

    </>
  );
}

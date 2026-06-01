"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { HomeContent } from "@/lib/home-content";
import { DEFAULT_METRICS, DEFAULT_SERVICES, DEFAULT_ABOUT } from "@/lib/home-defaults";

export default function HomeClient({ content }: { content?: HomeContent | null }) {
  // Cada campo cae a su default si la DB no tiene contenido → la home se ve
  // idéntica a antes hasta que se edite desde /admin/home.
  const metrics =
    content?.metrics && content.metrics.length > 0 ? content.metrics : DEFAULT_METRICS;
  const services =
    content?.services && content.services.length > 0 ? content.services : DEFAULT_SERVICES;
  const about = content?.about ?? DEFAULT_ABOUT;
  const aboutParasEn = about.body_en.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  const aboutParasEs = about.body_es.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);

  const [lang, setLangState] = useState<"en" | "es">("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [leadEmail, setLeadEmail] = useState("");

  useEffect(() => {
    const saved = (localStorage.getItem("lang") as "en" | "es") || "en";
    setLangState(saved);
  }, []);

  useEffect(() => {
    document.body.className = `lang-${lang}`;
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function toggleProject(id: string) {
    setOpenProject((prev) => (prev === id ? null : id));
  }

  function handleLeadSubmit() {
    if (!leadEmail || !leadEmail.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
    alert(
      "Thanks! Check your inbox shortly. (In production this connects to your email system.)"
    );
    setLeadEmail("");
  }

  function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Message sent! I'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      {/* ── Sticky WhatsApp ─────────────────────────────────── */}
      <a
        href="https://wa.me/593987041418?text=Hi%20Diego%2C%20I%27d%20like%20to%20talk%20about%20a%20project"
        className="whatsapp-btn"
        aria-label="Contact via WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="#hero" className="nav-logo">
            D<span>Q</span>
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
            <a
              href="https://wa.me/593987041418"
              className="nav-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
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

      {/* ══════════ HERO ════════════════════════════════════════ */}
      <section id="hero" className="hero">
        <div className="hero-glow">
          <div className="hero-glow-a" />
          <div className="hero-glow-b" />
        </div>
        <div className="hero-inner">
          <div>
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              <span data-en="">Available for new projects</span>
              <span data-es="">Disponible para nuevos proyectos</span>
            </div>

            <h1 className="hero-h1">
              <span data-en="">
                I turn your product data into <em>US-ready</em> catalogs that
                sell.
              </span>
              <span data-es="">
                Convierto tus datos de producto en catálogos{" "}
                <em>listos para EE.UU.</em> que venden.
              </span>
            </h1>

            <p className="hero-sub">
              <span data-en="">
                Lighting and electrical manufacturers spend months translating
                raw specs, lab reports, and supplier PDFs into
                distribution-ready documentation.{" "}
                <strong>I automate that entire pipeline</strong> — NFPA-compliant
                data sheets, e-commerce product data, and branded catalogs,
                delivered fast.
              </span>
              <span data-es="">
                Los fabricantes de iluminación y eléctricos pierden meses
                convirtiendo specs crudos, reportes de laboratorio y PDFs de
                proveedores en documentación lista para distribución.{" "}
                <strong>Automatizo ese pipeline completo</strong> — fichas
                técnicas NFPA, datos de producto para e-commerce y catálogos
                con branding, entregados rápido.
              </span>
            </p>

            <div className="hero-actions">
              <a
                href="https://wa.me/593987041418?text=Hi%20Diego"
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
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
                  <span data-en="">Docs automated</span>
                  <span data-es="">Docs automatizados</span>
                </div>
              </div>
              <div>
                <div className="hero-stat-val">4 yrs</div>
                <div className="hero-stat-lbl">
                  <span data-en="">Lighting industry</span>
                  <span data-es="">Industria de iluminación</span>
                </div>
              </div>
            </div>
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
                <span>Product Data · Automation · Lighting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider-line" />

      {/* ══════════ ABOUT ═══════════════════════════════════════ */}
      <section id="about">
        <div className="section">
          <div className="section-header reveal">
            <div className="section-label">
              <span data-en="">About</span>
              <span data-es="">Sobre mí</span>
            </div>
            <h2 className="section-title">
              <span data-en="">Built for the lighting industry</span>
              <span data-es="">
                Construido para la industria de la iluminación
              </span>
            </h2>
            <p className="section-sub">
              <span data-en="">
                I&apos;m not a generalist. I understand IES photometrics, NFPA
                70, driver specs, and how US distributors evaluate products.
              </span>
              <span data-es="">
                No soy generalista. Entiendo fotometría IES, NFPA 70, specs de
                drivers y cómo evalúan los productos los distribuidores
                americanos.
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
                    en: "NFPA / NEC Compliance",
                    es: "Cumplimiento NFPA / NEC",
                    descEn:
                      "Data sheets and catalogs that US distributors and inspectors can approve without back-and-forth.",
                    descEs:
                      "Fichas técnicas y catálogos que distribuidores e inspectores americanos aprueban sin ida y vuelta.",
                    delay: undefined,
                  },
                  {
                    icon: "⚡",
                    en: "End-to-end Automation",
                    es: "Automatización de punta a punta",
                    descEn:
                      "From raw supplier PDFs to branded, structured product data — no manual reformatting.",
                    descEs:
                      "De PDFs crudos de proveedor a datos de producto estructurados y con branding — sin reformateo manual.",
                    delay: "80ms",
                  },
                  {
                    icon: "🛒",
                    en: "E-commerce Ready",
                    es: "Listo para e-commerce",
                    descEn:
                      "Product data mapped to platform schemas — SEO descriptions, attributes, specs — ready to import.",
                    descEs:
                      "Datos de producto mapeados a esquemas de plataforma — descripciones SEO, atributos, specs — listos para importar.",
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
                  "Claude Code",
                  "n8n",
                  "Antigravity",
                  "Python",
                  "Adobe InDesign",
                  "Excel / Sheets",
                  "NFPA 70",
                  "IES Standards",
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
                initials: "MR",
                name: "Mike R.",
                roleEn: "Project Manager · Lighting Contractor, Utah",
                roleEs: "Gerente de Proyecto · Contratista de Iluminación, Utah",
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
              * Names and details lightly anonymised at client request. Happy to
              provide references on inquiry.
            </span>
            <span data-es="">
              * Nombres y detalles ligeramente anonimizados a solicitud de
              clientes. Con gusto proveo referencias bajo consulta.
            </span>
          </p>
        </div>
      </section>

      <hr className="divider-line" />

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
                  The Lighting E-commerce Product Data Checklist
                </span>
                <span data-es="">
                  El Checklist de Datos de Producto para E-commerce de
                  Iluminación
                </span>
              </h2>
              <p className="lead-magnet-desc">
                <span data-en="">
                  The exact 23-point checklist I use before any lighting product
                  goes live on a US e-commerce platform. Covers spec
                  completeness, image requirements, compliance flags, and SEO
                  basics.
                </span>
                <span data-es="">
                  El checklist exacto de 23 puntos que uso antes de que
                  cualquier producto de iluminación entre en vivo en una
                  plataforma de e-commerce americana. Cubre completitud de
                  specs, requerimientos de imagen, banderas de cumplimiento y
                  conceptos básicos de SEO.
                </span>
              </p>
              <div className="lead-magnet-items">
                <div className="lead-magnet-item">
                  <span data-en="">23 actionable checks, nothing generic</span>
                  <span data-es="">23 verificaciones accionables, nada genérico</span>
                </div>
                <div className="lead-magnet-item">
                  <span data-en="">US distributor approval criteria included</span>
                  <span data-es="">
                    Criterios de aprobación de distribuidores americanos incluidos
                  </span>
                </div>
                <div className="lead-magnet-item">
                  <span data-en="">
                    Works with Shopify, Amazon, WooCommerce
                  </span>
                  <span data-es="">
                    Funciona con Shopify, Amazon, WooCommerce
                  </span>
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
                      Product name follows distributor naming convention (brand
                      + series + wattage + CCT)
                    </span>
                    <span data-es="">
                      Nombre de producto sigue convención de distribuidores
                      (marca + serie + wattaje + CCT)
                    </span>
                  </span>
                </div>
                <div className="lead-cv-item">
                  <span className="lead-cv-num">05</span>
                  <span className="lead-cv-text">
                    <span data-en="">
                      CRI value declared and ≥80 for US residential / ≥90 for
                      commercial specifications
                    </span>
                    <span data-es="">
                      Valor CRI declarado y ≥80 para residencial / ≥90 para
                      especificaciones comerciales USA
                    </span>
                  </span>
                </div>
                <div className="lead-cv-item">
                  <span className="lead-cv-num">12</span>
                  <span className="lead-cv-text">
                    <span data-en="">
                      IP/IK rating certified and referenced to IEC 60529
                      standard in product listing
                    </span>
                    <span data-es="">
                      Certificación IP/IK declarada y referenciada a IEC 60529
                      en el listado del producto
                    </span>
                  </span>
                </div>
                <div className="lead-cv-item" style={{ opacity: 0.4 }}>
                  <span className="lead-cv-num">…</span>
                  <span className="lead-cv-text">
                    <span data-en="">20 more checks in the full document</span>
                    <span data-es="">
                      20 verificaciones más en el documento completo
                    </span>
                  </span>
                </div>
              </div>

              <div className="lead-form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                />
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
                  <span data-en="">Send me the checklist</span>
                  <span data-es="">Envíame el checklist</span>
                </button>
                <p className="lead-form-note">
                  <span data-en="">
                    No spam. One email with the PDF. Unsubscribe anytime.
                  </span>
                  <span data-es="">
                    Sin spam. Un email con el PDF. Cancela cuando quieras.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider-line" />

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
                  I work with lighting and electrical manufacturers who are
                  serious about entering or scaling in the US market.{" "}
                  <strong>Tell me what you&apos;re building</strong> and I&apos;ll tell
                  you how I can help.
                </span>
                <span data-es="">
                  Trabajo con fabricantes de iluminación y eléctricos que son
                  serios sobre entrar o escalar en el mercado americano.{" "}
                  <strong>Cuéntame qué estás construyendo</strong> y te diré
                  cómo puedo ayudar.
                </span>
              </p>
              <div className="contact-options">
                <a
                  href="https://wa.me/593987041418"
                  className="contact-opt reveal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="contact-opt-icon">💬</div>
                  <div className="contact-opt-text">
                    <strong>WhatsApp</strong>
                    <span>
                      +593 987 041 418 ·{" "}
                      <span data-en="">Fastest response</span>
                      <span data-es="">Respuesta más rápida</span>
                    </span>
                  </div>
                </a>
                <a
                  href="mailto:diegoaquinde@gmail.com"
                  className="contact-opt reveal"
                  style={{ transitionDelay: "60ms" }}
                >
                  <div className="contact-opt-icon">✉️</div>
                  <div className="contact-opt-text">
                    <strong>Email</strong>
                    <span>diegoaquinde@gmail.com</span>
                  </div>
                </a>
                <a
                  href="/Diego_Quinde_Resume.pdf"
                  className="contact-opt reveal"
                  style={{ transitionDelay: "120ms" }}
                  download
                >
                  <div className="contact-opt-icon">📄</div>
                  <div className="contact-opt-text">
                    <strong>
                      <span data-en="">Download CV</span>
                      <span data-es="">Descargar CV</span>
                    </strong>
                    <span>
                      <span data-en="">PDF · Updated 2026</span>
                      <span data-es="">PDF · Actualizado 2026</span>
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
                <div className="form-row">
                  <input type="text" placeholder="Name" required />
                  <input type="text" placeholder="Company" />
                </div>
                <input type="email" placeholder="Email" required />
                <select defaultValue="">
                  <option value="" disabled>
                    Project type…
                  </option>
                  <option value="pipeline">Product Data Pipeline</option>
                  <option value="nfpa">NFPA Documentation</option>
                  <option value="automation">Workflow Automation</option>
                  <option value="bid">Technical Bid Proposal</option>
                  <option value="other">Other</option>
                </select>
                <textarea placeholder="Tell me about your project…" />
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
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ═══════════════════════════════════════ */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">
            D<span>Q</span>
          </div>
          <div className="footer-copy">© 2026 Diego Quinde · diegoquinde.com</div>
          <div className="footer-links">
            <a href="mailto:diegoaquinde@gmail.com">Email</a>
            <a
              href="https://wa.me/593987041418"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <a href="/saratoga">
              <span data-en="">Case Study</span>
              <span data-es="">Caso de Estudio</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ── ProjectRow sub-component ───────────────────────────────── */
function ProjectRow({
  id,
  num,
  title,
  tags,
  metricVal,
  metricLbl,
  isOpen,
  onToggle,
  delay,
  descEn,
  descEs,
  resultsEn,
  resultsEs,
  imgSrc,
  imgAlt,
  caseStudyHref,
  docHref,
}: {
  id: string;
  num: string;
  title: string;
  tags: string[];
  metricVal: string;
  metricLbl: { en: string; es: string };
  isOpen: boolean;
  onToggle: () => void;
  delay?: string;
  descEn: string;
  descEs: string;
  resultsEn: string[];
  resultsEs: string[];
  imgSrc: string;
  imgAlt: string;
  caseStudyHref?: string;
  docHref?: string;
}) {
  const [isIn, setIsIn] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el || isIn) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isIn]);

  return (
    <div
      ref={rowRef}
      className={`project-row reveal${isIn ? " in" : ""}${isOpen ? " open" : ""}`}
      id={`row-${id}`}
      style={delay ? { transitionDelay: delay } : undefined}
    >
      <div className="project-header" onClick={onToggle}>
        <div className="project-num">{num}</div>
        <div>
          <div className="project-title">{title}</div>
          <div className="project-tags">
            {tags.map((t) => (
              <span key={t} className="project-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="project-metric">
          <div className="val">{metricVal}</div>
          <div className="lbl">
            <span data-en="">{metricLbl.en}</span>
            <span data-es="">{metricLbl.es}</span>
          </div>
        </div>
        <div className="project-expand-btn">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="project-body" id={`body-${id}`}>
        <div className="project-body-inner">
          <div className="project-body-content">
            <div>
              <p className="project-desc">
                <span data-en="">{descEn}</span>
                <span data-es="">{descEs}</span>
              </p>
              <div className="project-results">
                {resultsEn.map((r, i) => (
                  <div key={i} className="project-result">
                    <span data-en="">{r}</span>
                    <span data-es="">{resultsEs[i]}</span>
                  </div>
                ))}
              </div>
              {caseStudyHref && (
                <a href={caseStudyHref} className="project-link">
                  <span data-en="">Read full case study</span>
                  <span data-es="">Leer caso de estudio completo</span>
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    viewBox="0 0 24 24"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              )}
              {docHref && (
                <a href={docHref} className="project-link" target="_blank" rel="noopener noreferrer">
                  <span data-en="">View full document</span>
                  <span data-es="">Ver documento completo</span>
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    viewBox="0 0 24 24"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              )}
            </div>
            <div className="project-img-wrap">
              <Image
                src={imgSrc}
                alt={imgAlt}
                width={320}
                height={220}
                style={{ width: "100%", height: 220, objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

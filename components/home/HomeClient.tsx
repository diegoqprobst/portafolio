"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { HomeContent } from "@/lib/home-content";
import { DEFAULT_METRICS, DEFAULT_SERVICES, DEFAULT_ABOUT } from "@/lib/home-defaults";
import StorySection from "@/components/home/StorySection";

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
  const [leadConsent, setLeadConsent] = useState(false);

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

  async function handleLeadSubmit() {
    if (!leadEmail || !leadEmail.includes("@")) {
      alert("Please enter a valid email. / Ingresa un email válido.");
      return;
    }
    if (!leadConsent) {
      alert(
        "Please check the consent box to continue. / Marca la casilla de consentimiento para continuar."
      );
      return;
    }
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, source: "lead-magnet" }),
      });
      if (!res.ok) throw new Error();
      alert("¡Gracias! Te escribo pronto con el checklist. / Thanks! I'll send it shortly.");
      setLeadEmail("");
      setLeadConsent(false);
    } catch {
      alert(
        "No se pudo enviar. Inténtalo de nuevo o escríbeme por email."
      );
    }
  }

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Honeypot: si 'website' viene relleno, es un bot.
    if (fd.get("website")) return;
    const payload = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      project_type: String(fd.get("project_type") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    if (!payload.name || !payload.email.includes("@")) {
      alert("Completa tu nombre y un email válido. / Add your name and a valid email.");
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      alert("¡Mensaje enviado! Te respondo en menos de 24h. / Message sent!");
      form.reset();
    } catch {
      alert(
        "No se pudo enviar. Inténtalo de nuevo o escríbeme por email."
      );
    }
  }

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

      {/* ══════════ HERO ════════════════════════════════════════ */}
      <section id="hero" className="hero">
        <div className="hero-glow">
          <div className="hero-glow-a" />
          <div className="hero-glow-b" />
        </div>
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <span className="lumen-mark" />
              Lumen Studio
              <span className="he-tag">
                <span data-en="">— Technical clarity for product brands</span>
                <span data-es="">— Claridad técnica para marcas de producto</span>
              </span>
            </div>

            <a
              href="https://www.upwork.com/freelancers/diegoaq?mp_source=share"
              className="hero-badge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="hero-badge-dot" />
              <span data-en="">Available on Upwork · Project Catalog</span>
              <span data-es="">Disponible en Upwork · Project Catalog</span>
              <span className="hb-arrow">↗</span>
            </a>

            <h1 className="hero-h1">
              <span data-en="">
                Technical product catalogs & spec sheets that stay{" "}
                <em>perfectly consistent.</em>
              </span>
              <span data-es="">
                Catálogos y fichas técnicas de producto,{" "}
                <em>perfectamente consistentes.</em>
              </span>
            </h1>

            <p className="hero-sub">
              <span data-en="">
                Lumen Studio turns raw specs, supplier PDFs, and half-finished
                layouts into print- and digital-ready catalogs, spec sheets, and
                submittals in <strong>Adobe InDesign</strong> — automated for
                speed and consistency, for lighting and industrial brands selling
                internationally.
              </span>
              <span data-es="">
                Lumen Studio convierte specs crudos, PDFs de proveedor y maquetas
                a medias en catálogos, fichas técnicas y submittals listos para
                impresión y digital en <strong>Adobe InDesign</strong> —
                automatizados para velocidad y consistencia, para marcas de
                iluminación e industriales que venden en mercados internacionales.
              </span>
            </p>

            <div className="hero-actions">
              <a href="#contact" className="btn-primary">
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
                  <span data-en="">Docs built</span>
                  <span data-es="">Docs producidos</span>
                </div>
              </div>
              <div>
                <div className="hero-stat-val">4+ yrs</div>
                <div className="hero-stat-lbl">
                  <span data-en="">In the industry</span>
                  <span data-es="">En la industria</span>
                </div>
              </div>
            </div>

            <a href="#story" className="hero-scroll-hint">
              <span data-en="">See how I work</span>
              <span data-es="">Cómo trabajo</span>
              <span className="hsh-arrow" aria-hidden="true">↓</span>
            </a>
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
                <span>
                  <span data-en="">Founder, Lumen Studio · InDesign &amp; Automation</span>
                  <span data-es="">Fundador, Lumen Studio · InDesign y Automatización</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider-line" />

      {/* ══════════ CLIENTS BAND ════════════════════════════════ */}
      <div className="clients-band">
        <div className="clients-inner reveal">
          <span className="clients-label">
            <span data-en="">Trusted by product brands</span>
            <span data-es="">Marcas de producto que confían</span>
          </span>
          <div className="clients-list">
            <div className="client-name">
              Luxarmonie<small>France</small>
            </div>
            <div className="client-name">
              Can Wu<small>United States</small>
            </div>
            <div className="client-name">
              Revem<small>Ecuador</small>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ STORY (problema → conflicto → orden) ════════ */}
      <StorySection />

      <hr className="divider-line" />

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
                  <span data-en="">Send me the checklist</span>
                  <span data-es="">Envíame el checklist</span>
                </button>
                <p className="lead-form-note">
                  <span data-en="">No spam. One email with the PDF. Unsubscribe anytime.</span>
                  <span data-es="">Sin spam. Un email con el PDF. Cancela cuando quieras.</span>
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

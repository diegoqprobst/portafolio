-- ============================================================
-- Portfolio CMS — Insforge schema
-- Run with: npx @insforge/cli db import insforge/schema.sql
-- ============================================================

-- Home content (singleton row, id = 1)
CREATE TABLE IF NOT EXISTS home_content (
  id                  SERIAL PRIMARY KEY,
  hero_taglines_es    TEXT[]    DEFAULT '{}',
  hero_taglines_en    TEXT[]    DEFAULT '{}',
  about_es            TEXT      DEFAULT '',
  about_en            TEXT      DEFAULT '',
  metrics             JSONB     DEFAULT '[]',
  services            JSONB     DEFAULT '[]',
  tech_stack          JSONB     DEFAULT '[]',
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with current hardcoded content
INSERT INTO home_content (id, hero_taglines_es, hero_taglines_en, about_es, about_en, metrics, services, tech_stack)
VALUES (
  1,
  ARRAY[
    'Automatización de Flujos con IA',
    'Análisis y Visualización de Datos',
    'Integración de APIs y Claude AI',
    'Documentación Técnica con IA'
  ],
  ARRAY[
    'AI Workflow Automation',
    'Data Analysis & Visualization',
    'API & Claude AI Integration',
    'Technical Documentation with AI'
  ],
  'Ingeniero con más de 4 años de experiencia combinando automatización, análisis de datos e inteligencia artificial para optimizar procesos en industrias como construcción, retail y e-commerce.',
  'Engineer with 4+ years combining automation, data analysis and AI to optimize processes across construction, retail and e-commerce.',
  '[
    {"value": "200+", "label_es": "Documentos generados", "label_en": "Documents built"},
    {"value": "3",    "label_es": "Países atendidos",      "label_en": "Countries served"},
    {"value": "4+",   "label_es": "Años en iluminación",   "label_en": "Years lighting"},
    {"value": "99%",  "label_es": "Integridad de datos",   "label_en": "Data integrity"}
  ]',
  '[]',
  '[]'
)
ON CONFLICT (id) DO NOTHING;

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id                SERIAL PRIMARY KEY,
  slug              TEXT      UNIQUE,
  "order"           INTEGER   DEFAULT 0,
  published         BOOLEAN   DEFAULT TRUE,
  title_es          TEXT      DEFAULT '',
  title_en          TEXT      DEFAULT '',
  summary_es        TEXT      DEFAULT '',
  summary_en        TEXT      DEFAULT '',
  description_es    TEXT      DEFAULT '',
  description_en    TEXT      DEFAULT '',
  tech_tags         TEXT[]    DEFAULT '{}',
  industry          TEXT      DEFAULT '',
  year              TEXT      DEFAULT '',
  cover_image_url   TEXT      DEFAULT '',
  gallery_urls      TEXT[]    DEFAULT '{}',
  external_link     TEXT      DEFAULT '',
  case_study_slug   TEXT      DEFAULT '',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with current projects
INSERT INTO projects ("order", slug, title_es, title_en, summary_es, summary_en, tech_tags, industry, year, published)
VALUES
  (1, 'luxarmonie', 'Luxarmonie Product Intelligence', 'Luxarmonie Product Intelligence',
   'Pipeline de enriquecimiento de productos con Python y Claude API para catálogos de iluminación.',
   'Product enrichment pipeline with Python and Claude API for lighting catalogs.',
   ARRAY['Python', 'Claude API', 'Pandas', 'Automation'], 'Retail', '2024', TRUE),

  (2, 'cre-reporting', 'CRE Reporting Automation', 'CRE Reporting Automation',
   'Automatización de reportes de bienes raíces comerciales con Python y Adobe InDesign.',
   'Commercial real estate reporting automation with Python and Adobe InDesign.',
   ARRAY['Python', 'Adobe InDesign', 'ExtendScript', 'Excel'], 'Real Estate', '2024', TRUE),

  (3, 'saratoga', 'Propuesta Alumbrado Saratoga', 'Saratoga Public Lighting Proposal',
   'Propuesta técnica de iluminación pública con análisis de datos y documentación generada por IA.',
   'Public lighting technical proposal with data analysis and AI-generated documentation.',
   ARRAY['Claude Code', 'Adobe', 'Excel', 'Technical Writing'], 'Construction', '2023', TRUE),

  (4, 'led-docs', 'LED Technical Documentation System', 'LED Technical Documentation System',
   'Sistema de documentación técnica para proyectos LED con análisis de datos NFPA.',
   'Technical documentation system for LED projects with NFPA data analysis.',
   ARRAY['Data Analysis', 'Excel', 'NFPA', 'Technical Writing'], 'Construction', '2023', TRUE),

  (5, 'revem', 'Revem Full Design & Automation', 'Revem Full Design & Automation Operations',
   'Operaciones completas de diseño y automatización para e-commerce con IA generativa.',
   'Full design and automation operations for e-commerce with generative AI.',
   ARRAY['AI Image Gen', 'E-commerce', 'Adobe InDesign', 'Automation'], 'E-commerce', '2024', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- CV base (singleton row, id = 1 — fill with your real data)
CREATE TABLE IF NOT EXISTS cv_base (
  id              SERIAL PRIMARY KEY,
  profile         JSONB   DEFAULT '{}',
  experience      JSONB   DEFAULT '[]',
  education       JSONB   DEFAULT '[]',
  skills          JSONB   DEFAULT '[]',
  projects_highlight JSONB DEFAULT '[]',
  certifications  JSONB   DEFAULT '[]',
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO cv_base (id, profile, experience, education, skills, certifications)
VALUES (
  1,
  '{
    "name": "Diego Quinde",
    "email": "diegoaquinde@gmail.com",
    "phone": "",
    "location": "Remote / Latam",
    "linkedin": "linkedin.com/in/diegoquinde",
    "summary": "AI Automation Engineer with 4+ years designing Python-based workflows, data pipelines, and Claude AI integrations across construction, retail and e-commerce. Track record of cutting manual work by 60-80% and shipping technical documentation 5x faster."
  }',
  '[
    {
      "company": "Freelance / Various Clients",
      "role": "AI Automation Engineer",
      "period": "2022 – Present",
      "bullets": [
        "Built a product intelligence pipeline with Python + Claude API that enriched 5,000+ SKUs for Luxarmonie, reducing manual cataloging time by 80%.",
        "Automated commercial real estate reports for a US CRE firm using Python + Adobe InDesign ExtendScript, eliminating 20+ hrs/week of manual layout work.",
        "Designed LED technical documentation system applying NFPA standards and data analysis, cutting documentation time from 3 days to 4 hours.",
        "Deployed Revem e-commerce automation suite: AI image generation, product listing automation, and Adobe InDesign templates."
      ]
    },
    {
      "company": "Saratoga Project",
      "role": "Technical Proposal Engineer",
      "period": "2023",
      "bullets": [
        "Developed public lighting proposal for Saratoga using Claude Code for analysis and Adobe for presentation.",
        "Delivered 40-page technical document in 3 days vs. typical 3-week timeline."
      ]
    }
  ]',
  '[
    {"institution": "Universidad / Bootcamp", "degree": "Ingeniería / Certificación relevante", "year": "2020"}
  ]',
  '[
    {"category": "AI & Automation", "items": ["Claude API", "OpenAI API", "Python", "LangChain", "Prompt Engineering"]},
    {"category": "Data", "items": ["Pandas", "Excel Advanced", "SQL", "Power BI"]},
    {"category": "Dev & Tools", "items": ["Next.js", "TypeScript", "REST APIs", "Git", "Vercel"]},
    {"category": "Design & Docs", "items": ["Adobe InDesign", "ExtendScript", "Technical Writing"]}
  ]',
  '["Claude AI Developer", "Python Automation", "Next.js"]'
)
ON CONFLICT (id) DO NOTHING;

-- CV generated history
CREATE TABLE IF NOT EXISTS cv_generated (
  id              SERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  job_title       TEXT    DEFAULT '',
  company         TEXT    DEFAULT '',
  job_description TEXT    DEFAULT '',
  selected_json   JSONB   DEFAULT '{}',
  pdf_url         TEXT    DEFAULT '',
  provider        TEXT    DEFAULT '',
  notes           TEXT    DEFAULT ''
);

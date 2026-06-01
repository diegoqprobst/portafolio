-- ============================================================
-- Business OS — Insforge schema
-- Sistema para operar el negocio: identidad, metas, clientes,
-- proyectos y finanzas.
-- Run with: npx @insforge/cli db import insforge/business.sql
-- ============================================================

-- ── Identidad de negocio (singleton, id = 1) ────────────────
CREATE TABLE IF NOT EXISTS business_profile (
  id              SERIAL PRIMARY KEY,
  business_name   TEXT      DEFAULT '',
  tagline         TEXT      DEFAULT '',
  mission         TEXT      DEFAULT '',
  vision          TEXT      DEFAULT '',
  values          JSONB     DEFAULT '[]',   -- [{ "title": "", "desc": "" }]
  primary_color   TEXT      DEFAULT '#1E90FF',
  secondary_color TEXT      DEFAULT '#6FD3FF',
  accent_color    TEXT      DEFAULT '#22C55E',
  logo_url        TEXT      DEFAULT '',
  brand_voice     TEXT      DEFAULT '',
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO business_profile (id, business_name, tagline, mission, vision, values, primary_color, secondary_color, accent_color, brand_voice)
VALUES (
  1,
  'Lumen Studio',
  'Claridad técnica para marcas de iluminación.',
  'Ayudo a fabricantes y marcas de iluminación profesional y comercial a estandarizar y comunicar la información técnica de sus productos —fichas técnicas, submittals y catálogos parametrizados— para que vendan con confianza en mercados internacionales.',
  'Ser el estudio de referencia para la documentación técnica de iluminación: el puente confiable entre fábricas, marcas y mercados de EE.UU. y Europa, con ingresos recurrentes y clientes de largo plazo.',
  '[
    {"title": "Precisión técnica", "desc": "Cada dato verificado en la fuente. La exactitud no se negocia en iluminación."},
    {"title": "Claridad que vende", "desc": "Convierto especificaciones complejas en información clara que ayuda a vender."},
    {"title": "Estándares internacionales", "desc": "Trabajo con normas y formatos que los mercados de EE.UU. y Europa esperan."},
    {"title": "Alianza a largo plazo", "desc": "No hago entregas sueltas: construyo relaciones que crecen con el cliente."}
  ]',
  '#F5A623',
  '#FFD27F',
  '#1E90FF',
  'Profesional y técnico, pero cercano. Hablo el idioma de ingenieros y marcas sin sonar frío. Transmito confianza y dominio del detalle.'
)
ON CONFLICT (id) DO NOTHING;

-- ── Metas / Roadmap ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goals (
  id            SERIAL PRIMARY KEY,
  title         TEXT      DEFAULT '',
  description   TEXT      DEFAULT '',
  category      TEXT      DEFAULT 'general',  -- ingresos | clientes | producto | personal | general
  horizon       TEXT      DEFAULT 'now',      -- now | next | later  (mapa/roadmap)
  status        TEXT      DEFAULT 'todo',     -- todo | doing | done
  target_value  NUMERIC   DEFAULT 0,
  current_value NUMERIC   DEFAULT 0,
  unit          TEXT      DEFAULT '',         -- $, clientes, %, etc.
  due_date      DATE,
  sort_order    INTEGER   DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO goals (title, description, category, horizon, status, target_value, current_value, unit, sort_order)
VALUES
  -- AHORA: lo que estás trabajando hoy
  ('Convertir a Luxarmonie en cliente recurrente', 'Pasar de revisiones puntuales a un retainer mensual de revisión técnica de catálogo.', 'ingresos', 'now', 'doing', 1, 0, 'retainer', 1),
  ('Definir la marca Lumen Studio', 'Logo, identidad visual, misión y visión listos y publicados.', 'producto', 'now', 'doing', 100, 50, '%', 2),
  ('Estandarizar mi proceso de fichas técnicas', 'Plantilla parametrizada en InDesign reutilizable para cualquier cliente de iluminación.', 'producto', 'now', 'doing', 100, 30, '%', 3),
  -- SIGUIENTE: lo que viene pronto
  ('Alcanzar ingreso mensual estable', 'Llegar a un objetivo de ingresos recurrentes entre retainers y proyectos.', 'ingresos', 'next', 'todo', 2000, 0, '$/mes', 4),
  ('Conseguir 3 clientes recurrentes B2B', 'Marcas o fabricantes de iluminación con trabajo continuo, no proyectos sueltos.', 'clientes', 'next', 'todo', 3, 1, 'clientes', 5),
  ('Publicar casos de estudio (Can Wu, Luxarmonie)', 'Documentar el submittal de Saratoga y la revisión técnica como casos que atraigan clientes.', 'producto', 'next', 'todo', 2, 0, 'casos', 6),
  -- DESPUÉS: visión a futuro
  ('Productizar un servicio de submittals', 'Paquete estándar de submittals para iluminación con precio fijo y entrega ágil.', 'producto', 'later', 'todo', 100, 0, '%', 7),
  ('Expandir a más mercados (EE.UU. / Europa)', 'Sumar clientes en nuevos mercados aprovechando el puente con proveedores en China.', 'clientes', 'later', 'todo', 5, 2, 'clientes', 8)
ON CONFLICT DO NOTHING;

-- ── Clientes (CRM) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id            SERIAL PRIMARY KEY,
  name          TEXT      DEFAULT '',
  company       TEXT      DEFAULT '',
  email         TEXT      DEFAULT '',
  phone         TEXT      DEFAULT '',
  status        TEXT      DEFAULT 'lead',   -- lead | active | paused | closed
  value         NUMERIC   DEFAULT 0,         -- valor estimado / contrato
  source        TEXT      DEFAULT '',        -- de dónde llegó
  tags          TEXT[]    DEFAULT '{}',
  notes         TEXT      DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Clientes reales de arranque (edita o borra desde el panel)
INSERT INTO clients (name, company, status, value, source, tags, notes)
VALUES
  ('Can Wu', 'Cliente de iluminación (EE.UU.)', 'active', 0,
   'Referido / directo',
   ARRAY['iluminación profesional', 'submittal', 'EE.UU.'],
   'Submittal técnico para el municipio de Saratoga Springs. Potencial de más proyectos de submittals.'),
  ('Luxarmonie', 'E-commerce de iluminación (Francia)', 'active', 0,
   'Directo',
   ARRAY['iluminación comercial', 'e-commerce', 'revisión técnica', 'Europa'],
   'Revisión técnica continua de productos; información consultada con proveedores en China. Objetivo: convertir en retainer mensual recurrente.')
ON CONFLICT DO NOTHING;

-- ── Proyectos de negocio (internos) ─────────────────────────
CREATE TABLE IF NOT EXISTS business_projects (
  id            SERIAL PRIMARY KEY,
  name          TEXT      DEFAULT '',
  description   TEXT      DEFAULT '',
  client_id     INTEGER,
  status        TEXT      DEFAULT 'planning', -- planning | active | paused | done
  progress      INTEGER   DEFAULT 0,          -- 0-100
  value         NUMERIC   DEFAULT 0,
  start_date    DATE,
  due_date      DATE,
  color         TEXT      DEFAULT '#1E90FF',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Proyectos de arranque (client_id 1 = Can Wu, 2 = Luxarmonie)
INSERT INTO business_projects (name, description, client_id, status, progress, value, color)
VALUES
  ('Submittal Saratoga Springs', 'Submittal técnico de iluminación para el municipio de Saratoga Springs. Documentación, fichas y matriz de justificación.', 1, 'done', 100, 0, '#F5A623'),
  ('Revisión técnica de catálogo Luxarmonie', 'Revisión continua de datos técnicos de productos de iluminación, validando especificaciones con proveedores en China.', 2, 'active', 60, 0, '#1E90FF'),
  ('Plantilla parametrizada InDesign', 'Sistema reutilizable de fichas técnicas en Adobe InDesign para estandarizar entregas de iluminación.', NULL, 'active', 30, 0, '#22C55E')
ON CONFLICT DO NOTHING;

-- ── Finanzas (ingresos / gastos) → alimenta analítica ───────
CREATE TABLE IF NOT EXISTS finance_entries (
  id            SERIAL PRIMARY KEY,
  entry_date    DATE      DEFAULT NOW(),
  kind          TEXT      DEFAULT 'income',   -- income | expense
  amount        NUMERIC   DEFAULT 0,
  concept       TEXT      DEFAULT '',
  client_id     INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

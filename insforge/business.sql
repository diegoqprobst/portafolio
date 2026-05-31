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

INSERT INTO business_profile (id, business_name, tagline, mission, vision, values)
VALUES (
  1,
  'Mi Negocio',
  'Una frase que resume lo que haces',
  'Define aquí la razón de ser de tu negocio: a quién sirves y qué problema resuelves.',
  'Describe aquí dónde quieres que esté tu negocio en 3-5 años.',
  '[
    {"title": "Calidad", "desc": "Entregamos trabajo del que estamos orgullosos."},
    {"title": "Cliente primero", "desc": "Cada decisión empieza por el cliente."},
    {"title": "Mejora continua", "desc": "Cada proyecto nos deja mejor que el anterior."}
  ]'
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
  ('Conseguir mis primeros clientes', 'Cerrar los primeros contratos del negocio.', 'clientes', 'now', 'doing', 5, 1, 'clientes', 1),
  ('Definir mi identidad de marca', 'Logo, colores, misión y visión listos.', 'producto', 'now', 'doing', 100, 40, '%', 2),
  ('Llegar a un ingreso mensual estable', 'Alcanzar un objetivo de ingresos recurrentes.', 'ingresos', 'next', 'todo', 3000, 0, '$', 3),
  ('Lanzar mi sitio y portafolio', 'Sitio público con casos de estudio.', 'producto', 'next', 'todo', 100, 0, '%', 4),
  ('Construir un equipo', 'Sumar la primera persona al equipo.', 'personal', 'later', 'todo', 1, 0, 'persona', 5)
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

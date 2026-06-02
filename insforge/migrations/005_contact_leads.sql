-- ============================================================
-- Migration 005 — Captura de leads y mensajes de contacto
-- Idempotente. Run: npx @insforge/cli db import insforge/migrations/005_contact_leads.sql
-- ============================================================

-- Mensajes del formulario de contacto de la home pública
CREATE TABLE IF NOT EXISTS contact_messages (
  id           SERIAL PRIMARY KEY,
  name         TEXT      DEFAULT '',
  company      TEXT      DEFAULT '',
  email        TEXT      DEFAULT '',
  project_type TEXT      DEFAULT '',
  message      TEXT      DEFAULT '',
  read         BOOLEAN   DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Emails capturados por el lead magnet (checklist)
CREATE TABLE IF NOT EXISTS leads (
  id          SERIAL PRIMARY KEY,
  email       TEXT      DEFAULT '',
  source      TEXT      DEFAULT 'lead-magnet',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

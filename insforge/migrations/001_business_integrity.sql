-- ============================================================
-- Migration 001 — Business OS integrity
-- Aplica a una base YA existente (idempotente; seguro de re-ejecutar).
-- Run: npx @insforge/cli db import insforge/migrations/001_business_integrity.sql
--
-- Qué hace:
--   1. Añade updated_at + deleted_at a las tablas que no los tenían.
--   2. Trigger que mantiene updated_at al día en cada UPDATE.
--   3. Foreign keys client_id -> clients(id) con ON DELETE SET NULL
--      (borrar un cliente ya NO deja proyectos/finanzas huérfanos).
--   4. CHECK constraints en los enums (status/horizon/kind/category)
--      como segunda capa además de la validación Zod del backend.
-- ============================================================

-- ── 1. Columnas de auditoría ────────────────────────────────
ALTER TABLE clients           ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE goals             ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE business_projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE finance_entries   ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE clients           ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE goals             ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE business_projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE finance_entries   ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- ── 2. Trigger updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_goals_updated BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_bp_updated BEFORE UPDATE ON business_projects
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_fe_updated BEFORE UPDATE ON finance_entries
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 3. Foreign keys (ON DELETE SET NULL) ────────────────────
DO $$ BEGIN
  ALTER TABLE business_projects
    ADD CONSTRAINT fk_bp_client FOREIGN KEY (client_id)
    REFERENCES clients(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE finance_entries
    ADD CONSTRAINT fk_fe_client FOREIGN KEY (client_id)
    REFERENCES clients(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 4. CHECK constraints (enums) ────────────────────────────
DO $$ BEGIN
  ALTER TABLE clients ADD CONSTRAINT chk_client_status
    CHECK (status IN ('lead','active','paused','closed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE goals ADD CONSTRAINT chk_goal_horizon
    CHECK (horizon IN ('now','next','later'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE goals ADD CONSTRAINT chk_goal_status
    CHECK (status IN ('todo','doing','done'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE goals ADD CONSTRAINT chk_goal_category
    CHECK (category IN ('ingresos','clientes','producto','personal','general'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE business_projects ADD CONSTRAINT chk_bp_status
    CHECK (status IN ('planning','active','paused','done'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE finance_entries ADD CONSTRAINT chk_fe_kind
    CHECK (kind IN ('income','expense'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 009 · Etapa del embudo, último contacto y toques en clientes
--
-- Con decenas de prospectos en frío, "Prospecto" a secas no dice en qué punto
-- está cada uno. Estas tres columnas permiten contar cuántos hay por etapa y
-- medir la tasa de respuesta:
--
--   stage            contacted | replied | talking | proposal   (NULL = sin etapa)
--   last_contact_at  fecha del último mensaje que TÚ enviaste
--   touches          cuántos mensajes le has enviado
--
-- Las respuestas automáticas no cuentan como "replied": esa etapa es para
-- cuando contesta una persona.
--
-- Aplicar: npx @insforge/cli db import insforge/migrations/009_clients_pipeline.sql
-- Idempotente (IF NOT EXISTS).

ALTER TABLE clients ADD COLUMN IF NOT EXISTS stage TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_contact_at DATE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS touches INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_clients_stage
  ON clients (stage)
  WHERE stage IS NOT NULL AND deleted_at IS NULL;

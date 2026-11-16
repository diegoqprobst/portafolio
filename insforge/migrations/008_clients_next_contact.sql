-- 008 · Fecha de próximo contacto en clientes
--
-- El CRM guardaba el seguimiento de cada prospecto dentro del texto de `notes`,
-- así que el panel no podía ordenar ni avisar de a quién toca escribir. Esta
-- columna lo hace explícito. Es nullable y sin valor por defecto: un cliente
-- sin seguimiento pendiente simplemente no tiene fecha.
--
-- Aplicar: npx @insforge/cli db import insforge/migrations/008_clients_next_contact.sql
-- Idempotente (IF NOT EXISTS).

ALTER TABLE clients ADD COLUMN IF NOT EXISTS next_contact_at DATE;

CREATE INDEX IF NOT EXISTS idx_clients_next_contact
  ON clients (next_contact_at)
  WHERE next_contact_at IS NOT NULL AND deleted_at IS NULL;

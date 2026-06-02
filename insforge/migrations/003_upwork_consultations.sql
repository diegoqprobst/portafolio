-- ============================================================
-- Migration 003 — Project Catalog lanzado + nueva meta: Consultas Upwork
-- Idempotente. Run: npx @insforge/cli db import insforge/migrations/003_upwork_consultations.sql
-- ============================================================

-- Project Catalog: los 3 gigs ya están publicados → completado
UPDATE goals SET status = 'done', current_value = 3
WHERE title = 'Lanzar Project Catalog en Upwork (3 gigs)';

-- Nueva meta [AHORA]: activar Consultas 1-a-1 de pago en Upwork (otro inbound)
INSERT INTO goals (title, description, category, horizon, status, target_value, current_value, unit, sort_order)
SELECT 'Activar Consultas 1-a-1 en Upwork',
       'Publicar las consultas de pago de Upwork (sin connects): grabar video de presentación, fijar tarifa, conectar calendario / disponibilidad y publicar. Segundo canal para que los clientes me encuentren.',
       'clientes', 'now', 'doing', 100, 10, '%', 0
WHERE NOT EXISTS (SELECT 1 FROM goals WHERE title = 'Activar Consultas 1-a-1 en Upwork');

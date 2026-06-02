-- ============================================================
-- Migration 002 — Goals aligned to the Upwork / technical-catalogs pivot
-- Idempotent: UPDATEs set fixed values; INSERTs guarded by NOT EXISTS.
-- Run: npx @insforge/cli db import insforge/migrations/002_goals_upwork.sql
-- ============================================================

-- Reframe: "Estandarizar fichas técnicas" → la plantilla maestra (Gig 2)
UPDATE goals SET
  title = 'Plantilla maestra InDesign reutilizable (data-merge)',
  description = 'Plantilla parametrizada de fichas/specs lista para data-merge — genera documentos por docenas sin re-maquetar. Es la base del Gig 2 de Upwork.'
WHERE id = 3;

-- Reframe: "Productizar submittals" → catálogos/fichas (cualquier industria)
UPDATE goals SET
  title = 'Productizar servicio de catálogos / fichas InDesign',
  description = 'Paquete estándar de catálogos y fichas técnicas en InDesign con precio fijo y entrega ágil — para cualquier industria de producto, no solo iluminación.'
WHERE id = 7;

-- New [AHORA]: lanzar el Project Catalog de Upwork (el motor actual)
INSERT INTO goals (title, description, category, horizon, status, target_value, current_value, unit, sort_order)
SELECT 'Lanzar Project Catalog en Upwork (3 gigs)',
       'Publicar los 3 gigs (catálogo, ficha técnica, estandarización) con thumbnails y copy optimizado para que los clientes me encuentren sin gastar connects.',
       'clientes', 'now', 'doing', 3, 2, 'gigs', 0
WHERE NOT EXISTS (SELECT 1 FROM goals WHERE title = 'Lanzar Project Catalog en Upwork (3 gigs)');

-- New [SIGUIENTE]: primer cliente inbound (que me busquen, sin connects)
INSERT INTO goals (title, description, category, horizon, status, target_value, current_value, unit, sort_order)
SELECT 'Primer cliente inbound desde Upwork',
       'Conseguir el primer cliente que llegue por el Project Catalog sin enviar connects. Valida el posicionamiento de catálogos técnicos.',
       'clientes', 'next', 'todo', 1, 0, 'cliente', 9
WHERE NOT EXISTS (SELECT 1 FROM goals WHERE title = 'Primer cliente inbound desde Upwork');

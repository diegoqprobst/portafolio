-- ============================================================
-- Migration 004 — Nuevas metas de servicio: Labels + Submittals (iluminación)
-- Idempotente. Run: npx @insforge/cli db import insforge/migrations/004_services_labels_submittals.sql
-- ============================================================

-- [SIGUIENTE] Productizar servicio de etiquetas / labels (aprovecha su sistema)
INSERT INTO goals (title, description, category, horizon, status, target_value, current_value, unit, sort_order)
SELECT 'Productizar servicio de etiquetas / labels',
       'Empaquetar un servicio de diseño y producción de etiquetas (labels) de producto/empaque, aprovechando mi sistema profesional de labels ya construido. Calza con mi ventaja de data-merge (datos variables): alto volumen y consistente. Posible gig de Upwork y add-on para clientes de catálogos.',
       'producto', 'next', 'todo', 100, 20, '%', 10
WHERE NOT EXISTS (SELECT 1 FROM goals WHERE title = 'Productizar servicio de etiquetas / labels');

-- [SIGUIENTE] Productizar submittals técnicos para iluminación (vertical, mayor ticket)
INSERT INTO goals (title, description, category, horizon, status, target_value, current_value, unit, sort_order)
SELECT 'Productizar submittals para proyectos de iluminación',
       'Paquete estándar de submittals técnicos para proyectos de iluminación (matriz de cumplimiento, fichas técnicas, narrativa), aprovechando la experiencia del submittal de Saratoga. Servicio vertical de mayor ticket.',
       'producto', 'next', 'todo', 100, 20, '%', 11
WHERE NOT EXISTS (SELECT 1 FROM goals WHERE title = 'Productizar submittals para proyectos de iluminación');

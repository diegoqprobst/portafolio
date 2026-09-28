// Correo público de contacto: única fuente para mailto, JSON-LD, la página de
// privacidad y las notificaciones de /api/contact y /api/lead. Para pasar al
// correo del dominio (ej. diego@diegoquinde.com) basta cambiar esta línea —
// hacerlo solo cuando ese buzón ya reciba correo (reenvío o bandeja propia).
export const CONTACT_EMAIL = "diegoaquinde@gmail.com";

export function mailto(subject?: string): string {
  return subject
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${CONTACT_EMAIL}`;
}

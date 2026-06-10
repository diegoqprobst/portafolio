import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidad · Lumen Studio",
  description: "Política de privacidad de Lumen Studio (Diego Quinde).",
};

// Página autónoma y estática (no depende del toggle de idioma de la home),
// así que se presenta en español e inglés, una sección tras otra.
export default function PrivacyPage() {
  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "120px 24px 96px",
        color: "var(--text)",
        fontFamily: "var(--font-body)",
        lineHeight: 1.7,
      }}
    >
      <Link
        href="/"
        style={{ color: "var(--accent)", fontWeight: 700, fontSize: 14 }}
      >
        ← Lumen Studio
      </Link>

      {/* ───── Español ───── */}
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: "28px 0 8px" }}>
        Política de Privacidad
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>
        Última actualización: junio 2026 · Lumen Studio (Diego Quinde)
      </p>

      <Section title="Quién es responsable">
        Lumen Studio, operado por Diego Quinde. Contacto:{" "}
        <a href="mailto:diegoaquinde@gmail.com" style={linkStyle}>
          diegoaquinde@gmail.com
        </a>
        .
      </Section>
      <Section title="Qué datos recogemos y por qué">
        Solo los datos que tú nos envías por los formularios del sitio:
        <ul style={ulStyle}>
          <li>
            <b>Formulario de contacto:</b> nombre, empresa (opcional), email,
            tipo de proyecto y mensaje — para responder a tu consulta.
          </li>
          <li>
            <b>Checklist (lead magnet):</b> tu email — para enviarte el recurso
            solicitado y, si lo permites, comunicación ocasional relacionada.
          </li>
        </ul>
        No usamos cookies de seguimiento ni analítica de terceros. La única
        preferencia que guardamos en tu navegador es el idioma (ES/EN).
      </Section>
      <Section title="Dónde se guardan">
        Los envíos se almacenan en nuestra base de datos gestionada (InsForge) y
        el sitio se aloja en Vercel. No vendemos ni compartimos tus datos con
        terceros para marketing.
      </Section>
      <Section title="Cuánto tiempo">
        Conservamos los mensajes mientras sean útiles para la relación
        comercial; puedes pedir su borrado en cualquier momento.
      </Section>
      <Section title="Tus derechos">
        Puedes solicitar acceso, corrección o eliminación de tus datos, u
        oponerte a su uso, escribiendo a{" "}
        <a href="mailto:diegoaquinde@gmail.com" style={linkStyle}>
          diegoaquinde@gmail.com
        </a>
        . Atendemos solicitudes conforme al RGPD (UE) y normativas aplicables.
      </Section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "44px 0" }} />

      {/* ───── English ───── */}
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
        Privacy Policy (English)
      </h2>
      <Section title="Who is responsible">
        Lumen Studio, operated by Diego Quinde. Contact:{" "}
        <a href="mailto:diegoaquinde@gmail.com" style={linkStyle}>
          diegoaquinde@gmail.com
        </a>
        .
      </Section>
      <Section title="What we collect & why">
        Only what you submit through the site forms:
        <ul style={ulStyle}>
          <li>
            <b>Contact form:</b> name, company (optional), email, project type
            and message — to reply to your inquiry.
          </li>
          <li>
            <b>Checklist (lead magnet):</b> your email — to send the requested
            resource and, with your permission, occasional related updates.
          </li>
        </ul>
        We use no tracking cookies or third-party analytics. The only preference
        stored in your browser is your language (ES/EN).
      </Section>
      <Section title="Where it's stored">
        Submissions are stored in our managed database (InsForge); the site is
        hosted on Vercel. We never sell or share your data with third parties
        for marketing.
      </Section>
      <Section title="Your rights">
        You can request access, correction, or deletion of your data, or object
        to its use, by emailing{" "}
        <a href="mailto:diegoaquinde@gmail.com" style={linkStyle}>
          diegoaquinde@gmail.com
        </a>
        . We handle requests in line with GDPR (EU) and applicable laws.
      </Section>
    </main>
  );
}

const linkStyle: React.CSSProperties = { color: "var(--accent)", fontWeight: 600 };
const ulStyle: React.CSSProperties = { margin: "10px 0", paddingLeft: 20 };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{title}</h3>
      <div style={{ color: "var(--muted)", fontSize: 15 }}>{children}</div>
    </section>
  );
}

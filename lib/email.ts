import { insforge } from "@/lib/insforge";

// Envío de email transaccional. Best-effort y con degradado elegante:
//   1. Si RESEND_API_KEY está configurada → envía vía Resend (gratis hasta
//      3k/mes). Sender por RESEND_FROM (ej. "Lumen Studio <noreply@diegoquinde.com>"
//      tras verificar el dominio; o "onboarding@resend.dev" para pruebas).
//   2. Si no, intenta Insforge (requiere plan de pago).
//   3. Si nada está configurado o falla → registra aviso y devuelve false,
//      SIN romper el flujo (el lead/mensaje ya quedó guardado en la DB).
//
// Activar Resend es solo poner RESEND_API_KEY (+ opcional RESEND_FROM) en
// Vercel — no requiere re-deploy de código.

type EmailOpts = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

async function sendViaResend(opts: EmailOpts): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.RESEND_FROM || "Lumen Studio <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });
    if (!res.ok) {
      console.warn("[email:resend] no enviado:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[email:resend] fallo:", e);
    return false;
  }
}

async function sendViaInsforge(opts: EmailOpts): Promise<boolean> {
  try {
    const { error } = await insforge.emails.send({ from: "Lumen Studio", ...opts });
    if (error) {
      console.warn("[email:insforge] no enviado:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[email:insforge] fallo:", e);
    return false;
  }
}

export async function sendEmail(opts: EmailOpts): Promise<boolean> {
  if (process.env.RESEND_API_KEY) return sendViaResend(opts);
  return sendViaInsforge(opts);
}

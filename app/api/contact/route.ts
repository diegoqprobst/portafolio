import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { insforge } from "@/lib/insforge";
import { contactMessageCreate } from "@/lib/schemas";
import { checkPublicFormRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

// Ruta PÚBLICA (no la cubre el middleware admin). Recibe el formulario de
// contacto de la home, lo valida y lo guarda en Insforge.
//
// Defensas anti-spam: rate-limit por IP, honeypot, validación Zod con límites
// de longitud. Sin auth (es un formulario público) pero acotado.

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const rl = await checkPublicFormRateLimit(clientIp(req));
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Demasiados envíos. Inténtalo más tarde." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: campo oculto "website". Si un bot lo rellena, fingimos éxito y
  // descartamos en silencio (no le damos pistas).
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return NextResponse.json({ ok: true });
  }

  let data;
  try {
    data = contactMessageCreate.parse(body);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Revisa los campos del formulario." }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { error } = await insforge.database.from("contact_messages").insert([data]);
  if (error) {
    console.error("[contact.insert]", error);
    return NextResponse.json({ error: "No se pudo enviar el mensaje." }, { status: 500 });
  }

  // Notificación best-effort a Diego (no bloquea: el mensaje ya está guardado).
  await sendEmail({
    to: "diegoaquinde@gmail.com",
    replyTo: data.email,
    subject: `Lumen Studio — nuevo mensaje de ${data.name}`,
    html: `<h2>Nuevo mensaje de contacto</h2>
<p><b>Nombre:</b> ${data.name}<br/>
<b>Empresa:</b> ${data.company || "—"}<br/>
<b>Email:</b> ${data.email}<br/>
<b>Tipo:</b> ${data.project_type || "—"}</p>
<p><b>Mensaje:</b><br/>${(data.message || "").replace(/\n/g, "<br/>")}</p>
<p style="color:#888;font-size:12px">Responde a este correo para contestarle directo.</p>`,
  });

  return NextResponse.json({ ok: true });
}

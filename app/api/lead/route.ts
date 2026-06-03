import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { insforge } from "@/lib/insforge";
import { leadCreate } from "@/lib/schemas";
import { checkPublicFormRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

// Ruta PÚBLICA: captura el email del lead magnet (checklist) en Insforge.
// Mismas defensas que /api/contact (rate-limit + honeypot + validación).

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

  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return NextResponse.json({ ok: true });
  }

  let data;
  try {
    data = leadCreate.parse(body);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { error } = await insforge.database.from("leads").insert([data]);
  if (error) {
    console.error("[lead.insert]", error);
    return NextResponse.json({ error: "No se pudo registrar." }, { status: 500 });
  }

  // Entrega best-effort por email (el lead ya recibe el checklist en pantalla
  // de inmediato, así que esto es un bonus cuando el email esté configurado).
  await sendEmail({
    to: data.email,
    replyTo: "diegoaquinde@gmail.com",
    subject: "Your Catalog & Spec Sheet Prep Checklist — Lumen Studio",
    html: `<h2>Here's your checklist</h2>
<p>Thanks for your interest in Lumen Studio. Open your checklist here:</p>
<p><a href="https://diegoquinde.com/checklist">diegoquinde.com/checklist</a></p>
<p>— Diego · Lumen Studio</p>`,
  });

  return NextResponse.json({ ok: true });
}

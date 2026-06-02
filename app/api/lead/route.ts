import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { insforge } from "@/lib/insforge";
import { leadCreate } from "@/lib/schemas";
import { checkPublicFormRateLimit } from "@/lib/rate-limit";

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
  return NextResponse.json({ ok: true });
}

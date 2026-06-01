import { NextRequest, NextResponse } from "next/server";
import { checkPassword, signToken, COOKIE, TTL } from "@/lib/auth";
import { checkLoginRateLimit } from "@/lib/rate-limit";

function clientIp(req: NextRequest): string {
  // Vercel pone la IP real en x-forwarded-for (primer valor de la lista).
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  // Rate-limit por IP ANTES de tocar password/DB: frena fuerza bruta.
  const rl = await checkLoginRateLimit(clientIp(req));
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
      {
        status: 429,
        headers: rl.retryAfter ? { "Retry-After": String(rl.retryAfter) } : undefined,
      }
    );
  }

  const { email, password } = await req.json();

  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  if (email !== adminEmail || !(await checkPassword(password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: TTL,
    path: "/",
  });
  return res;
}

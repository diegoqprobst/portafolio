import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, COOKIE } from "./auth";

// Defense-in-depth: el middleware ya redirige rutas admin no autenticadas,
// pero cada route handler debe verificar también. Razones:
//   1. Si el matcher del middleware cambia, las rutas no quedan abiertas.
//   2. Server components / direct fetches (sin pasar por matcher) siguen
//      siendo seguros.
//   3. Helper único = consistencia y fácil de auditar.

export type AdminSession = { email: string };

/** Devuelve la sesión admin o `null` si no hay token válido. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Variante para usar al inicio de cada route handler.
 * Retorna `null` si está autorizado (sigue el flujo normal), o un
 * `NextResponse` 401 que debes devolver directamente.
 *
 * Uso:
 *   const unauthorized = await requireAdmin();
 *   if (unauthorized) return unauthorized;
 *   // ...continúa con la lógica
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

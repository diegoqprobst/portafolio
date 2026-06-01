import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Helpers para responder consistentemente desde route handlers sin filtrar
// detalles de la DB o stack traces al cliente.
//
// Regla: si es un error de input (Zod), devolvemos 400 con los issues
// específicos (ayuda al cliente a corregir). Si es un error interno
// (DB, network, etc.), loggeamos completo server-side y devolvemos un
// 500 genérico.

/** Convierte un ZodError en un 400 con detalle de campos. */
export function badRequest(err: ZodError) {
  return NextResponse.json(
    {
      error: "Invalid input",
      issues: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    },
    { status: 400 }
  );
}

/**
 * Logea un error de DB server-side (con todo el detalle del SDK de Insforge,
 * que puede incluir nombres de tablas, hints de SQL, etc.) y devuelve un
 * payload genérico al cliente.
 *
 * Pasar `op` para que el log identifique fácilmente qué falló.
 */
export function dbError(op: string, err: unknown) {
  console.error(`[db:${op}]`, err);
  return NextResponse.json({ error: "Database error" }, { status: 500 });
}

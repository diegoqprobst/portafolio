import { NextRequest, NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { insforge } from "@/lib/insforge";
import { requireAdmin } from "@/lib/require-admin";
import { badRequest, dbError } from "@/lib/api-errors";

// Fábrica de handlers CRUD para una tabla de Insforge.
// Comparada con la versión anterior, ahora:
//   1. Verifica admin en TODO método (defense in depth — el middleware ya lo
//      hace, pero esto evita que un matcher mal puesto deje rutas abiertas).
//   2. Valida el body con un Zod schema antes de tocar la DB. Esto previene
//      mass-assignment y elimina la necesidad de `delete body.id`.
//   3. Sanitiza errores: log server-side, mensaje genérico al cliente.
//   4. Acepta schemas distintos para create y update (update suele ser parcial).

export type CrudConfig<C, U> = {
  table: string;
  createSchema: ZodType<C>;
  updateSchema: ZodType<U>;
  orderBy?: { column: string; ascending?: boolean };
  // Cuando es true, DELETE marca `deleted_at` en vez de borrar, y los listados
  // excluyen las filas marcadas. Solo para tablas que tienen la columna
  // `deleted_at` (clients, goals, business_projects, finance_entries).
  softDelete?: boolean;
};

export function listCreate<C, U>(config: CrudConfig<C, U>) {
  const { table, createSchema, orderBy, softDelete } = config;

  return {
    async GET() {
      const unauthorized = await requireAdmin();
      if (unauthorized) return unauthorized;

      let q = insforge.database.from(table).select("*");
      if (softDelete) q = q.is("deleted_at", null);
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await q;
      if (error) return dbError(`${table}.list`, error);
      return NextResponse.json(data ?? []);
    },

    async POST(req: NextRequest) {
      const unauthorized = await requireAdmin();
      if (unauthorized) return unauthorized;

      let parsed: C;
      try {
        parsed = createSchema.parse(await req.json());
      } catch (e) {
        if (e instanceof ZodError) return badRequest(e);
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }

      const { data, error } = await insforge.database.from(table).insert([parsed]).select();
      if (error) return dbError(`${table}.insert`, error);
      return NextResponse.json(data?.[0] ?? {}, { status: 201 });
    },
  };
}

export function updateDelete<C, U>(config: CrudConfig<C, U>) {
  const { table, updateSchema, softDelete } = config;

  return {
    async PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
      const unauthorized = await requireAdmin();
      if (unauthorized) return unauthorized;

      const { id } = await ctx.params;

      let parsed: U;
      try {
        parsed = updateSchema.parse(await req.json());
      } catch (e) {
        if (e instanceof ZodError) return badRequest(e);
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }

      const { error } = await insforge.database.from(table).update(parsed as object).eq("id", id);
      if (error) return dbError(`${table}.update`, error);
      return NextResponse.json({ ok: true });
    },

    async DELETE(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
      const unauthorized = await requireAdmin();
      if (unauthorized) return unauthorized;

      const { id } = await ctx.params;
      const { error } = softDelete
        ? await insforge.database
            .from(table)
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", id)
        : await insforge.database.from(table).delete().eq("id", id);
      if (error) return dbError(`${table}.delete`, error);
      return NextResponse.json({ ok: true });
    },
  };
}

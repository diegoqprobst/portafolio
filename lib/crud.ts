import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";

// Fábrica de handlers CRUD para una tabla de Insforge.
// Genera GET (listar), POST (crear) y, para [id], PUT (actualizar) y DELETE.

export function listCreate(table: string, orderBy?: { column: string; ascending?: boolean }) {
  return {
    async GET() {
      let q = insforge.database.from(table).select("*");
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await q;
      if (error) return NextResponse.json({ error }, { status: 500 });
      return NextResponse.json(data ?? []);
    },
    async POST(req: NextRequest) {
      const body = await req.json();
      const { data, error } = await insforge.database.from(table).insert([body]).select();
      if (error) return NextResponse.json({ error }, { status: 500 });
      return NextResponse.json(data?.[0] ?? {}, { status: 201 });
    },
  };
}

export function updateDelete(table: string) {
  return {
    async PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
      const { id } = await ctx.params;
      const body = await req.json();
      delete body.id;
      const { error } = await insforge.database.from(table).update(body).eq("id", id);
      if (error) return NextResponse.json({ error }, { status: 500 });
      return NextResponse.json({ ok: true });
    },
    async DELETE(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
      const { id } = await ctx.params;
      const { error } = await insforge.database.from(table).delete().eq("id", id);
      if (error) return NextResponse.json({ error }, { status: 500 });
      return NextResponse.json({ ok: true });
    },
  };
}

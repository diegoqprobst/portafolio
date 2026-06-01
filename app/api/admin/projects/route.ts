import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";

// GET admin: lista TODOS los proyectos (incluidos borradores).
// El listado público para la home se hace en otro lado y aplica
// `.eq("published", true)`.
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { data, error } = await insforge.database.from("projects").select("*");
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const { data, error } = await insforge.database
    .from("projects")
    .insert([{ ...body, published: body.published ?? true }]);
  if (error) return NextResponse.json({ error }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json(data?.[0] ?? {}, { status: 201 });
}

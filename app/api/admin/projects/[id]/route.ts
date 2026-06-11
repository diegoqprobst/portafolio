import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { insforge } from "@/lib/insforge";
import { requireAdmin } from "@/lib/require-admin";
import { badRequest, dbError } from "@/lib/api-errors";
import { portfolioProjectUpdate } from "@/lib/schemas";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  let body;
  try {
    body = portfolioProjectUpdate.parse(await req.json());
  } catch (e) {
    if (e instanceof ZodError) return badRequest(e);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { error } = await insforge.database.from("projects").update(body).eq("id", id);
  if (error) return dbError("projects.update", error);
  revalidatePath("/lumen");
  return NextResponse.json({ ok: true });
}

// Soft delete: marca published=false (mantiene el registro para no romper
// referencias y permite restaurar). Hard-delete sería peligroso para el CMS.
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const { error } = await insforge.database
    .from("projects")
    .update({ published: false })
    .eq("id", id);
  if (error) return dbError("projects.unpublish", error);
  revalidatePath("/lumen");
  return NextResponse.json({ ok: true });
}

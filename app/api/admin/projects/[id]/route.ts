import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json();
  const { error } = await insforge.database
    .from("projects")
    .update(body)
    .eq("id", id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const { error } = await insforge.database
    .from("projects")
    .update({ published: false })
    .eq("id", id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { data, error } = await insforge.database
    .from("home_content")
    .select("*")
    .eq("id", 1);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data?.[0] ?? null);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { error } = await insforge.database
    .from("home_content")
    .update(body)
    .eq("id", 1);
  if (error) return NextResponse.json({ error }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

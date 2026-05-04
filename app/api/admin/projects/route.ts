import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { data, error } = await insforge.database
    .from("projects")
    .select("*")
    .eq("published", true);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await insforge.database
    .from("projects")
    .insert([{ ...body, published: body.published ?? true }]);
  if (error) return NextResponse.json({ error }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json(data?.[0] ?? {}, { status: 201 });
}

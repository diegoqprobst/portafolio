import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";

export async function GET() {
  const { data, error } = await insforge.database
    .from("business_profile")
    .select("*")
    .eq("id", 1);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data?.[0] ?? null);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  delete body.id;
  const { error } = await insforge.database
    .from("business_profile")
    .update(body)
    .eq("id", 1);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}

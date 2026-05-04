import { NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";

export async function GET() {
  const { data, error } = await insforge.database
    .from("cv_generated")
    .select("id, created_at, job_title, company, pdf_url, notes");
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data ?? []);
}

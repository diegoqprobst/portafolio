import { NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { requireAdmin } from "@/lib/require-admin";
import { dbError } from "@/lib/api-errors";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { data, error } = await insforge.database
    .from("cv_generated")
    .select("id, created_at, job_title, company, pdf_url, notes");
  if (error) return dbError("cv_generated.list", error);
  return NextResponse.json(data ?? []);
}

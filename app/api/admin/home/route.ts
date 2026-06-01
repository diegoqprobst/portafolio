import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { insforge } from "@/lib/insforge";
import { requireAdmin } from "@/lib/require-admin";
import { badRequest, dbError } from "@/lib/api-errors";
import { homeContentUpdate } from "@/lib/schemas";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { data, error } = await insforge.database
    .from("home_content")
    .select("*")
    .eq("id", 1);
  if (error) return dbError("home_content.get", error);
  return NextResponse.json(data?.[0] ?? null);
}

export async function PUT(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body;
  try {
    body = homeContentUpdate.parse(await req.json());
  } catch (e) {
    if (e instanceof ZodError) return badRequest(e);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { error } = await insforge.database.from("home_content").update(body).eq("id", 1);
  if (error) return dbError("home_content.update", error);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

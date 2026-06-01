import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { insforge } from "@/lib/insforge";
import { requireAdmin } from "@/lib/require-admin";
import { badRequest, dbError } from "@/lib/api-errors";
import { portfolioProjectCreate } from "@/lib/schemas";

// GET admin: lista TODOS los proyectos (incluidos borradores).
// El listado público en la home filtra published=true en otro lado.
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { data, error } = await insforge.database.from("projects").select("*");
  if (error) return dbError("projects.list", error);
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body;
  try {
    body = portfolioProjectCreate.parse(await req.json());
  } catch (e) {
    if (e instanceof ZodError) return badRequest(e);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data, error } = await insforge.database.from("projects").insert([body]);
  if (error) return dbError("projects.insert", error);
  revalidatePath("/");
  return NextResponse.json(data?.[0] ?? {}, { status: 201 });
}

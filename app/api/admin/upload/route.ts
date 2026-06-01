import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const path = `projects/${Date.now()}.${ext}`;

  const { data, error } = await insforge.storage.from("assets").upload(path, file);
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ url: (data as { url?: string })?.url ?? path });
}

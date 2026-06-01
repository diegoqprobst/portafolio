import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { requireAdmin } from "@/lib/require-admin";
import { dbError } from "@/lib/api-errors";

// Sólo aceptamos imágenes raster. SVG queda fuera a propósito: aunque es una
// imagen, su contenido es XML ejecutable (puede traer <script>) y si se sirve
// desde nuestro dominio convierte el upload en un vector XSS.
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  // Derivamos la extensión del MIME real, NO del nombre del archivo, para
  // que un atacante no pueda subir "image.svg" diciendo "es image/png".
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      {
        error: "Unsupported file type",
        allowed: Array.from(ALLOWED_MIME),
        received: file.type,
      },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_BYTES / 1024 / 1024} MB)` },
      { status: 413 }
    );
  }

  const ext = ALLOWED_EXT[file.type];
  const path = `projects/${Date.now()}.${ext}`;

  const { data, error } = await insforge.storage.from("assets").upload(path, file);
  if (error) return dbError("storage.upload", error);

  return NextResponse.json({ url: (data as { url?: string })?.url ?? path });
}

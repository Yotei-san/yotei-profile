import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo inválido." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "Arquivo vazio." },
        { status: 400 }
      );
    }

    const safeName =
      file.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9._-]/g, "") || "upload.bin";

    const filename = `${Date.now()}-${safeName}`;

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
    });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);

    return NextResponse.json(
      { error: "Falha ao fazer upload." },
      { status: 500 }
    );
  }
}
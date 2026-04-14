import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo inválido." }, { status: 400 });
    }

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const blob = await put(safeName, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
    });
  } catch (error) {
    console.error("upload error", error);
    return NextResponse.json({ error: "Falha no upload." }, { status: 500 });
  }
}
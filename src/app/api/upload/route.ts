import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import {
  PROFILE_BANNER_VIDEO_MAX_BYTES,
  PROFILE_BANNER_VIDEO_MIME_TYPES,
  PROFILE_IMAGE_MAX_BYTES,
  PROFILE_IMAGE_MIME_TYPES,
  formatBytes,
} from "@/app/lib/profile-media";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const purposeValue = formData.get("purpose");
    const purpose =
      typeof purposeValue === "string" ? purposeValue.trim().toLowerCase() : "generic";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo invalido." }, { status: 400 });
    }

    const mimeType = file.type.toLowerCase();
    const isImage = PROFILE_IMAGE_MIME_TYPES.includes(
      mimeType as (typeof PROFILE_IMAGE_MIME_TYPES)[number]
    );
    const isBannerVideo = PROFILE_BANNER_VIDEO_MIME_TYPES.includes(
      mimeType as (typeof PROFILE_BANNER_VIDEO_MIME_TYPES)[number]
    );
    const isAvatarPurpose = purpose === "avatar";
    const isBannerPurpose = purpose === "banner";
    const allowsVideo = isBannerPurpose || !isAvatarPurpose;

    if (!isImage && !(allowsVideo && isBannerVideo)) {
      return NextResponse.json(
        {
          error: isAvatarPurpose
            ? "Avatar aceita apenas PNG, JPG, WEBP ou GIF."
            : "Formato invalido. Banner aceita imagem, GIF ou video MP4/WebM/MOV.",
        },
        { status: 400 }
      );
    }

    const maxBytes = isBannerVideo ? PROFILE_BANNER_VIDEO_MAX_BYTES : PROFILE_IMAGE_MAX_BYTES;

    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error: isBannerVideo
            ? `Video muito grande. O limite do banner em video e ${formatBytes(
                PROFILE_BANNER_VIDEO_MAX_BYTES
              )}.`
            : `Arquivo muito grande. O limite para imagem e ${formatBytes(
                PROFILE_IMAGE_MAX_BYTES
              )}.`,
        },
        { status: 400 }
      );
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

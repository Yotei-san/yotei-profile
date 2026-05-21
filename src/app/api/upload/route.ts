import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import {
  PROFILE_BANNER_IMAGE_MAX_BYTES,
  PROFILE_BANNER_VIDEO_MAX_BYTES,
  getProfileMediaMaxBytes,
  getProfileMediaSizeError,
  getProfileMediaTypeError,
  isProfileBannerVideoMimeType,
  isProfileImageMimeType,
  type ProfileMediaPurpose,
} from "@/app/lib/profile-media";
import { logServerError } from "@/app/lib/server-log";

type UploadPurpose = ProfileMediaPurpose | "generic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const purposeValue = formData.get("purpose");
    const purpose = normalizePurpose(purposeValue);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo invalido." }, { status: 400 });
    }

    const mimeType = file.type.toLowerCase();
    const isImage = isProfileImageMimeType(mimeType);
    const isBannerVideo = isProfileBannerVideoMimeType(mimeType);
    const allowsVideo = purpose !== "avatar";

    if (!isImage && !(allowsVideo && isBannerVideo)) {
      return NextResponse.json(
        { error: getUploadTypeErrorMessage(purpose) },
        { status: 400 }
      );
    }

    const maxBytes =
      purpose === "generic"
        ? isBannerVideo
          ? PROFILE_BANNER_VIDEO_MAX_BYTES
          : PROFILE_BANNER_IMAGE_MAX_BYTES
        : getProfileMediaMaxBytes(purpose, mimeType);

    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: getUploadSizeErrorMessage(purpose, mimeType) },
        { status: 413 }
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
    if (isPayloadTooLargeError(error)) {
      return NextResponse.json(
        {
          error: getProfileMediaSizeError("banner", "video/mp4", 413),
        },
        { status: 413 }
      );
    }

    logServerError("upload.route", error);
    return NextResponse.json({ error: "Falha no upload." }, { status: 500 });
  }
}

function normalizePurpose(value: FormDataEntryValue | null): UploadPurpose {
  if (typeof value !== "string") {
    return "generic";
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "banner") {
    return "banner";
  }

  if (normalized === "avatar") {
    return "avatar";
  }

  return "generic";
}

function isPayloadTooLargeError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("413") ||
    message.includes("content too large") ||
    message.includes("payload too large") ||
    message.includes("body exceeded")
  );
}

function getUploadTypeErrorMessage(purpose: UploadPurpose) {
  if (purpose === "generic") {
    return "Arquivo invalido. Envie PNG, JPG, WEBP, GIF, MP4, WebM ou MOV.";
  }

  return getProfileMediaTypeError(purpose);
}

function getUploadSizeErrorMessage(purpose: UploadPurpose, mimeType: string) {
  if (purpose === "generic") {
    return isProfileBannerVideoMimeType(mimeType)
      ? "Arquivo muito grande. Use vídeo até 30MB ou comprima antes de enviar."
      : "Arquivo muito grande. O limite para imagem ou GIF é 15MB.";
  }

  return getProfileMediaSizeError(purpose, mimeType, 413);
}

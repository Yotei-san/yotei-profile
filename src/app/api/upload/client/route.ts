import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import {
  getProfileMediaMaxBytes,
  getProfileMediaTypeError,
  isProfileBannerVideoMimeType,
  isProfileImageMimeType,
  type ProfileMediaPurpose,
} from "@/app/lib/profile-media";
import { logServerError } from "@/app/lib/server-log";

export async function POST(request: Request): Promise<NextResponse> {
  let body: HandleUploadBody;

  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Requisicao de upload invalida." }, { status: 400 });
  }

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sua sessao expirou. Entre novamente para enviar arquivos." },
        { status: 401 }
      );
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const payload = parseClientPayload(clientPayload);
        const mimeType = payload.contentType.toLowerCase();
        const purpose = payload.purpose;
        const isImage = isProfileImageMimeType(mimeType);
        const isVideo = purpose === "banner" && isProfileBannerVideoMimeType(mimeType);

        if (!isImage && !isVideo) {
          throw new Error(getProfileMediaTypeError(purpose));
        }

        const maximumSizeInBytes = getProfileMediaMaxBytes(purpose, mimeType);

        return {
          allowedContentTypes: isVideo
            ? ["video/mp4", "video/webm", "video/quicktime"]
            : ["image/png", "image/jpeg", "image/webp", "image/gif"],
          maximumSizeInBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            uploadType: isVideo ? "video" : "image",
            purpose,
          }),
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    logServerError("upload.client-route", error);
    return NextResponse.json({ error: getUploadClientErrorMessage(error) }, { status: 400 });
  }
}

function parseClientPayload(clientPayload: string | null) {
  if (!clientPayload) {
    throw new Error("Payload de upload ausente.");
  }

  let payload: unknown;

  try {
    payload = JSON.parse(clientPayload);
  } catch {
    throw new Error("Payload de upload invalido.");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Payload de upload invalido.");
  }

  const purpose =
    "purpose" in payload && typeof payload.purpose === "string"
      ? payload.purpose.trim().toLowerCase()
      : "";
  const contentType =
    "contentType" in payload && typeof payload.contentType === "string"
      ? payload.contentType.trim()
      : "";

  if (purpose !== "avatar" && purpose !== "banner") {
    throw new Error("Tipo de upload invalido.");
  }

  if (!contentType) {
    throw new Error("Arquivo sem tipo valido.");
  }

  return {
    purpose,
    contentType,
  } satisfies {
    purpose: ProfileMediaPurpose;
    contentType: string;
  };
}

function getUploadClientErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Falha ao iniciar upload direto.";
}

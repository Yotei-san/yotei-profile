import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const isVideo =
          pathname.toLowerCase().endsWith(".mp4") ||
          pathname.toLowerCase().endsWith(".webm") ||
          pathname.toLowerCase().endsWith(".mov");

        return {
          allowedContentTypes: isVideo
            ? ["video/mp4", "video/webm", "video/quicktime"]
            : ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            uploadType: isVideo ? "video" : "image",
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Upload concluído:", blob.url, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[CLIENT_UPLOAD_ROUTE]", error);
    return NextResponse.json(
      { error: "Falha ao iniciar upload do Blob." },
      { status: 400 }
    );
  }
}
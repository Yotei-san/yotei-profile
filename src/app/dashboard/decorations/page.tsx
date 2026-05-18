import Link from "next/link";
import {
  DashboardNotice,
  DashboardPageHeader,
  dashboardButtonStyle,
  dashboardPageStyle,
} from "@/app/dashboard/components/DashboardUI";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import DecorationManager from "./DecorationManager";
import {
  clearSelectedDecoration,
  createUploadedDecoration,
  saveSelectedDecoration,
} from "./actions";

type PageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

function getNotice(type: "success" | "error", value?: string) {
  if (!value) return null;

  if (type === "success") {
    if (value === "decoration-saved") return "Frame saved to your profile.";
    if (value === "decoration-cleared") return "Frame removed from your profile.";
    if (value === "decoration-uploaded") return "Frame created and applied successfully.";
    return "Action completed.";
  }

  if (value === "missing-decoration") return "Select a frame before saving.";
  if (value === "missing-upload-fields") return "Add a name and media source before creating a frame.";
  return "Unable to complete that action right now.";
}

export default async function DecorationsPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  const params = (await searchParams) ?? {};

  const me = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      selectedDecorationId: true,
      selectedDecorationScale: true,
      selectedDecorationOffsetX: true,
      selectedDecorationOffsetY: true,
    },
  });

  if (!me) {
    throw new Error("User not found.");
  }

  const decorations = await prisma.decoration.findMany({
    where: { isPublic: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      previewUrl: true,
      posterUrl: true,
      mediaType: true,
      overlayScale: true,
      overlayOffsetY: true,
    },
  });

  return (
    <main style={dashboardPageStyle}>
      <DashboardPageHeader
        eyebrow="Decorations studio"
        title="Fine-tune the frame wrapped around your avatar."
        description="Preview, align, and save profile decorations without changing the existing Yotei system or asset flow."
        actions={
          <>
            <Link href="/dashboard" style={dashboardButtonStyle("secondary")}>
              Back to dashboard
            </Link>
            <Link href={`/${me.username}`} target="_blank" style={dashboardButtonStyle("primary")}>
              Open profile
            </Link>
          </>
        }
      />

      {getNotice("success", params.success) ? (
        <DashboardNotice tone="success">
          {getNotice("success", params.success)}
        </DashboardNotice>
      ) : null}

      {getNotice("error", params.error) ? (
        <DashboardNotice tone="error">
          {getNotice("error", params.error)}
        </DashboardNotice>
      ) : null}

      <DecorationManager
        decorations={decorations}
        selectedDecorationId={me.selectedDecorationId}
        selectedScale={me.selectedDecorationScale ?? 165}
        selectedOffsetX={me.selectedDecorationOffsetX ?? 0}
        selectedOffsetY={me.selectedDecorationOffsetY ?? 0}
        saveAction={saveSelectedDecoration}
        clearAction={clearSelectedDecoration}
        uploadAction={createUploadedDecoration}
        avatarUrl={me.avatarUrl}
        displayName={me.displayName || me.username}
        username={me.username}
      />
    </main>
  );
}

import Link from "next/link";
import {
  DashboardNotice,
  DashboardPageHeader,
  dashboardButtonStyle,
  dashboardPageStyle,
} from "@/app/dashboard/components/DashboardUI";
import { requireUser } from "@/app/lib/auth";
import { ensureStarterDecorations } from "@/app/lib/decoration-storage";
import {
  resolveEquippedDecoration,
  toDecorationCatalogItem,
} from "@/app/lib/decorations";
import { normalizeProfileAura, normalizeProfileMood } from "@/app/lib/profile-presence";
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
    if (value === "decoration-saved") return "Decoration equipped successfully.";
    if (value === "decoration-cleared") return "Decoration removed from your profile.";
    if (value === "decoration-uploaded") return "Custom decoration created and applied successfully.";
    return "Action completed.";
  }

  if (value === "missing-decoration") return "Select a frame before saving.";
  if (value === "invalid-decoration") return "That decoration could not be validated.";
  if (value === "premium-required") return "Premium is required to equip that decoration.";
  if (value === "owner-required") return "That decoration is reserved for admins and owners.";
  if (value === "missing-upload-fields") return "Add a name and media source before creating a frame.";
  return "Unable to complete that action right now.";
}

export default async function DecorationsPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  const params = (await searchParams) ?? {};
  await ensureStarterDecorations();

  const me = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      themeColor: true,
      profileMood: true,
      profileAura: true,
      role: true,
      plan: true,
      premiumBadge: true,
      premiumUntil: true,
      subscriptionStatus: true,
      selectedDecorationId: true,
      selectedDecorationScale: true,
      selectedDecorationOffsetX: true,
      selectedDecorationOffsetY: true,
      selectedDecoration: {
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
          createdByUserId: true,
        },
      },
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
      createdByUserId: true,
    },
  });

  const catalog = decorations.map((item) => toDecorationCatalogItem(item, me));
  const equippedDecoration = resolveEquippedDecoration(me.selectedDecoration, me);

  return (
    <main style={dashboardPageStyle}>
      <DashboardPageHeader
        eyebrow="Decorations studio"
        title="Equip living avatar frames with lightweight motion."
        description="Choose a collectible decoration, preview it with your current mood and aura, and equip it with performance-first visuals."
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
        decorations={catalog}
        selectedDecorationId={me.selectedDecorationId}
        selectedScale={me.selectedDecorationScale ?? 165}
        selectedOffsetX={me.selectedDecorationOffsetX ?? 0}
        selectedOffsetY={me.selectedDecorationOffsetY ?? 0}
        equippedDecoration={equippedDecoration}
        saveAction={saveSelectedDecoration}
        clearAction={clearSelectedDecoration}
        uploadAction={createUploadedDecoration}
        avatarUrl={me.avatarUrl}
        displayName={me.displayName || me.username}
        username={me.username}
        themeColor={me.themeColor || "#f472b6"}
        profileMood={normalizeProfileMood(me.profileMood)}
        profileAura={normalizeProfileAura(me.profileAura)}
      />
    </main>
  );
}

import type { CSSProperties } from "react";
import Link from "next/link";
import FormActionButton from "@/app/components/FormActionButton";
import {
  DashboardEmptyState,
  DashboardNotice,
  DashboardPageHeader,
  DashboardSectionHeading,
  dashboardAutoGridStyle,
  dashboardButtonStyle,
  dashboardFieldGridStyle,
  dashboardInputStyle,
  dashboardLabelStyle,
  dashboardListItemStyle,
  dashboardMutedTextStyle,
  dashboardPageStyle,
  dashboardSurfaceStyle,
  dashboardTagStyle,
} from "@/app/dashboard/components/DashboardUI";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getLinkPlatform } from "@/app/lib/link-icons";
import { createLink, deleteLink, updateLink } from "./actions";

type PageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

function getMessage(type: "success" | "error", value?: string) {
  if (!value) return null;

  if (type === "success") {
    if (value === "created") return "Link created successfully.";
    if (value === "updated") return "Link updated successfully.";
    if (value === "deleted") return "Link removed successfully.";
    return "Action completed.";
  }

  if (value === "missing-url") return "Add a valid URL before saving.";
  if (value === "invalid-update") return "Unable to update that link.";
  if (value === "invalid-delete") return "Unable to remove that link.";
  if (value === "link-not-found") return "That link could not be found.";
  return "Unable to complete that action right now.";
}

export default async function LinksPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  const params = (await searchParams) ?? {};

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      username: true,
      displayName: true,
      links: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          url: true,
          position: true,
        },
      },
    },
  });

  const resolvedUser = user ?? (await redirectWithClearedSession());
  const successMessage = getMessage("success", params.success);
  const errorMessage = getMessage("error", params.error);

  return (
    <main style={dashboardPageStyle}>
      <DashboardPageHeader
        eyebrow="Links manager"
        title="Shape the actions visitors take from your profile."
        description="Keep every profile destination aligned, readable, and easy to update across mobile and desktop."
        actions={
          <>
            <Link href="/dashboard/analytics" style={dashboardButtonStyle("secondary")}>
              View analytics
            </Link>
            <Link
              href={`/${resolvedUser.username}`}
              style={dashboardButtonStyle("primary")}
              target="_blank"
            >
              Open profile
            </Link>
          </>
        }
        aside={
          <div style={summaryCardStyle}>
            <div style={dashboardTagStyle("violet")}>{resolvedUser.links.length} links</div>
            <div style={{ display: "grid", gap: "6px" }}>
              <div style={summaryValueStyle}>Keep your profile actionable.</div>
              <div style={dashboardMutedTextStyle}>
                Add social destinations, projects, communities, and your most important calls to action.
              </div>
            </div>
          </div>
        }
      />

      {successMessage ? <DashboardNotice tone="success">{successMessage}</DashboardNotice> : null}
      {errorMessage ? <DashboardNotice tone="error">{errorMessage}</DashboardNotice> : null}

      <section style={dashboardAutoGridStyle(320)}>
        <form action={createLink} style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Create"
            title="Add a new link"
            description="Title is optional. Platform details are inferred automatically from the URL."
          />

          <div style={dashboardFieldGridStyle}>
            <label style={dashboardLabelStyle}>
              Title
              <input
                type="text"
                name="title"
                placeholder="Discord, portfolio, shop..."
                style={dashboardInputStyle}
              />
            </label>

            <label style={dashboardLabelStyle}>
              URL
              <input
                type="text"
                name="url"
                placeholder="https://discord.gg/yourserver"
                style={dashboardInputStyle}
                required
              />
            </label>

            <FormActionButton
              idleLabel="Create link"
              pendingLabel="Creating link..."
              style={dashboardButtonStyle("primary", { fullWidth: true })}
            />
          </div>
        </form>

        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Inventory"
            title="Current links"
            description="Edit titles and destinations without losing the structure already attached to your profile."
          />

          <div style={{ display: "grid", gap: "14px" }}>
            {resolvedUser.links.length > 0 ? (
              resolvedUser.links.map((item, index) => {
                const platform = getLinkPlatform(item.url, item.title);
                const PlatformIcon = platform.icon;

                return (
                  <article key={item.id} style={dashboardListItemStyle}>
                    <div style={cardHeaderStyle}>
                      <div style={cardIdentityStyle}>
                        <div style={iconWrapStyle}>
                          <PlatformIcon size={20} color={platform.color} />
                        </div>
                        <div style={{ minWidth: 0, display: "grid", gap: "4px" }}>
                          <div style={cardTitleStyle}>
                            {item.title || platform.name}
                          </div>
                          <div style={dashboardMutedTextStyle}>{platform.name}</div>
                        </div>
                      </div>

                      <div style={dashboardTagStyle("pink")}>Link {index + 1}</div>
                    </div>

                    <form action={updateLink} style={dashboardFieldGridStyle}>
                      <input type="hidden" name="linkId" value={item.id} readOnly />

                      <label style={dashboardLabelStyle}>
                        Title
                        <input
                          type="text"
                          name="title"
                          defaultValue={item.title || ""}
                          placeholder="Link title"
                          style={dashboardInputStyle}
                        />
                      </label>

                      <label style={dashboardLabelStyle}>
                        URL
                        <input
                          type="text"
                          name="url"
                          defaultValue={item.url}
                          placeholder="https://..."
                          style={dashboardInputStyle}
                          required
                        />
                      </label>

                      <FormActionButton
                        idleLabel="Save changes"
                        pendingLabel="Saving changes..."
                        style={dashboardButtonStyle("secondary", { fullWidth: true })}
                      />
                    </form>

                    <form action={deleteLink}>
                      <input type="hidden" name="linkId" value={item.id} readOnly />
                      <FormActionButton
                        idleLabel="Remove link"
                        pendingLabel="Removing link..."
                        style={dashboardButtonStyle("danger", { fullWidth: true })}
                      />
                    </form>
                  </article>
                );
              })
            ) : (
              <DashboardEmptyState
                title="No links yet"
                description="Your public profile is ready for actions, but it still needs its first destination. Add one link to start turning visits into clicks."
              />
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

const summaryCardStyle: CSSProperties = {
  ...dashboardSurfaceStyle,
  padding: "20px",
  gap: "14px",
};

const summaryValueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: 900,
  lineHeight: 1.2,
};

const cardHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const cardIdentityStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
};

const iconWrapStyle: CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(244,114,182,0.10)",
  border: "1px solid rgba(244,114,182,0.18)",
  flexShrink: 0,
};

const cardTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 800,
  overflowWrap: "anywhere",
};

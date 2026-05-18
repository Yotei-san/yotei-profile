import type { CSSProperties } from "react";
import Link from "next/link";
import FormActionButton from "@/app/components/FormActionButton";
import {
  DashboardNotice,
  DashboardPageHeader,
  DashboardSectionHeading,
  dashboardAutoGridStyle,
  dashboardButtonStyle,
  dashboardFieldGridStyle,
  dashboardInputStyle,
  dashboardLabelStyle,
  dashboardMutedTextStyle,
  dashboardPageStyle,
  dashboardSurfaceStyle,
  dashboardTagStyle,
  dashboardTextareaStyle,
} from "@/app/dashboard/components/DashboardUI";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getMediaKind } from "@/app/lib/profile-media";
import { saveProfileSettings } from "./actions";
import ProfileMediaUploader from "./ProfileMediaUploader";

const PROFILE_LAYOUT_OPTIONS = [
  {
    key: "default",
    name: "Default",
    description: "Top banner, featured avatar, and a clean premium list of links.",
  },
  {
    key: "modern",
    name: "Modern",
    description: "Cinematic premium styling with stronger contrast and presence.",
  },
  {
    key: "simplistic",
    name: "Simplistic",
    description: "Minimal structure focused on reading and quick scanning.",
  },
  {
    key: "portfolio",
    name: "Portfolio",
    description: "A more professional presentation for creators, devs, and projects.",
  },
] as const;

type PageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function ProfileSettingsPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  const params = (await searchParams) ?? {};

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      themeColor: true,
      profileLayout: true,
    },
  });

  const resolvedUser = user ?? (await redirectWithClearedSession());
  const bannerKind = getMediaKind(resolvedUser.bannerUrl || "");
  const selectedProfileLayout = normalizeProfileLayout(resolvedUser.profileLayout);

  return (
    <main style={dashboardPageStyle}>
      <DashboardPageHeader
        eyebrow="Profile editor"
        title="Refine the public identity visitors see first."
        description="Update profile copy, theme color, media, and layout while keeping a real preview of the final presentation."
        actions={
          <>
            <Link href="/dashboard" style={dashboardButtonStyle("secondary")}>
              Back to dashboard
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
            <div style={dashboardTagStyle("pink")}>{selectedProfileLayout} layout</div>
            <div style={{ display: "grid", gap: "8px" }}>
              <div style={summaryValueStyle}>
                {resolvedUser.displayName || resolvedUser.username}
              </div>
              <div style={dashboardMutedTextStyle}>@{resolvedUser.username}</div>
              <div style={dashboardMutedTextStyle}>
                {resolvedUser.bio || "Add a short bio to make the profile feel more complete."}
              </div>
            </div>
          </div>
        }
      />

      {params.success === "saved" ? (
        <DashboardNotice tone="success">Profile saved successfully.</DashboardNotice>
      ) : null}
      {params.error === "save-failed" ? (
        <DashboardNotice tone="error">
          Unable to save the profile right now.
        </DashboardNotice>
      ) : null}

      <section style={dashboardAutoGridStyle(320)}>
        <ProfileMediaUploader
          type="avatar"
          currentUrl={resolvedUser.avatarUrl}
          themeColor={resolvedUser.themeColor}
        />

        <ProfileMediaUploader
          type="banner"
          currentUrl={resolvedUser.bannerUrl}
          themeColor={resolvedUser.themeColor}
        />
      </section>

      <section style={dashboardAutoGridStyle(340)}>
        <form action={saveProfileSettings} style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Core content"
            title="Profile content and layout"
            description="Keep your main identity, description, and layout choice aligned across every device size."
          />

          <div style={dashboardFieldGridStyle}>
            <label style={dashboardLabelStyle}>
              Display name
              <input
                type="text"
                name="displayName"
                defaultValue={resolvedUser.displayName || ""}
                placeholder="Your visible name"
                style={dashboardInputStyle}
              />
            </label>

            <label style={dashboardLabelStyle}>
              Bio
              <textarea
                name="bio"
                defaultValue={resolvedUser.bio || ""}
                placeholder="Tell visitors what you do."
                rows={5}
                style={dashboardTextareaStyle}
              />
            </label>

            <label style={dashboardLabelStyle}>
              Theme color
              <input
                type="text"
                name="themeColor"
                defaultValue={resolvedUser.themeColor || "#f472b6"}
                placeholder="#f472b6"
                style={dashboardInputStyle}
              />
            </label>

            <div style={{ display: "grid", gap: "12px" }}>
              <DashboardSectionHeading
                eyebrow="Layout"
                title="Choose profile layout"
                description="Selected state is always visible so you can compare styles quickly."
              />

              <div style={layoutGridStyle}>
                {PROFILE_LAYOUT_OPTIONS.map((layout) => {
                  const isSelected = selectedProfileLayout === layout.key;

                  return (
                    <label key={layout.key} className="layout-option" style={layoutCardStyle}>
                      <input
                        className="layout-option__input"
                        type="radio"
                        name="profileLayout"
                        value={layout.key}
                        defaultChecked={isSelected}
                        style={layoutInputStyle}
                      />

                      <div style={layoutCardBodyStyle} className="layout-option__body">
                        <div
                          style={{
                            ...layoutPreviewStyle,
                            ...(layout.key === "default"
                              ? defaultPreviewStyle
                              : layout.key === "modern"
                                ? modernPreviewStyle
                                : layout.key === "simplistic"
                                  ? simplisticPreviewStyle
                                  : portfolioPreviewStyle),
                          }}
                          className="layout-option__preview"
                        >
                          <div style={previewBannerStyle} />
                          <div
                            style={{
                              ...previewAvatarStyle,
                              ...(layout.key === "simplistic"
                                ? previewAvatarSmallStyle
                                : layout.key === "portfolio"
                                  ? previewAvatarSquareStyle
                                  : null),
                            }}
                          />
                          <div
                            style={{
                              ...previewLineStyle,
                              marginTop: layout.key === "portfolio" ? "18px" : "24px",
                              width: layout.key === "simplistic" ? "46%" : "56%",
                            }}
                          />
                          <div
                            style={{
                              ...previewLineStyle,
                              width: layout.key === "portfolio" ? "78%" : "68%",
                              opacity: 0.72,
                            }}
                          />
                          <div style={previewLinksColumnStyle}>
                            <div style={previewLinkPillStyle} />
                            <div style={previewLinkPillStyle} />
                            <div
                              style={{
                                ...previewLinkPillStyle,
                                width: layout.key === "simplistic" ? "62%" : "78%",
                              }}
                            />
                          </div>
                        </div>

                        <div style={{ display: "grid", gap: "6px" }}>
                          <div style={layoutCardHeaderStyle}>
                            <span>{layout.name}</span>
                            <div style={layoutCheckWrapStyle}>
                              <span
                                className="layout-option__check layout-option__check--idle"
                                style={layoutCheckStyle}
                              >
                                Select
                              </span>
                              <span
                                className="layout-option__check layout-option__check--active"
                                style={{ ...layoutCheckStyle, ...layoutCheckSelectedStyle }}
                              >
                                Current
                              </span>
                            </div>
                          </div>
                          <div style={layoutCardDescriptionStyle}>{layout.description}</div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <FormActionButton
              idleLabel="Save profile settings"
              pendingLabel="Saving profile..."
              style={dashboardButtonStyle("primary", { fullWidth: true })}
            />
          </div>
        </form>

        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Preview"
            title="Live profile preview"
            description="A condensed view of how your chosen theme and content will feel once published."
          />

          <div style={previewShellStyle}>
            <div
              style={{
                height: "180px",
                position: "relative",
                overflow: "hidden",
                background: `linear-gradient(135deg, ${resolvedUser.themeColor || "#f472b6"}, rgba(0,0,0,0.2))`,
              }}
            >
              {resolvedUser.bannerUrl ? (
                bannerKind === "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={bannerMediaStyle}
                  >
                    <source src={resolvedUser.bannerUrl} />
                  </video>
                ) : (
                  <img
                    src={resolvedUser.bannerUrl}
                    alt="Banner preview"
                    style={bannerMediaStyle}
                  />
                )
              ) : null}

              <div style={previewOverlayStyle} />
            </div>

            <div style={previewContentStyle}>
              <img
                src={resolvedUser.avatarUrl || "https://placehold.co/200x200?text=Y"}
                alt={resolvedUser.displayName || resolvedUser.username}
                style={{
                  width: "104px",
                  height: "104px",
                  borderRadius: "999px",
                  objectFit: "cover",
                  border: `4px solid ${resolvedUser.themeColor || "#f472b6"}`,
                  backgroundColor: "#111",
                }}
              />

              <div style={previewNameStyle}>
                {resolvedUser.displayName || resolvedUser.username}
              </div>
              <div style={previewHandleStyle}>@{resolvedUser.username}</div>
              <div style={dashboardTagStyle("pink")}>
                Saved layout: {selectedProfileLayout}
              </div>

              <div style={previewBioStyle}>
                {resolvedUser.bio || "Your bio will appear here once you add it."}
              </div>
            </div>
          </div>
        </section>
      </section>

      <style>{`
        .layout-option {
          display: block;
          min-width: 0;
          cursor: pointer;
        }

        .layout-option__body {
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease;
        }

        .layout-option__preview {
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        .layout-option:hover .layout-option__body,
        .layout-option:focus-within .layout-option__body {
          transform: translateY(-3px);
          border-color: rgba(244, 114, 182, 0.18);
          box-shadow:
            0 18px 36px rgba(0, 0, 0, 0.22),
            0 0 0 1px rgba(244, 114, 182, 0.1);
        }

        .layout-option:hover .layout-option__preview,
        .layout-option:focus-within .layout-option__preview {
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-1px);
        }

        .layout-option:active .layout-option__body {
          transform: translateY(0) scale(0.988);
        }

        .layout-option__input:checked + .layout-option__body {
          border-color: rgba(244, 114, 182, 0.28);
          box-shadow:
            0 0 0 1px rgba(244, 114, 182, 0.1),
            0 18px 36px rgba(244, 114, 182, 0.1);
        }

        .layout-option__input:checked + .layout-option__body .layout-option__preview {
          border-color: rgba(244, 114, 182, 0.18);
          box-shadow: inset 0 0 0 1px rgba(244, 114, 182, 0.08);
        }

        .layout-option__input:checked + .layout-option__body .layout-option__check--idle {
          display: none;
        }

        .layout-option__input:not(:checked) + .layout-option__body .layout-option__check--active {
          display: none;
        }
      `}</style>
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

const layoutGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: "12px",
};

const layoutCardStyle: CSSProperties = {
  cursor: "pointer",
};

const layoutInputStyle: CSSProperties = {
  position: "absolute",
  opacity: 0,
  pointerEvents: "none",
};

const layoutCardBodyStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  padding: "14px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(20,20,24,0.96), rgba(12,12,16,0.96))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
};

const layoutPreviewStyle: CSSProperties = {
  minHeight: "116px",
  borderRadius: "16px",
  padding: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  overflow: "hidden",
  position: "relative",
  display: "grid",
  alignContent: "start",
  gap: "8px",
};

const defaultPreviewStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(25,18,28,0.96), rgba(8,8,12,0.96))",
};

const modernPreviewStyle: CSSProperties = {
  background:
    "radial-gradient(circle at top left, rgba(244,114,182,0.20), transparent 28%), linear-gradient(180deg, rgba(18,18,26,0.96), rgba(8,8,12,0.96))",
};

const simplisticPreviewStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(16,16,18,0.98), rgba(10,10,12,0.98))",
};

const portfolioPreviewStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(17,24,39,0.98), rgba(7,10,16,0.98))",
};

const previewBannerStyle: CSSProperties = {
  height: "24px",
  borderRadius: "10px",
  background:
    "linear-gradient(90deg, rgba(244,114,182,0.52), rgba(96,165,250,0.28))",
};

const previewAvatarStyle: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.85)",
  border: "2px solid rgba(8,8,12,0.6)",
  marginTop: "-10px",
};

const previewAvatarSmallStyle: CSSProperties = {
  width: "22px",
  height: "22px",
  marginTop: "2px",
};

const previewAvatarSquareStyle: CSSProperties = {
  width: "28px",
  height: "28px",
  borderRadius: "10px",
  marginTop: "2px",
};

const previewLineStyle: CSSProperties = {
  height: "7px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.16)",
};

const previewLinksColumnStyle: CSSProperties = {
  display: "grid",
  gap: "6px",
  marginTop: "4px",
};

const previewLinkPillStyle: CSSProperties = {
  height: "18px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.08)",
  width: "100%",
};

const layoutCardHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  alignItems: "center",
  fontWeight: 800,
  color: "#ffffff",
};

const layoutCheckWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  minWidth: "84px",
};

const layoutCardDescriptionStyle: CSSProperties = {
  color: "#a3a3a3",
  fontSize: "13px",
  lineHeight: 1.6,
};

const layoutCheckStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "26px",
  padding: "0 10px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#d4d4d8",
  fontSize: "11px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const layoutCheckSelectedStyle: CSSProperties = {
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
};

const previewShellStyle: CSSProperties = {
  borderRadius: "24px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.07)",
  background: "#0b0b0b",
};

const bannerMediaStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  pointerEvents: "none",
};

const previewOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.32) 52%, rgba(0,0,0,0.56) 100%)",
  pointerEvents: "none",
};

const previewContentStyle: CSSProperties = {
  marginTop: "-52px",
  padding: "0 20px 20px",
  display: "grid",
  gap: "12px",
};

const previewNameStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: 900,
  lineHeight: 1.05,
};

const previewHandleStyle: CSSProperties = {
  color: "#9ca3af",
  fontSize: "14px",
  fontWeight: 700,
};

const previewBioStyle: CSSProperties = {
  color: "#d4d4d8",
  lineHeight: 1.7,
  backgroundColor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "16px",
  padding: "14px 16px",
};

function normalizeProfileLayout(value: string | null | undefined) {
  if (
    value === "default" ||
    value === "modern" ||
    value === "simplistic" ||
    value === "portfolio"
  ) {
    return value;
  }

  return "modern";
}

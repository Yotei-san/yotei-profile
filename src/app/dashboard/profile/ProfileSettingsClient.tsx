"use client";

import type { ComponentProps, CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DashboardNotice,
  DashboardPageHeader,
  dashboardAutoGridStyle,
  dashboardButtonStyle,
  dashboardMutedTextStyle,
  dashboardSurfaceStyle,
  dashboardTagStyle,
} from "@/app/dashboard/components/DashboardUI";
import { useI18n } from "@/app/components/I18nProvider";
import type {
  PublicProfileHeroPill,
  PublicProfileRenderUser,
} from "@/app/[username]/PublicProfileRenderer";
import type { PublicProfileLayout } from "@/app/[username]/ProfileLayoutVariants";
import type { PublicSocialBlock } from "@/app/[username]/SocialPresenceSection";
import type { ProfileComposition } from "@/app/lib/profile-composition";
import type {
  ProfileBackgroundIntensity,
  ProfileBannerStyle,
  ProfileCardStyle,
  ProfileCornerStyle,
  ProfileDensity,
  ProfileGlassIntensity,
  ProfileIntroMode,
  ProfileMotionLevel,
  ProfileNameEffect,
} from "@/app/lib/profile-customization";
import type { ProfileMusicData } from "@/app/lib/profile-music";
import type { ProfileAura, ProfileMood } from "@/app/lib/profile-presence";
import type { ProfileScene } from "@/app/lib/profile-scenes";
import { getMediaKind } from "@/app/lib/profile-media";
import {
  getProfileLayoutName,
} from "./profileEditorI18n";
import ProfileLayoutExperience from "./ProfileLayoutExperience";
import ProfileMediaUploader from "./ProfileMediaUploader";

type Props = {
  username: string;
  displayName: string;
  bio: string | null;
  themeColor: string | null;
  savedLayout: PublicProfileLayout;
  showSavedNotice: boolean;
  showSaveFailedNotice: boolean;
  initialDisplayName: string;
  initialBio: string;
  initialThemeColor: string;
  savedMood: ProfileMood;
  savedAura: ProfileAura;
  savedScene: ProfileScene;
  savedNameEffects: ProfileNameEffect[];
  savedBackgroundIntensity: ProfileBackgroundIntensity;
  savedGlassIntensity: ProfileGlassIntensity;
  savedBannerStyle: ProfileBannerStyle;
  savedIntroMode: ProfileIntroMode;
  savedDensity: ProfileDensity;
  savedCardStyle: ProfileCardStyle;
  savedCornerStyle: ProfileCornerStyle;
  savedMotionLevel: ProfileMotionLevel;
  savedComposition: ProfileComposition;
  initialMusic: ProfileMusicData;
  previewUser: PublicProfileRenderUser;
  bannerKind: "image" | "video" | "unknown";
  avatarInitials: string;
  decorationScale: number;
  decorationOffsetX: number;
  decorationOffsetY: number;
  featuredBadges: PropsFromLayout["featuredBadges"];
  extraBadgeCount: number;
  allBadges: PropsFromLayout["allBadges"];
  heroPills: PublicProfileHeroPill[];
  likes: number;
  dislikes: number;
  views: number;
  initialCommentCount: number;
  canComment: boolean;
  isOwnProfile: boolean;
  socialBlocks: PublicSocialBlock[];
  hasPremiumAccess: boolean;
};

type PropsFromLayout = ComponentProps<typeof ProfileLayoutExperience>;

export default function ProfileSettingsClient({
  username,
  displayName,
  bio,
  themeColor,
  savedLayout,
  showSavedNotice,
  showSaveFailedNotice,
  ...layoutProps
}: Props) {
  const { t } = useI18n();
  const [previewUser, setPreviewUser] = useState(layoutProps.previewUser);
  const [bannerKind, setBannerKind] = useState(layoutProps.bannerKind);
  const layoutLabel = getProfileLayoutName(t, savedLayout, savedLayout);

  useEffect(() => {
    setPreviewUser(layoutProps.previewUser);
  }, [layoutProps.previewUser]);

  useEffect(() => {
    setBannerKind(layoutProps.bannerKind);
  }, [layoutProps.bannerKind]);

  function handleMediaSaved(type: "avatar" | "banner", url: string | null) {
    setPreviewUser((current) => ({
      ...current,
      avatarUrl: type === "avatar" ? url : current.avatarUrl,
      bannerUrl: type === "banner" ? url : current.bannerUrl,
    }));

    if (type === "banner") {
      setBannerKind(getMediaKind(url || ""));
    }
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow={t("dashboard.profile.page.eyebrow")}
        title={t("dashboard.profile.page.title")}
        description={t("dashboard.profile.page.description")}
        actions={
          <>
            <Link href="/dashboard" style={dashboardButtonStyle("secondary")}>
              {t("dashboard.profile.page.backToDashboard")}
            </Link>
            <Link
              href={`/${username}`}
              style={dashboardButtonStyle("primary")}
              target="_blank"
            >
              {t("dashboard.profile.page.openProfile")}
            </Link>
          </>
        }
        aside={
          <div style={summaryCardStyle}>
            <div style={dashboardTagStyle("pink")}>
              {t("dashboard.profile.page.layoutBadge", { layout: layoutLabel })}
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              <div style={summaryValueStyle}>{displayName}</div>
              <div style={dashboardMutedTextStyle}>@{username}</div>
              <div style={dashboardMutedTextStyle}>
                {bio || t("dashboard.profile.page.summaryBioFallback")}
              </div>
            </div>
          </div>
        }
      />

      {showSavedNotice ? (
        <DashboardNotice tone="success">
          {t("dashboard.profile.page.savedNotice")}
        </DashboardNotice>
      ) : null}
      {showSaveFailedNotice ? (
        <DashboardNotice tone="error">
          {t("dashboard.profile.page.saveFailedNotice")}
        </DashboardNotice>
      ) : null}

      <section style={dashboardAutoGridStyle(320)}>
        <ProfileMediaUploader
          type="avatar"
          currentUrl={previewUser.avatarUrl}
          themeColor={themeColor}
          onSavedUrlChange={(url) => handleMediaSaved("avatar", url)}
        />

        <ProfileMediaUploader
          type="banner"
          currentUrl={previewUser.bannerUrl}
          themeColor={themeColor}
          onSavedUrlChange={(url) => handleMediaSaved("banner", url)}
        />
      </section>

      <ProfileLayoutExperience
        savedLayout={savedLayout}
        {...layoutProps}
        previewUser={previewUser}
        bannerKind={bannerKind}
      />
    </>
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

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
  dashboardListItemStyle,
  dashboardMutedTextStyle,
  dashboardPageStyle,
  dashboardSurfaceStyle,
  dashboardTagStyle,
} from "@/app/dashboard/components/DashboardUI";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  updateDisplayName,
  updatePassword,
  updateUsername,
} from "./actions";

type SettingsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

function getMessageFromCode(
  type: "success" | "error",
  code: string | undefined
) {
  if (!code) return null;

  if (type === "success") {
    switch (code) {
      case "username-updated":
        return "Username updated successfully.";
      case "display-name-updated":
        return "Display name updated successfully.";
      case "password-updated":
        return "Password updated successfully.";
      default:
        return "Action completed successfully.";
    }
  }

  switch (code) {
    case "invalid-username":
      return "Username must be 3 to 20 characters using letters, numbers, underscores, or hyphens.";
    case "username-taken":
      return "That username is already in use.";
    case "same-username":
      return "That is already your current username.";
    case "empty-display-name":
      return "Display name cannot be empty.";
    case "wrong-password":
      return "Current password is incorrect.";
    case "password-too-short":
      return "New password must be at least 8 characters.";
    case "password-mismatch":
      return "Password confirmation does not match.";
    case "same-password":
      return "New password must be different from the current password.";
    case "user-not-found":
      return "User not found.";
    default:
      return "Unable to complete that action right now.";
  }
}

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const authUser = await requireUser();
  const params = (await searchParams) ?? {};

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      username: true,
      displayName: true,
      email: true,
      plan: true,
      premiumUntil: true,
    },
  });

  const resolvedUser = user ?? (await redirectWithClearedSession());
  const successMessage = getMessageFromCode("success", params.success);
  const errorMessage = getMessageFromCode("error", params.error);

  return (
    <main style={dashboardPageStyle}>
      <DashboardPageHeader
        eyebrow="Account settings"
        title="Manage the identity behind your profile."
        description="Keep your public handle, display name, and account security aligned without leaving the dashboard."
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
            <div style={dashboardTagStyle(resolvedUser.plan === "premium" ? "pink" : "violet")}>
              {resolvedUser.plan === "premium" ? "Premium" : "Free"}
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              <div style={summaryNameStyle}>
                {resolvedUser.displayName || resolvedUser.username}
              </div>
              <div style={summaryHandleStyle}>@{resolvedUser.username}</div>
              <div style={dashboardMutedTextStyle}>{resolvedUser.email}</div>
            </div>
          </div>
        }
      />

      {successMessage ? <DashboardNotice tone="success">{successMessage}</DashboardNotice> : null}
      {errorMessage ? <DashboardNotice tone="error">{errorMessage}</DashboardNotice> : null}

      <section style={dashboardAutoGridStyle(320)}>
        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Public handle"
            title="Username"
            description="This controls the public URL and the handle shown across your profile."
          />

          <form action={updateUsername} style={dashboardFieldGridStyle}>
            <label style={dashboardLabelStyle}>
              New username
              <input
                name="username"
                type="text"
                defaultValue={resolvedUser.username}
                maxLength={20}
                required
                style={dashboardInputStyle}
              />
            </label>

            <FormActionButton
              idleLabel="Update username"
              pendingLabel="Updating username..."
              style={dashboardButtonStyle("primary", { fullWidth: true })}
            />
          </form>
        </section>

        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Display"
            title="Display name"
            description="Use a clean display name for the hero area and social identity."
          />

          <form action={updateDisplayName} style={dashboardFieldGridStyle}>
            <label style={dashboardLabelStyle}>
              Display name
              <input
                name="displayName"
                type="text"
                defaultValue={resolvedUser.displayName ?? resolvedUser.username}
                maxLength={32}
                required
                style={dashboardInputStyle}
              />
            </label>

            <FormActionButton
              idleLabel="Update display name"
              pendingLabel="Updating display name..."
              style={dashboardButtonStyle("secondary", { fullWidth: true })}
            />
          </form>
        </section>
      </section>

      <section style={dashboardAutoGridStyle(320)}>
        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Security"
            title="Password"
            description="Update your password with current-password confirmation before changes are saved."
          />

          <form action={updatePassword} style={dashboardFieldGridStyle}>
            <label style={dashboardLabelStyle}>
              Current password
              <input
                name="currentPassword"
                type="password"
                required
                style={dashboardInputStyle}
              />
            </label>

            <label style={dashboardLabelStyle}>
              New password
              <input
                name="newPassword"
                type="password"
                minLength={8}
                required
                style={dashboardInputStyle}
              />
            </label>

            <label style={dashboardLabelStyle}>
              Confirm new password
              <input
                name="confirmPassword"
                type="password"
                minLength={8}
                required
                style={dashboardInputStyle}
              />
            </label>

            <FormActionButton
              idleLabel="Change password"
              pendingLabel="Changing password..."
              style={dashboardButtonStyle("primary", { fullWidth: true })}
            />
          </form>
        </section>

        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Account summary"
            title="Current account state"
            description="A quick snapshot of the values currently powering your dashboard identity."
          />

          <div style={infoGridStyle}>
            <InfoRow label="Email" value={resolvedUser.email} />
            <InfoRow label="Username" value={`@${resolvedUser.username}`} />
            <InfoRow
              label="Display name"
              value={resolvedUser.displayName || resolvedUser.username}
            />
            <InfoRow
              label="Plan"
              value={resolvedUser.plan === "premium" ? "Premium" : "Free"}
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={dashboardListItemStyle}>
      <div style={infoLabelStyle}>{label}</div>
      <div style={infoValueStyle}>{value}</div>
    </div>
  );
}

const summaryCardStyle: CSSProperties = {
  ...dashboardSurfaceStyle,
  padding: "20px",
  gap: "14px",
};

const summaryNameStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: 900,
  lineHeight: 1.05,
};

const summaryHandleStyle: CSSProperties = {
  color: "#9eabc5",
  fontSize: "14px",
  fontWeight: 700,
};

const infoGridStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};

const infoLabelStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const infoValueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  overflowWrap: "anywhere",
};

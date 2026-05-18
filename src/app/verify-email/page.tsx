import Link from "next/link";
import ResendVerificationButton from "@/app/components/ResendVerificationButton";
import { getCurrentUser } from "@/app/lib/auth";
import { verifyEmailToken } from "@/app/lib/email-verification";
import { logServerError } from "@/app/lib/server-log";

type PageProps = {
  searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const token = String(params.token ?? "").trim();
  const currentUser = await getCurrentUser();

  let result: Awaited<ReturnType<typeof verifyEmailToken>> | null = null;

  if (token) {
    try {
      result = await verifyEmailToken(token);
    } catch (error) {
      logServerError("verify-email.page", error, {
        hasToken: true,
      });
      result = { status: "invalid" };
    }
  }

  const view = getView(result?.status ?? null, Boolean(currentUser));

  return (
    <main style={pageStyle}>
      <div style={orbStyle} />
      <section style={panelStyle}>
        <div style={badgeStyle}>Yotei Identity</div>
        <h1 style={titleStyle}>{view.title}</h1>
        <p style={textStyle}>{view.description}</p>

        <div style={statusBoxStyle(view.tone)}>{view.message}</div>

        <div style={actionsStyle}>
          {view.showResend && currentUser ? <ResendVerificationButton /> : null}
          {view.showLogin ? (
            <Link href="/login" style={secondaryLinkStyle}>
              Sign in
            </Link>
          ) : null}
          <Link href="/dashboard" style={primaryLinkStyle}>
            Open dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

function getView(
  status: "verified" | "already-verified" | "expired" | "invalid" | null,
  isLoggedIn: boolean
) {
  if (status === "verified") {
    return {
      tone: "success" as const,
      title: "Email verified.",
      description:
        "Your Yotei account is now fully unlocked and ready for sensitive features.",
      message: "Verification completed successfully.",
      showResend: false,
      showLogin: false,
    };
  }

  if (status === "already-verified") {
    return {
      tone: "success" as const,
      title: "Your email is already verified.",
      description:
        "Nothing else is needed. You can head back to the dashboard and keep building.",
      message: "This account has already completed verification.",
      showResend: false,
      showLogin: false,
    };
  }

  if (status === "expired") {
    return {
      tone: "error" as const,
      title: "This verification link expired.",
      description:
        "For security, verification links only stay active for 24 hours. You can request a fresh one below.",
      message: isLoggedIn
        ? "Generate a new verification email and try again."
        : "Sign in first if you need another verification email.",
      showResend: true,
      showLogin: !isLoggedIn,
    };
  }

  if (status === "invalid") {
    return {
      tone: "error" as const,
      title: "This verification link is invalid.",
      description:
        "The token is missing, malformed or has already been cleared. Request a fresh verification email if needed.",
      message: isLoggedIn
        ? "Use the resend button below to generate a new secure link."
        : "Sign in first if you need another verification email.",
      showResend: true,
      showLogin: !isLoggedIn,
    };
  }

  return {
    tone: "neutral" as const,
    title: "Verify your email to unlock Yotei.",
    description:
      "Open the verification link from your inbox. If it expired, you can request another one after signing in.",
    message: "Check your inbox for the latest verification email.",
    showResend: isLoggedIn,
    showLogin: !isLoggedIn,
  };
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  display: "grid",
  placeItems: "center",
  padding: "24px",
  background:
    "radial-gradient(circle at top, rgba(135,118,255,0.18), transparent 22%), linear-gradient(180deg, #07080d 0%, #05060a 100%)",
  color: "#ffffff",
  fontFamily:
    'Inter, Arial, Helvetica, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const orbStyle: React.CSSProperties = {
  position: "absolute",
  top: "-160px",
  right: "-120px",
  width: "420px",
  height: "420px",
  borderRadius: "999px",
  background:
    "radial-gradient(circle, rgba(255,110,168,0.16) 0%, rgba(135,118,255,0.12) 34%, rgba(135,118,255,0) 74%)",
  filter: "blur(18px)",
  pointerEvents: "none",
};

const panelStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: "620px",
  display: "grid",
  gap: "18px",
  padding: "clamp(20px, 4vw, 32px)",
  borderRadius: "32px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top right, rgba(135,118,255,0.16), transparent 26%), linear-gradient(180deg, rgba(18,17,28,0.98), rgba(8,8,14,0.98))",
  boxShadow: "0 30px 60px rgba(0,0,0,0.26)",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: "34px",
  padding: "0 14px",
  borderRadius: "999px",
  border: "1px solid rgba(255,110,168,0.2)",
  backgroundColor: "rgba(255,110,168,0.08)",
  color: "#ffd7e8",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(32px, 9vw, 44px)",
  lineHeight: 0.96,
  letterSpacing: "-0.06em",
};

const textStyle: React.CSSProperties = {
  margin: 0,
  color: "#bac5db",
  fontSize: "15px",
  lineHeight: 1.75,
};

const statusBoxStyle = (
  tone: "success" | "error" | "neutral"
): React.CSSProperties => ({
  padding: "14px 16px",
  borderRadius: "18px",
  border:
    tone === "success"
      ? "1px solid rgba(34,197,94,0.24)"
      : tone === "error"
        ? "1px solid rgba(239,68,68,0.24)"
        : "1px solid rgba(255,255,255,0.08)",
  background:
    tone === "success"
      ? "rgba(20,83,45,0.16)"
      : tone === "error"
        ? "rgba(127,29,29,0.16)"
        : "rgba(255,255,255,0.04)",
  color:
    tone === "success"
      ? "#bbf7d0"
      : tone === "error"
        ? "#fecaca"
        : "#e7eefc",
  fontSize: "14px",
  lineHeight: 1.6,
});

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  alignItems: "center",
};

const primaryLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  minHeight: "44px",
  padding: "0 16px",
  borderRadius: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  fontWeight: 800,
  background:
    "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
};

const secondaryLinkStyle: React.CSSProperties = {
  ...primaryLinkStyle,
  color: "#dbe6ff",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

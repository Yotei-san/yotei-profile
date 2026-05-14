import Link from "next/link";
import ResendVerificationButton from "@/app/components/ResendVerificationButton";

type Props = {
  email: string;
};

export default function EmailVerificationBanner({ email }: Props) {
  return (
    <section style={bannerStyle}>
      <div style={{ display: "grid", gap: "12px", minWidth: 0 }}>
        <div style={badgeStyle}>Email Verification Required</div>
        <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
          <h2 style={titleStyle}>Verify your email to unlock all Yotei features.</h2>
          <p style={textStyle}>
            Your account is active and you can keep editing your basic profile, but
            some sensitive areas stay locked until <strong>{email}</strong> is verified.
          </p>
        </div>
      </div>

      <div style={actionsStyle}>
        <ResendVerificationButton compact />
        <Link href="/verify-email" style={secondaryLinkStyle}>
          Open verification status
        </Link>
      </div>
    </section>
  );
}

const bannerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  gap: "18px",
  alignItems: "center",
  padding: "22px",
  borderRadius: "26px",
  border: "1px solid rgba(255,110,168,0.16)",
  background:
    "radial-gradient(circle at top right, rgba(135,118,255,0.18), transparent 26%), linear-gradient(180deg, rgba(24,16,33,0.98), rgba(11,10,18,0.98))",
  boxShadow: "0 24px 44px rgba(0,0,0,0.18)",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: "32px",
  padding: "0 12px",
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
  fontSize: "26px",
  lineHeight: 1,
  letterSpacing: "-0.05em",
};

const textStyle: React.CSSProperties = {
  margin: 0,
  color: "#b8c4dc",
  fontSize: "14px",
  lineHeight: 1.7,
};

const actionsStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
  justifyItems: "stretch",
  minWidth: "220px",
};

const secondaryLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  minHeight: "40px",
  padding: "0 14px",
  borderRadius: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#d7e2f8",
  fontSize: "13px",
  fontWeight: 800,
};

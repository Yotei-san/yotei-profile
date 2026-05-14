import Link from "next/link";

type Props = {
  title: string;
  description: string;
};

export default function VerificationLockedPanel({ title, description }: Props) {
  return (
    <main style={pageStyle}>
      <section style={panelStyle}>
        <div style={badgeStyle}>Verification Lock</div>
        <h1 style={titleStyle}>{title}</h1>
        <p style={descriptionStyle}>{description}</p>
        <div style={actionsStyle}>
          <Link href="/dashboard" style={primaryLinkStyle}>
            Back to dashboard
          </Link>
          <Link href="/verify-email" style={secondaryLinkStyle}>
            Verify email
          </Link>
        </div>
      </section>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  display: "grid",
  gap: "20px",
};

const panelStyle: React.CSSProperties = {
  display: "grid",
  gap: "16px",
  padding: "28px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top right, rgba(135,118,255,0.16), transparent 26%), linear-gradient(180deg, rgba(18,17,26,0.98), rgba(8,8,14,0.98))",
  boxShadow: "0 28px 60px rgba(0,0,0,0.22)",
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
  fontSize: "42px",
  lineHeight: 0.96,
  letterSpacing: "-0.06em",
};

const descriptionStyle: React.CSSProperties = {
  margin: 0,
  maxWidth: "60ch",
  color: "#bac5db",
  fontSize: "15px",
  lineHeight: 1.75,
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
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

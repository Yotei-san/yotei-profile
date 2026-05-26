import Link from "next/link";
import PricingActions from "./PricingActions";
import { getCurrentUser } from "@/app/lib/auth";
import { createTranslator, getRequestLocale } from "@/app/lib/i18n";
import { hasPremiumAccess } from "@/app/lib/premium";
import { prisma } from "@/app/lib/prisma";

export default async function PricingPage() {
  const locale = await getRequestLocale();
  const t = createTranslator(locale);
  const sessionUser = await getCurrentUser();
  const user = sessionUser
    ? await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: {
          role: true,
          plan: true,
          premiumBadge: true,
          premiumUntil: true,
          subscriptionStatus: true,
        },
      })
    : null;
  const premium = user ? hasPremiumAccess(user) : false;

  return (
    <main
      className="yotei-scrollbar-hidden"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(236,72,153,0.08), transparent 28%), radial-gradient(circle at 76% 10%, rgba(135,118,255,0.08), transparent 22%), #070707",
        color: "#ffffff",
        padding: "32px 24px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "24px" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
            alignItems: "start",
            padding: "28px",
            borderRadius: "30px",
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(135deg, rgba(18,17,24,0.98), rgba(7,7,10,0.98))",
            boxShadow: "0 24px 56px rgba(0,0,0,0.28)",
          }}
        >
          <div style={{ display: "grid", gap: "14px" }}>
            <div style={eyebrowStyle}>{t("pricing.eyebrow")}</div>
            <div>
              <h1 style={{ fontSize: "48px", lineHeight: 0.95, margin: 0 }}>
                {t("pricing.title")}
              </h1>
              <p style={heroTextStyle}>{t("pricing.description")}</p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/dashboard" style={secondaryLinkStyle}>
                {t("pricing.backToDashboard")}
              </Link>
              <Link href="/" style={ghostLinkStyle}>
                {t("pricing.openHome")}
              </Link>
            </div>
          </div>

          <div style={summaryPanelStyle}>
            <div style={premium ? premiumBadgeStyle : freeBadgeStyle}>
              {premium ? t("pricing.premiumActive") : t("pricing.freePlan")}
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900 }}>
                {premium ? t("pricing.premiumSummary") : t("pricing.freeSummary")}
              </div>
              <div style={summaryTextStyle}>
                {premium
                  ? t("pricing.premiumSummaryBody")
                  : t("pricing.freeSummaryBody")}
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          <article style={freeCardStyle}>
            <div style={freeBadgeStyle}>{t("pricing.starter")}</div>
            <h2 style={planTitleStyle}>{t("pricing.freeTitle")}</h2>
            <p style={planTextStyle}>{t("pricing.freeDescription")}</p>
            <div style={featureListStyle}>
              <div>{t("pricing.freeFeatureLinks")}</div>
              <div>{t("pricing.freeFeatureGallery")}</div>
              <div>{t("pricing.freeFeatureAnalytics")}</div>
              <div>{t("pricing.freeFeatureReactions")}</div>
              <div>{t("pricing.freeFeatureCustomization")}</div>
            </div>
            <div style={currentPlanStyle(!premium)}>
              {!premium ? t("pricing.currentPlan") : t("pricing.availableAnytime")}
            </div>
          </article>

          <article style={premiumCardStyle}>
            <div style={premiumBadgeStyle}>{t("pricing.premiumTitle")}</div>
            <h2 style={planTitleStyle}>{t("pricing.premiumTitle")}</h2>
            <p style={planTextStyle}>{t("pricing.premiumDescription")}</p>
            <div style={featureListStyle}>
              <div>{t("pricing.premiumFeatureLinks")}</div>
              <div>{t("pricing.premiumFeatureGallery")}</div>
              <div>{t("pricing.premiumFeatureVideo")}</div>
              <div>{t("pricing.premiumFeatureBadge")}</div>
              <div>{t("pricing.premiumFeatureLayouts")}</div>
            </div>
            <div
              style={{
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.03)",
                padding: "16px",
                display: "grid",
                gap: "14px",
              }}
            >
              <div style={{ color: "#c7d2fe", fontSize: "13px", lineHeight: 1.6 }}>
                {t("pricing.stripeTestMode")}
              </div>
              <PricingActions
                isSignedIn={Boolean(sessionUser)}
                hasPremiumAccess={premium}
              />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

const eyebrowStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: "32px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,110,168,0.18)",
  backgroundColor: "rgba(255,110,168,0.08)",
  color: "#ffd7e8",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const heroTextStyle: React.CSSProperties = {
  color: "#b8c4dc",
  marginTop: "12px",
  lineHeight: 1.75,
  maxWidth: "60ch",
};

const summaryPanelStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
  borderRadius: "26px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.03)",
  padding: "22px",
};

const summaryTextStyle: React.CSSProperties = {
  color: "#9fb0cc",
  lineHeight: 1.7,
  fontSize: "14px",
};

const linkBaseStyle: React.CSSProperties = {
  minHeight: "44px",
  padding: "0 16px",
  borderRadius: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontWeight: 800,
};

const secondaryLinkStyle: React.CSSProperties = {
  ...linkBaseStyle,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#dbe6ff",
};

const ghostLinkStyle: React.CSSProperties = {
  ...linkBaseStyle,
  border: "1px solid rgba(135,118,255,0.18)",
  backgroundColor: "rgba(135,118,255,0.08)",
  color: "#ddd6ff",
};

const cardBaseStyle: React.CSSProperties = {
  display: "grid",
  gap: "16px",
  borderRadius: "26px",
  padding: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  minWidth: 0,
};

const freeCardStyle: React.CSSProperties = {
  ...cardBaseStyle,
  background: "linear-gradient(180deg, rgba(16,16,20,0.98), rgba(9,9,13,0.98))",
};

const premiumCardStyle: React.CSSProperties = {
  ...cardBaseStyle,
  background:
    "radial-gradient(circle at top right, rgba(244,114,182,0.14), transparent 26%), linear-gradient(180deg, rgba(27,16,27,0.98), rgba(12,10,16,0.98))",
  border: "1px solid rgba(244,114,182,0.18)",
};

const freeBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: "30px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#d4d4d8",
  fontSize: "12px",
  fontWeight: 800,
};

const premiumBadgeStyle: React.CSSProperties = {
  ...freeBadgeStyle,
  border: "1px solid rgba(244,114,182,0.18)",
  backgroundColor: "rgba(244,114,182,0.10)",
  color: "#f9a8d4",
};

const planTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "34px",
  lineHeight: 1,
};

const planTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#c4cde2",
  lineHeight: 1.75,
};

const featureListStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
  color: "#ffffff",
  lineHeight: 1.6,
};

const currentPlanStyle = (active: boolean): React.CSSProperties => ({
  width: "100%",
  minHeight: "46px",
  borderRadius: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: active
    ? "1px solid rgba(244,114,182,0.18)"
    : "1px solid rgba(255,255,255,0.08)",
  backgroundColor: active ? "rgba(244,114,182,0.10)" : "rgba(255,255,255,0.04)",
  color: active ? "#f9a8d4" : "#dbe6ff",
  fontWeight: 800,
});

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import FormActionButton from "@/app/components/FormActionButton";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
import VerificationLockedPanel from "@/app/dashboard/components/VerificationLockedPanel";
import { prisma } from "@/app/lib/prisma";
import {
  isEmailVerificationEnforced,
  isEmailVerified,
} from "@/app/lib/email-verification";
import { hasPremiumAccess } from "@/app/lib/premium";
import TemplateGallery from "@/app/dashboard/components/TemplateGallery";
import { applyTemplate, createTemplate } from "./actions";

type PageProps = {
  searchParams?: Promise<{
    tab?: string;
    success?: string;
    error?: string;
  }>;
};

type TemplateTab = "all" | "mine" | "premium";

type TemplatesPageUser = {
  id: string;
  username: string;
  emailVerified: Date | null;
  role: string;
  plan: string;
  premiumBadge: boolean;
  premiumUntil: Date | null;
  subscriptionStatus: string | null;
};

export default async function TemplatesPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  const params = (await searchParams) ?? {};
  const currentTab = getCurrentTab(params.tab);

  const user = (await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      username: true,
      emailVerified: true,
      role: true,
      plan: true,
      premiumBadge: true,
      premiumUntil: true,
      subscriptionStatus: true,
    } as any,
  })) as TemplatesPageUser | null;

  const resolvedUser = user ?? (await redirectWithClearedSession());

  if (isEmailVerificationEnforced() && !isEmailVerified(resolvedUser)) {
    return (
      <VerificationLockedPanel
        title="Verify your email to unlock templates."
        description="You can keep setting up your account, but publishing or applying reusable public templates stays locked until your email is verified."
      />
    );
  }

  const templatesWhere = getTemplatesWhere(currentTab, resolvedUser.id);
  const [templates, allCount, myCount, premiumCount] = await Promise.all([
    prisma.profileTemplate.findMany({
      where: templatesWhere,
      include: {
        createdByUser: {
          select: {
            username: true,
            displayName: true,
          },
        },
      },
      orderBy: [{ usageCount: "desc" }, { createdAt: "desc" }],
    }),
    prisma.profileTemplate.count({
      where: {
        OR: [{ isPublic: true }, { createdByUserId: resolvedUser.id }],
      },
    }),
    prisma.profileTemplate.count({
      where: {
        createdByUserId: resolvedUser.id,
      },
    }),
    prisma.profileTemplate.count({
      where: {
        isPremium: true,
        OR: [{ isPublic: true }, { createdByUserId: resolvedUser.id }],
      },
    }),
  ]);

  const canMarkPremium = isAdminOrOwner(resolvedUser.role);
  const canUsePremium = hasPremiumAccess(resolvedUser);
  const successMessage = getSuccessMessage(params.success);
  const errorMessage = getErrorMessage(params.error);

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={eyebrowStyle}>Template Studio</div>
          <div>
            <h1 style={heroTitleStyle}>Templates</h1>
            <p style={heroTextStyle}>
              Crie um snapshot do seu perfil e compartilhe layouts prontos para outros
              usuarios aplicarem em um clique.
            </p>
          </div>

          <div style={heroMetaRowStyle}>
            <span style={metaPillStyle}>All templates: {allCount}</span>
            <span style={metaPillStyle}>My templates: {myCount}</span>
            <span style={canUsePremium ? premiumMetaPillStyle : metaPillStyle}>
              {canUsePremium ? "Premium unlocked" : "Free account"}
            </span>
          </div>
        </div>

        <div style={heroActionsStyle}>
          <a href="#create-template-form" style={primaryActionStyle}>
            Create Template
          </a>
          <Link href="/dashboard/profile" style={secondaryActionStyle}>
            Open Profile Editor
          </Link>
        </div>
      </section>

      {successMessage ? <div style={successBoxStyle}>{successMessage}</div> : null}
      {errorMessage ? <div style={errorBoxStyle}>{errorMessage}</div> : null}

      <section style={tabsBarStyle}>
        <TabLink href="/dashboard/templates?tab=all" active={currentTab === "all"}>
          All Templates
          <span style={tabCountStyle}>{allCount}</span>
        </TabLink>
        <TabLink href="/dashboard/templates?tab=mine" active={currentTab === "mine"}>
          My Templates
          <span style={tabCountStyle}>{myCount}</span>
        </TabLink>
        <TabLink href="/dashboard/templates?tab=premium" active={currentTab === "premium"}>
          Premium
          <span style={tabCountStyle}>{premiumCount}</span>
        </TabLink>
      </section>

      <section id="create-template-form" style={createPanelStyle}>
        <div style={{ display: "grid", gap: "8px" }}>
          <div style={sectionEyebrowStyle}>Create Template</div>
          <h2 style={sectionTitleStyle}>Publish your current profile as a reusable template</h2>
          <p style={sectionDescriptionStyle}>
            O sistema copia automaticamente display name, bio, avatar, banner e theme
            color do seu perfil atual.
          </p>
        </div>

        <form action={createTemplate} style={formGridStyle}>
          <input type="hidden" name="tab" value={currentTab} />

          <label style={labelStyle}>
            Template name
            <input
              type="text"
              name="name"
              required
              maxLength={80}
              placeholder="Ex: Neon Creator Pack"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Preview image URL
            <input
              type="url"
              name="previewImageUrl"
              placeholder="https://..."
              style={inputStyle}
            />
          </label>

          <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
            Description
            <textarea
              name="description"
              rows={4}
              maxLength={240}
              placeholder="Explique o estilo desse template e para quem ele funciona bem."
              style={textareaStyle}
            />
          </label>

          <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
            Tags
            <input
              type="text"
              name="tags"
              placeholder="gaming, creator, pink, minimal"
              style={inputStyle}
            />
          </label>

          <label style={checkboxLabelStyle}>
            <input type="checkbox" name="isPublic" defaultChecked />
            <span>Public template</span>
          </label>

          {canMarkPremium ? (
            <label style={checkboxLabelStyle}>
              <input type="checkbox" name="isPremium" />
              <span>Premium only</span>
            </label>
          ) : (
            <div style={hintBoxStyle}>
              Apenas admin/owner pode marcar templates como premium nesta fase.
            </div>
          )}

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <FormActionButton
              idleLabel="Create Template"
              pendingLabel="Creating Template..."
              style={submitButtonStyle}
            />
            <Link href="/dashboard/profile" style={secondaryActionStyle}>
              Review current profile
            </Link>
          </div>
        </form>
      </section>

      <section style={gridStyle}>
        {templates.length > 0 ? (
          <TemplateGallery
            templates={templates}
            currentUserId={resolvedUser.id}
            currentTab={currentTab}
            canUsePremium={canUsePremium}
            applyAction={applyTemplate}
          />
        ) : (
          <div style={emptyStateStyle}>
            <div style={emptyStateEyebrowStyle}>No templates yet</div>
            <h3 style={{ margin: 0, fontSize: "32px" }}>
              {currentTab === "mine"
                ? "You have not created templates yet"
                : currentTab === "premium"
                  ? "No premium templates available right now"
                  : "No templates published yet"}
            </h3>
            <p style={emptyStateTextStyle}>
              Comece salvando o seu visual atual. Isso cria a base para o marketplace
              interno de templates do Yotei.
            </p>
            <a href="#create-template-form" style={primaryActionStyle}>
              Create Template
            </a>
          </div>
        )}
      </section>
    </main>
  );
}

function getCurrentTab(value?: string): TemplateTab {
  if (value === "mine" || value === "premium") {
    return value;
  }

  return "all";
}

function getTemplatesWhere(tab: TemplateTab, userId: string) {
  if (tab === "mine") {
    return {
      createdByUserId: userId,
    };
  }

  if (tab === "premium") {
    return {
      isPremium: true,
      OR: [{ isPublic: true }, { createdByUserId: userId }],
    };
  }

  return {
    OR: [{ isPublic: true }, { createdByUserId: userId }],
  };
}

function isAdminOrOwner(role: string) {
  return role === "admin" || role === "owner";
}

function getSuccessMessage(code?: string) {
  if (code === "template-created") return "Template criado com sucesso.";
  if (code === "template-applied") return "Template aplicado ao seu perfil.";
  return "";
}

function getErrorMessage(code?: string) {
  if (code === "name-required") return "Digite um nome para o template.";
  if (code === "premium-create-blocked") return "Apenas admin/owner pode criar template premium.";
  if (code === "template-not-found") return "Template nao encontrado.";
  if (code === "template-private") return "Esse template e privado e nao pode ser usado por voce.";
  if (code === "premium-required") return "Premium required";
  if (code === "user-not-found") return "Usuario nao encontrado.";
  return "";
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link href={href} style={active ? activeTabStyle : tabStyle}>
      {children}
    </Link>
  );
}

const pageStyle: CSSProperties = {
  display: "grid",
  gap: "22px",
  color: "#ffffff",
};

const heroStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  flexWrap: "wrap",
  borderRadius: "32px",
  padding: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top left, rgba(244,114,182,0.14), transparent 30%), radial-gradient(circle at 82% 18%, rgba(56,189,248,0.14), transparent 24%), linear-gradient(135deg, rgba(16,15,22,0.98), rgba(8,8,12,0.98))",
  boxShadow: "0 28px 70px rgba(0,0,0,0.32)",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  padding: "8px 12px",
  borderRadius: "999px",
  border: "1px solid rgba(244,114,182,0.18)",
  backgroundColor: "rgba(244,114,182,0.08)",
  color: "#f9a8d4",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "54px",
  lineHeight: 0.94,
  letterSpacing: "-0.04em",
};

const heroTextStyle: CSSProperties = {
  margin: "12px 0 0",
  maxWidth: "62ch",
  color: "#b4bdd1",
  fontSize: "15px",
  lineHeight: 1.8,
};

const heroMetaRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const metaPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#e4e4e7",
  fontSize: "13px",
  fontWeight: 700,
};

const premiumMetaPillStyle: CSSProperties = {
  ...metaPillStyle,
  color: "#f9a8d4",
  border: "1px solid rgba(244,114,182,0.18)",
  backgroundColor: "rgba(244,114,182,0.08)",
};

const heroActionsStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const actionBaseStyle: CSSProperties = {
  textDecoration: "none",
  padding: "14px 18px",
  borderRadius: "16px",
  fontWeight: 800,
  textAlign: "center",
};

const primaryActionStyle: CSSProperties = {
  ...actionBaseStyle,
  color: "#ffffff",
  background:
    "linear-gradient(135deg, rgba(236,72,153,0.92), rgba(124,58,237,0.92))",
};

const secondaryActionStyle: CSSProperties = {
  ...actionBaseStyle,
  color: "#dbe4ff",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
};

const successBoxStyle: CSSProperties = {
  borderRadius: "18px",
  padding: "14px 16px",
  backgroundColor: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.22)",
  color: "#86efac",
  fontWeight: 700,
};

const errorBoxStyle: CSSProperties = {
  borderRadius: "18px",
  padding: "14px 16px",
  backgroundColor: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.22)",
  color: "#fca5a5",
  fontWeight: 700,
};

const tabsBarStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const tabBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "14px 18px",
  borderRadius: "16px",
  textDecoration: "none",
  fontWeight: 800,
};

const tabStyle: CSSProperties = {
  ...tabBaseStyle,
  color: "#d4d4d8",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
};

const activeTabStyle: CSSProperties = {
  ...tabBaseStyle,
  color: "#ffffff",
  border: "1px solid rgba(244,114,182,0.18)",
  backgroundColor: "rgba(244,114,182,0.10)",
  boxShadow: "0 0 0 1px rgba(244,114,182,0.10)",
};

const tabCountStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "30px",
  minHeight: "30px",
  padding: "0 8px",
  borderRadius: "999px",
  backgroundColor: "rgba(0,0,0,0.18)",
  fontSize: "12px",
};

const createPanelStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  borderRadius: "30px",
  padding: "26px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(16,16,20,0.98), rgba(9,9,13,0.98))",
};

const sectionEyebrowStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "34px",
  lineHeight: 1.05,
};

const sectionDescriptionStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#aab4c8",
  lineHeight: 1.7,
  fontSize: "14px",
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  color: "#e4e4e7",
  fontSize: "14px",
  fontWeight: 700,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#ffffff",
  outline: "none",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "120px",
};

const checkboxLabelStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  minHeight: "48px",
  padding: "0 2px",
  color: "#e4e4e7",
  fontSize: "14px",
  fontWeight: 700,
};

const hintBoxStyle: CSSProperties = {
  display: "grid",
  alignItems: "center",
  minHeight: "48px",
  color: "#a1a1aa",
  fontSize: "13px",
  lineHeight: 1.6,
};

const submitButtonStyle: CSSProperties = {
  padding: "14px 18px",
  borderRadius: "16px",
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "14px",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
};

const emptyStateStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
  justifyItems: "start",
  borderRadius: "30px",
  padding: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(16,16,20,0.98), rgba(9,9,13,0.98))",
};

const emptyStateEyebrowStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const emptyStateTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: "58ch",
  color: "#aab4c8",
  lineHeight: 1.7,
};

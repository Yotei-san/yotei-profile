import Link from "next/link";
import FormActionButton from "@/app/components/FormActionButton";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getMediaKind } from "@/app/lib/profile-media";
import { saveProfileSettings } from "./actions";
import ProfileMediaUploader from "./ProfileMediaUploader";

const PROFILE_LAYOUT_OPTIONS = [
  {
    key: "default",
    name: "Default",
    description: "Banner no topo, avatar em destaque e links em lista premium simples.",
  },
  {
    key: "modern",
    name: "Modern",
    description: "Visual cinematografico e premium. Continua como layout principal.",
  },
  {
    key: "simplistic",
    name: "Simplistic",
    description: "Minimalista, limpo e focado em leitura com menos brilho visual.",
  },
  {
    key: "portfolio",
    name: "Portfolio",
    description: "Mais profissional, ideal para devs, criadores e projetos.",
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

  if (!user) {
    await redirectWithClearedSession();
  }

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const bannerKind = getMediaKind(user.bannerUrl || "");
  const selectedProfileLayout = normalizeProfileLayout(user.profileLayout);

  return (
    <main
      style={{
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(25,10,18,0.98), rgba(10,10,12,0.98))",
          border: "1px solid rgba(244,114,182,0.14)",
          borderRadius: "28px",
          padding: "26px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
          marginBottom: "22px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                gap: "8px",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "999px",
                backgroundColor: "rgba(244,114,182,0.08)",
                border: "1px solid rgba(244,114,182,0.14)",
                color: "#f9a8d4",
                fontWeight: 700,
                fontSize: "13px",
                marginBottom: "10px",
              }}
            >
              ✦ Profile Editor • Discord Upload
            </div>

            <h1 style={{ margin: 0, fontSize: "48px", lineHeight: 1 }}>
              Editar perfil
            </h1>

            <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>
              Ajuste texto, cor, avatar e banner com preview real.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={topLinkStyle}>
              Dashboard
            </Link>
            <Link href={`/${user.username}`} target="_blank" style={topLinkStyle}>
              Ver perfil
            </Link>
          </div>
        </div>
      </section>

      {params.success === "saved" ? (
        <div style={successBoxStyle}>Perfil salvo com sucesso.</div>
      ) : null}
      {params.error === "save-failed" ? (
        <div style={errorBoxStyle}>Nao foi possivel salvar o perfil agora.</div>
      ) : null}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "18px",
          marginBottom: "18px",
        }}
      >
        <ProfileMediaUploader
          type="avatar"
          currentUrl={user.avatarUrl}
          themeColor={user.themeColor}
        />

        <ProfileMediaUploader
          type="banner"
          currentUrl={user.bannerUrl}
          themeColor={user.themeColor}
        />
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "18px",
        }}
      >
        <form action={saveProfileSettings} style={panelStyle}>
          <h2 style={panelTitleStyle}>Dados principais</h2>

          <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
            <label style={labelStyle}>
              Display name
              <input
                type="text"
                name="displayName"
                defaultValue={user.displayName || ""}
                placeholder="Seu nome visível"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Bio
              <textarea
                name="bio"
                defaultValue={user.bio || ""}
                placeholder="Escreva algo sobre você"
                rows={5}
                style={textareaStyle}
              />
            </label>

            <label style={labelStyle}>
              Theme color
              <input
                type="text"
                name="themeColor"
                defaultValue={user.themeColor || "#f472b6"}
                placeholder="#f472b6"
                style={inputStyle}
              />
            </label>

            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "grid", gap: "6px" }}>
                <div style={sectionTitleMiniStyle}>Profile Layout</div>
                <div style={sectionDescriptionMiniStyle}>
                  Escolha como seu perfil publico sera apresentado.
                </div>
              </div>

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

                      <div
                        style={layoutCardBodyStyle}
                        className="layout-option__body"
                      >
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
              idleLabel="Salvar texto e tema"
              pendingLabel="Salvando perfil..."
              style={primaryButtonStyle}
            />
          </div>
        </form>

        <section style={panelStyle}>
          <h2 style={panelTitleStyle}>Preview</h2>

          <div
            style={{
              marginTop: "18px",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "#0b0b0b",
            }}
          >
            <div
              style={{
                height: "180px",
                position: "relative",
                overflow: "hidden",
                background: `linear-gradient(135deg, ${user.themeColor || "#f472b6"}, rgba(0,0,0,0.2))`,
              }}
            >
              {user.bannerUrl ? (
                bannerKind === "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      pointerEvents: "none",
                    }}
                  >
                    <source src={user.bannerUrl} />
                  </video>
                ) : (
                  <img
                    src={user.bannerUrl}
                    alt="Banner preview"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )
              ) : null}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.32) 52%, rgba(0,0,0,0.56) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "-52px",
                padding: "0 20px 20px",
              }}
            >
              <img
                src={user.avatarUrl || "https://placehold.co/200x200?text=Y"}
                alt={user.displayName || user.username}
                style={{
                  width: "104px",
                  height: "104px",
                  borderRadius: "999px",
                  objectFit: "cover",
                  border: `4px solid ${user.themeColor || "#f472b6"}`,
                  backgroundColor: "#111",
                }}
              />

              <div style={{ marginTop: "14px", fontSize: "28px", fontWeight: 900 }}>
                {user.displayName || user.username}
              </div>

              <div style={{ color: "#9ca3af", marginTop: "4px" }}>
                @{user.username}
              </div>

              <div style={{ color: "#f9a8d4", marginTop: "10px", fontWeight: 700 }}>
                Saved layout: {selectedProfileLayout}
              </div>

              <div
                style={{
                  marginTop: "14px",
                  color: "#d4d4d8",
                  lineHeight: 1.7,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "16px",
                  padding: "14px 16px",
                }}
              >
                {user.bio || "Sua bio vai aparecer aqui."}
              </div>
            </div>
          </div>
        </section>
      </section>

      <style>{`
        .layout-option {
          display: block;
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

const topLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  backgroundColor: "#141414",
  border: "1px solid #2a2a2a",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: "12px",
};

const panelStyle: React.CSSProperties = {
  backgroundColor: "#0b0b0b",
  border: "1px solid #1f1f1f",
  borderRadius: "28px",
  padding: "22px",
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "30px",
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
  color: "#d4d4d8",
  fontSize: "14px",
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
  backgroundColor: "#0f0f0f",
  color: "#ffffff",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
  backgroundColor: "#0f0f0f",
  color: "#ffffff",
  outline: "none",
  resize: "vertical",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
  cursor: "pointer",
  fontWeight: "bold",
};

const successBoxStyle: React.CSSProperties = {
  backgroundColor: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.22)",
  color: "#86efac",
  borderRadius: "16px",
  padding: "14px 16px",
  marginBottom: "18px",
};

const errorBoxStyle: React.CSSProperties = {
  backgroundColor: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.22)",
  color: "#fca5a5",
  borderRadius: "16px",
  padding: "14px 16px",
  marginBottom: "18px",
};

const sectionTitleMiniStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 900,
  color: "#ffffff",
};

const sectionDescriptionMiniStyle: React.CSSProperties = {
  color: "#a3a3a3",
  fontSize: "14px",
  lineHeight: 1.6,
};

const layoutGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const layoutCardStyle: React.CSSProperties = {
  cursor: "pointer",
};

const layoutInputStyle: React.CSSProperties = {
  position: "absolute",
  opacity: 0,
  pointerEvents: "none",
};

const layoutCardBodyStyle: React.CSSProperties = {
  display: "grid",
  gap: "12px",
  padding: "14px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(20,20,24,0.96), rgba(12,12,16,0.96))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
};

const layoutPreviewStyle: React.CSSProperties = {
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

const defaultPreviewStyle: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(25,18,28,0.96), rgba(8,8,12,0.96))",
};

const modernPreviewStyle: React.CSSProperties = {
  background:
    "radial-gradient(circle at top left, rgba(244,114,182,0.20), transparent 28%), linear-gradient(180deg, rgba(18,18,26,0.96), rgba(8,8,12,0.96))",
};

const simplisticPreviewStyle: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(16,16,18,0.98), rgba(10,10,12,0.98))",
};

const portfolioPreviewStyle: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(17,24,39,0.98), rgba(7,10,16,0.98))",
};

const previewBannerStyle: React.CSSProperties = {
  height: "24px",
  borderRadius: "10px",
  background:
    "linear-gradient(90deg, rgba(244,114,182,0.52), rgba(96,165,250,0.28))",
};

const previewAvatarStyle: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.85)",
  border: "2px solid rgba(8,8,12,0.6)",
  marginTop: "-10px",
};

const previewAvatarSmallStyle: React.CSSProperties = {
  width: "22px",
  height: "22px",
  marginTop: "2px",
};

const previewAvatarSquareStyle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  borderRadius: "10px",
  marginTop: "2px",
};

const previewLineStyle: React.CSSProperties = {
  height: "7px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.16)",
};

const previewLinksColumnStyle: React.CSSProperties = {
  display: "grid",
  gap: "6px",
  marginTop: "4px",
};

const previewLinkPillStyle: React.CSSProperties = {
  height: "18px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.08)",
  width: "100%",
};

const layoutCardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  alignItems: "center",
  fontWeight: 800,
  color: "#ffffff",
};

const layoutCheckWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  minWidth: "84px",
};

const layoutCardDescriptionStyle: React.CSSProperties = {
  color: "#a3a3a3",
  fontSize: "13px",
  lineHeight: 1.6,
};

const layoutCheckStyle: React.CSSProperties = {
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

const layoutCheckSelectedStyle: React.CSSProperties = {
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
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

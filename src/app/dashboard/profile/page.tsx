import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { saveProfileSettings } from "./actions";
import ProfileMediaUploader from "./ProfileMediaUploader";

type PageProps = {
  searchParams?: Promise<{
    success?: string;
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
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

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

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
          gridTemplateColumns: "1fr 1fr",
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

            <button type="submit" style={primaryButtonStyle}>
              Salvar texto e tema
            </button>
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
                background: user.bannerUrl
                  ? `url(${user.bannerUrl}) center/cover no-repeat`
                  : `linear-gradient(135deg, ${user.themeColor || "#f472b6"}, rgba(0,0,0,0.2))`,
              }}
            />

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
import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getLinkPlatform } from "@/app/lib/link-icons";
import { createLink, deleteLink, updateLink } from "./actions";

type PageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

function getMessage(type: "success" | "error", value?: string) {
  if (!value) return null;

  if (type === "success") {
    if (value === "created") return "Link criado com sucesso.";
    if (value === "updated") return "Link atualizado com sucesso.";
    if (value === "deleted") return "Link removido com sucesso.";
    return "Ação concluída.";
  }

  if (value === "missing-url") return "Preencha a URL do link.";
  if (value === "invalid-update") return "Dados inválidos para atualizar.";
  if (value === "invalid-delete") return "Dados inválidos para remover.";
  if (value === "link-not-found") return "Link não encontrado.";
  return "Não foi possível concluir a ação.";
}

export default async function LinksPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  const params = (await searchParams) ?? {};

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      username: true,
      displayName: true,
      links: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          url: true,
          position: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return (
    <main style={{ color: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif" }}>
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
              ✦ Links Manager
            </div>

            <h1 style={{ margin: 0, fontSize: "48px", lineHeight: 1 }}>
              Seus links
            </h1>

            <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>
              Adicione Discord, Instagram, GitHub, X e qualquer outro link.
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

      {getMessage("success", params.success) ? (
        <div style={successBoxStyle}>{getMessage("success", params.success)}</div>
      ) : null}

      {getMessage("error", params.error) ? (
        <div style={errorBoxStyle}>{getMessage("error", params.error)}</div>
      ) : null}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "0.95fr 1.05fr",
          gap: "18px",
        }}
      >
        <form action={createLink} style={panelStyle}>
          <h2 style={panelTitleStyle}>Adicionar link</h2>

          <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
            <label style={labelStyle}>
              Título
              <input
                type="text"
                name="title"
                placeholder="Ex: Discord"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              URL
              <input
                type="text"
                name="url"
                placeholder="discord.gg/seulink"
                style={inputStyle}
                required
              />
            </label>

            <button type="submit" style={primaryButtonStyle}>
              Criar link
            </button>
          </div>
        </form>

        <section style={panelStyle}>
          <h2 style={panelTitleStyle}>Links atuais</h2>

          <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
            {user.links.length > 0 ? (
              user.links.map((item) => {
                const platform = getLinkPlatform(item.url, item.title);
                const PlatformIcon = platform.icon;

                return (
                  <article
                    key={item.id}
                    style={{
                      backgroundColor: "#101010",
                      border: "1px solid #1f1f1f",
                      borderRadius: "18px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(244,114,182,0.10)",
                          border: "1px solid rgba(244,114,182,0.18)",
                          flexShrink: 0,
                        }}
                      >
                        <PlatformIcon size={20} color={platform.color} />
                      </div>

                      <div>
                        <div style={{ fontWeight: 800 }}>
                          {item.title || platform.name}
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: "13px", marginTop: "4px" }}>
                          {platform.name}
                        </div>
                      </div>
                    </div>

                    <form action={updateLink} style={{ display: "grid", gap: "12px" }}>
                      <input type="hidden" name="linkId" value={item.id} readOnly />

                      <label style={labelStyle}>
                        Título
                        <input
                          type="text"
                          name="title"
                          defaultValue={item.title || ""}
                          placeholder="Título do link"
                          style={inputStyle}
                        />
                      </label>

                      <label style={labelStyle}>
                        URL
                        <input
                          type="text"
                          name="url"
                          defaultValue={item.url}
                          placeholder="https://..."
                          style={inputStyle}
                          required
                        />
                      </label>

                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <button type="submit" style={primaryButtonStyle}>
                          Salvar
                        </button>
                      </div>
                    </form>

                    <form action={deleteLink} style={{ marginTop: "12px" }}>
                      <input type="hidden" name="linkId" value={item.id} readOnly />
                      <button type="submit" style={dangerButtonStyle}>
                        Remover
                      </button>
                    </form>
                  </article>
                );
              })
            ) : (
              <div style={emptyBoxStyle}>
                Você ainda não adicionou links ao perfil.
              </div>
            )}
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

const primaryButtonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
  cursor: "pointer",
  fontWeight: "bold",
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(239,68,68,0.18)",
  backgroundColor: "rgba(239,68,68,0.10)",
  color: "#fca5a5",
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

const emptyBoxStyle: React.CSSProperties = {
  border: "1px dashed #3a3a3a",
  borderRadius: "14px",
  padding: "24px",
  textAlign: "center",
  color: "#a3a3a3",
  backgroundColor: "#0b0b0b",
};

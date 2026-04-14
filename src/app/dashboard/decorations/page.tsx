import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import DecorationManager from "./DecorationManager";
import {
  clearSelectedDecoration,
  createUploadedDecoration,
  saveSelectedDecoration,
} from "./actions";

type PageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

function getNotice(type: "success" | "error", value?: string) {
  if (!value) return null;

  if (type === "success") {
    if (value === "decoration-saved") return "Moldura salva no perfil.";
    if (value === "decoration-cleared") return "Moldura removida do perfil.";
    if (value === "decoration-uploaded") return "Moldura criada e aplicada com sucesso.";
    return "Ação concluída.";
  }

  if (value === "missing-decoration") return "Selecione uma moldura primeiro.";
  if (value === "missing-upload-fields") return "Preencha nome e mídia para criar a moldura.";
  return "Não foi possível concluir a ação.";
}

export default async function DecorationsPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  const params = (await searchParams) ?? {};

  const me = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      selectedDecorationId: true,
      selectedDecorationScale: true,
      selectedDecorationOffsetX: true,
      selectedDecorationOffsetY: true,
    },
  });

  if (!me) {
    throw new Error("Usuário não encontrado.");
  }

  const decorations = await prisma.decoration.findMany({
    where: { isPublic: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      previewUrl: true,
      posterUrl: true,
      mediaType: true,
      overlayScale: true,
      overlayOffsetY: true,
    },
  });

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
              ✦ Decorations Studio • Discord Level
            </div>

            <h1 style={{ margin: 0, fontSize: "48px", lineHeight: 1 }}>
              Molduras
            </h1>

            <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>
              Arraste, ajuste a escala e salve sua moldura no perfil.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={topLinkStyle}>
              Dashboard
            </Link>
            <Link href={`/${me.username}`} target="_blank" style={topLinkStyle}>
              Ver perfil
            </Link>
          </div>
        </div>
      </section>

      {getNotice("success", params.success) ? (
        <div style={successBoxStyle}>{getNotice("success", params.success)}</div>
      ) : null}

      {getNotice("error", params.error) ? (
        <div style={errorBoxStyle}>{getNotice("error", params.error)}</div>
      ) : null}

      <DecorationManager
        decorations={decorations}
        selectedDecorationId={me.selectedDecorationId}
        selectedScale={me.selectedDecorationScale ?? 165}
        selectedOffsetX={me.selectedDecorationOffsetX ?? 0}
        selectedOffsetY={me.selectedDecorationOffsetY ?? 0}
        saveAction={saveSelectedDecoration}
        clearAction={clearSelectedDecoration}
        uploadAction={createUploadedDecoration}
        avatarUrl={me.avatarUrl}
        displayName={me.displayName || me.username}
        username={me.username}
      />
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
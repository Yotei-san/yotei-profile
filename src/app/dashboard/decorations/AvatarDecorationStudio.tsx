"use client";

import { useMemo, useRef, useState } from "react";
import AvatarDecorationMedia from "@/app/components/AvatarDecorationMedia";

type Decoration = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  previewUrl: string | null;
  posterUrl: string | null;
  mediaType: string;
  overlayScale: number;
  overlayOffsetY: number;
};

type Props = {
  decorations: Decoration[];
  selectedDecorationId?: string | null;
  saveAction: (formData: FormData) => Promise<void>;
  clearAction: () => Promise<void>;
  uploadAction: (formData: FormData) => Promise<void>;
  avatarUrl?: string | null;
  displayName: string;
  username: string;
};

function inferMediaType(url: string) {
  const lower = url.toLowerCase();
  if (lower.endsWith(".webm")) return "webm";
  if (lower.endsWith(".gif")) return "gif";
  return "image";
}

export default function AvatarDecorationStudio({
  decorations,
  selectedDecorationId,
  saveAction,
  clearAction,
  uploadAction,
  avatarUrl,
  displayName,
  username,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const posterRef = useRef<HTMLInputElement | null>(null);

  const [selectedId, setSelectedId] = useState(
    selectedDecorationId || decorations[0]?.id || ""
  );
  const [uploading, setUploading] = useState(false);
  const [posterUploading, setPosterUploading] = useState(false);

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [overlayScale, setOverlayScale] = useState(100);
  const [overlayOffsetY, setOverlayOffsetY] = useState(0);

  const selected = useMemo(
    () => decorations.find((item) => item.id === selectedId) || null,
    [decorations, selectedId]
  );

  const previewDecoration: Decoration | null = imageUrl
    ? {
        id: "preview-decoration",
        name: name || "Preview",
        slug: "preview-decoration",
        imageUrl,
        previewUrl: posterUrl || imageUrl,
        posterUrl: posterUrl || null,
        mediaType,
        overlayScale,
        overlayOffsetY,
      }
    : selected;

  async function uploadFile(file: File | null, mode: "main" | "poster") {
    if (!file) return;

    if (mode === "main") {
      setUploading(true);
    } else {
      setPosterUploading(true);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Falha no upload.");
      }

      if (mode === "main") {
        setImageUrl(data.url);
        setMediaType(inferMediaType(data.url));

        if (!name) {
          const raw = file.name.replace(/\.[^.]+$/, "").trim();
          setName(raw || "Minha moldura");
        }
      } else {
        setPosterUrl(data.url);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Falha no upload.");
    } finally {
      if (mode === "main") {
        setUploading(false);
      } else {
        setPosterUploading(false);
      }
    }
  }

  function handleSelectDecoration(item: Decoration) {
    setSelectedId(item.id);
    setImageUrl("");
    setPosterUrl("");
    setName("");
    setMediaType(item.mediaType || "image");
    setOverlayScale(item.overlayScale ?? 100);
    setOverlayOffsetY(item.overlayOffsetY ?? 0);
  }

  return (
    <div style={{ display: "grid", gap: "22px" }}>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.12fr 0.88fr",
          gap: "18px",
        }}
      >
        <div style={panelStyle}>
          <h2 style={panelTitleStyle}>Escolher moldura</h2>
          <p style={mutedStyle}>
            Escolha uma moldura pública ou envie a sua própria.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "14px",
              marginTop: "18px",
            }}
          >
            {decorations.map((item) => {
              const active = item.id === selectedId && !imageUrl;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectDecoration(item)}
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    background: active
                      ? "linear-gradient(180deg, rgba(50,16,35,0.96), rgba(16,11,18,0.96))"
                      : "linear-gradient(180deg, rgba(18,18,22,0.96), rgba(10,10,14,0.96))",
                    border: active
                      ? "1px solid rgba(244,114,182,0.24)"
                      : "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "22px",
                    padding: "12px",
                    color: "#fff",
                    boxShadow: active
                      ? "0 16px 34px rgba(244,114,182,0.16)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      height: "178px",
                      borderRadius: "16px",
                      backgroundColor: "#08080a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {item.mediaType === "webm" ? (
                      <video
                        src={item.imageUrl}
                        poster={item.posterUrl || item.previewUrl || undefined}
                        muted
                        loop
                        autoPlay
                        playsInline
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <img
                        src={item.previewUrl || item.imageUrl}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    )}

                    {active ? <div style={checkStyle}>✓</div> : null}
                  </div>

                  <div
                    style={{
                      marginTop: "12px",
                      fontWeight: 800,
                      fontSize: "16px",
                    }}
                  >
                    {item.name}
                  </div>

                  <div
                    style={{
                      color: "#7c7f8a",
                      fontSize: "12px",
                      marginTop: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.mediaType}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={panelStyle}>
          <h2 style={panelTitleStyle}>Preview avatar</h2>
          <p style={mutedStyle}>
            Preview profissional com imagem, GIF e WebM.
          </p>

          <div style={previewShellStyle}>
            <div style={previewCardStyle}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <AvatarDecorationMedia
                  avatarUrl={avatarUrl || "https://placehold.co/300x300?text=Y"}
                  decoration={previewDecoration || undefined}
                  size={180}
                />
              </div>

              <div style={{ textAlign: "center", marginTop: "18px" }}>
                <div style={{ fontSize: "26px", fontWeight: 900 }}>
                  {displayName}
                </div>
                <div style={{ color: "#9ca3af", marginTop: "4px" }}>
                  @{username}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "16px",
                flexWrap: "wrap",
              }}
            >
              <form action={saveAction}>
                <input
                  type="hidden"
                  name="decorationId"
                  value={imageUrl ? "" : selectedId}
                  readOnly
                />
                <button
                  type="submit"
                  style={primaryButtonStyle}
                  disabled={!selectedId && !imageUrl}
                >
                  Salvar no perfil
                </button>
              </form>

              <form action={clearAction}>
                <button type="submit" style={ghostButtonStyle}>
                  Remover moldura
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={panelTitleStyle}>Upload profissional</h2>
        <p style={mutedStyle}>
          Envie GIF ou WebM. Para WebM, também dá para subir um poster de
          preview.
        </p>

        <div
          style={{
            marginTop: "18px",
            display: "grid",
            gridTemplateColumns: "0.8fr 1.2fr",
            gap: "16px",
          }}
        >
          <div style={uploadBoxStyle}>
            <div style={uploadTitleStyle}>Arquivos</div>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={ghostButtonStyle}
            >
              {uploading ? "Enviando mídia..." : "Escolher GIF / WebM / PNG"}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,video/webm"
              style={{ display: "none" }}
              onChange={(e) => uploadFile(e.target.files?.[0] ?? null, "main")}
            />

            <button
              type="button"
              onClick={() => posterRef.current?.click()}
              style={{ ...ghostButtonStyle, marginTop: "12px" }}
            >
              {posterUploading ? "Enviando poster..." : "Escolher poster preview"}
            </button>

            <input
              ref={posterRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              style={{ display: "none" }}
              onChange={(e) =>
                uploadFile(e.target.files?.[0] ?? null, "poster")
              }
            />

            <div
              style={{
                marginTop: "14px",
                color: "#a3a3a3",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              • GIF: funciona direto.
              <br />
              • WebM: use poster para miniatura mais bonita.
              <br />
              • Ideal para molduras transparentes.
            </div>
          </div>

          <form action={uploadAction} style={uploadBoxStyle}>
            <div style={uploadTitleStyle}>Configurar moldura</div>

            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da moldura"
              style={inputStyle}
            />

            <input
              name="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL da mídia principal"
              style={inputStyle}
            />

            <input
              name="posterUrl"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="URL do poster preview (opcional)"
              style={inputStyle}
            />

            <select
              name="mediaType"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              style={inputStyle}
            >
              <option value="image">image</option>
              <option value="gif">gif</option>
              <option value="webm">webm</option>
            </select>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <label style={labelStyle}>
                Escala
                <input
                  type="number"
                  name="overlayScale"
                  value={overlayScale}
                  onChange={(e) =>
                    setOverlayScale(Number(e.target.value || 100))
                  }
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Offset Y
                <input
                  type="number"
                  name="overlayOffsetY"
                  value={overlayOffsetY}
                  onChange={(e) =>
                    setOverlayOffsetY(Number(e.target.value || 0))
                  }
                  style={inputStyle}
                />
              </label>
            </div>

            <button
              type="submit"
              style={primaryButtonStyle}
              disabled={!name || !imageUrl}
            >
              Criar e salvar moldura
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

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

const mutedStyle: React.CSSProperties = {
  color: "#a3a3a3",
  marginTop: "10px",
  marginBottom: 0,
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

const ghostButtonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
  backgroundColor: "#141414",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const previewShellStyle: React.CSSProperties = {
  marginTop: "18px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.07)",
  background:
    "radial-gradient(circle at top, rgba(244,114,182,0.10), transparent 28%), linear-gradient(180deg, #111114, #09090b)",
  padding: "22px",
};

const previewCardStyle: React.CSSProperties = {
  minHeight: "420px",
  borderRadius: "24px",
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.12))",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "32px 16px",
};

const uploadBoxStyle: React.CSSProperties = {
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.07)",
  background:
    "linear-gradient(180deg, rgba(18,18,22,0.96), rgba(10,10,14,0.96))",
  padding: "16px",
  display: "grid",
  gap: "12px",
};

const uploadTitleStyle: React.CSSProperties = {
  fontWeight: 900,
  fontSize: "18px",
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
  color: "#d4d4d8",
  fontSize: "14px",
  fontWeight: 700,
};

const checkStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  width: "24px",
  height: "24px",
  borderRadius: "999px",
  backgroundColor: "rgba(244,114,182,0.18)",
  border: "1px solid rgba(244,114,182,0.32)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
};
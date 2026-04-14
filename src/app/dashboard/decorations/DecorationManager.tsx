"use client";

import { useMemo, useRef, useState } from "react";

type Decoration = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  previewUrl: string | null;
  posterUrl?: string | null;
  mediaType?: string | null;
  overlayScale?: number | null;
  overlayOffsetY?: number | null;
};

type Props = {
  decorations: Decoration[];
  selectedDecorationId?: string | null;
  selectedScale: number;
  selectedOffsetX: number;
  selectedOffsetY: number;
  saveAction: (formData: FormData) => Promise<void>;
  clearAction: () => Promise<void>;
  uploadAction: (formData: FormData) => Promise<void>;
  avatarUrl?: string | null;
  displayName: string;
  username: string;
};

export default function DecorationManager({
  decorations,
  selectedDecorationId,
  selectedScale,
  selectedOffsetX,
  selectedOffsetY,
  saveAction,
  clearAction,
  uploadAction,
  avatarUrl,
  displayName,
  username,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  const [selectedId, setSelectedId] = useState(
    selectedDecorationId || decorations[0]?.id || ""
  );
  const [scale, setScale] = useState(selectedScale || 165);
  const [offsetX, setOffsetX] = useState(selectedOffsetX || 0);
  const [offsetY, setOffsetY] = useState(selectedOffsetY || 0);

  const [uploadName, setUploadName] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const selected = useMemo(
    () => decorations.find((item) => item.id === selectedId) || null,
    [decorations, selectedId]
  );

  async function handleUpload(file: File | null) {
    if (!file) return;
    setUploading(true);

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

      setUploadUrl(data.url);

      if (!uploadName) {
        const raw = file.name.replace(/\.[^.]+$/, "").trim();
        setUploadName(raw || "Minha moldura");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: offsetX,
      baseY: offsetY,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    setOffsetX(Math.round(dragRef.current.baseX + dx));
    setOffsetY(Math.round(dragRef.current.baseY + dy));
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  return (
    <div style={{ display: "grid", gap: "22px" }}>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "18px",
        }}
      >
        <div style={panelStyle}>
          <h2 style={panelTitleStyle}>Escolher moldura</h2>
          <p style={mutedStyle}>Selecione uma moldura para editar.</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "14px",
              marginTop: "18px",
            }}
          >
            {decorations.map((item) => {
              const active = item.id === selectedId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
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
                      height: "180px",
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

                    {active ? (
                      <div
                        style={{
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
                        }}
                      >
                        ✓
                      </div>
                    ) : null}
                  </div>

                  <div style={{ marginTop: "12px", fontWeight: 800, fontSize: "16px" }}>
                    {item.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={panelStyle}>
          <h2 style={panelTitleStyle}>Preview</h2>
          <p style={mutedStyle}>Arraste a moldura e ajuste a escala.</p>

          <div
            style={{
              marginTop: "18px",
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.07)",
              background:
                "radial-gradient(circle at top, rgba(244,114,182,0.10), transparent 28%), linear-gradient(180deg, #111114, #09090b)",
              padding: "22px",
            }}
          >
            <div
              style={{
                height: "420px",
                borderRadius: "24px",
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.12))",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                style={{
                  position: "relative",
                  width: "170px",
                  height: "170px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  touchAction: "none",
                  userSelect: "none",
                  cursor: "grab",
                }}
              >
                {selected ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                      zIndex: 3,
                      transform: `translate(${offsetX}px, ${offsetY}px)`,
                    }}
                  >
                    {selected.mediaType === "webm" ? (
                      <video
                        src={selected.imageUrl}
                        poster={selected.posterUrl || selected.previewUrl || undefined}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                          width: `${scale}%`,
                          height: `${scale}%`,
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <img
                        src={selected.previewUrl || selected.imageUrl}
                        alt={selected.name}
                        style={{
                          width: `${scale}%`,
                          height: `${scale}%`,
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>
                ) : null}

                <img
                  src={avatarUrl || "https://placehold.co/300x300?text=Y"}
                  alt={displayName}
                  style={{
                    width: "128px",
                    height: "128px",
                    borderRadius: "999px",
                    objectFit: "cover",
                    border: "4px solid #f472b6",
                    backgroundColor: "#111",
                    zIndex: 2,
                  }}
                />
              </div>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <div style={{ fontSize: "26px", fontWeight: 900 }}>{displayName}</div>
                <div style={{ color: "#9ca3af", marginTop: "4px" }}>@{username}</div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
              <label style={labelStyle}>
                Escala: {scale}%
                <input
                  type="range"
                  min="90"
                  max="240"
                  step="1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label style={labelStyle}>
                  Offset X
                  <input
                    type="number"
                    value={offsetX}
                    onChange={(e) => setOffsetX(Number(e.target.value))}
                    style={inputStyle}
                  />
                </label>

                <label style={labelStyle}>
                  Offset Y
                  <input
                    type="number"
                    value={offsetY}
                    onChange={(e) => setOffsetY(Number(e.target.value))}
                    style={inputStyle}
                  />
                </label>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
              <form action={saveAction}>
                <input type="hidden" name="decorationId" value={selectedId} readOnly />
                <input type="hidden" name="scale" value={scale} readOnly />
                <input type="hidden" name="offsetX" value={offsetX} readOnly />
                <input type="hidden" name="offsetY" value={offsetY} readOnly />
                <button type="submit" style={primaryButtonStyle}>
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
        <h2 style={panelTitleStyle}>Upload de moldura</h2>
        <p style={mutedStyle}>Envie PNG, GIF ou WebM para usar no perfil.</p>

        <div
          style={{
            marginTop: "18px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div
            style={{
              borderRadius: "22px",
              border: "1px solid rgba(255,255,255,0.07)",
              background:
                "linear-gradient(180deg, rgba(18,18,22,0.96), rgba(10,10,14,0.96))",
              padding: "16px",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: "12px" }}>Arquivo</div>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={ghostButtonStyle}
            >
              {uploading ? "Enviando..." : "Escolher do PC"}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,video/webm"
              style={{ display: "none" }}
              onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
            />

            <div style={{ marginTop: "14px", color: "#a3a3a3", fontSize: "14px" }}>
              Dica: PNG transparente ou WebM transparente.
            </div>
          </div>

          <form
            action={uploadAction}
            style={{
              borderRadius: "22px",
              border: "1px solid rgba(255,255,255,0.07)",
              background:
                "linear-gradient(180deg, rgba(18,18,22,0.96), rgba(10,10,14,0.96))",
              padding: "16px",
              display: "grid",
              gap: "12px",
            }}
          >
            <div style={{ fontWeight: 800 }}>Publicar moldura</div>

            <input
              name="name"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="Nome da moldura"
              style={inputStyle}
            />

            <input
              name="imageUrl"
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              placeholder="URL da mídia enviada"
              style={inputStyle}
            />

            <input name="mediaType" defaultValue="image" type="hidden" />
            <button type="submit" style={primaryButtonStyle} disabled={!uploadName || !uploadUrl}>
              Criar e salvar
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

const ghostButtonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
  backgroundColor: "#141414",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};
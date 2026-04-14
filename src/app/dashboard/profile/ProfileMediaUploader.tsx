"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  type: "avatar" | "banner";
  currentUrl?: string | null;
  themeColor?: string | null;
};

type CropState = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

const AVATAR_SIZE = 512;
const BANNER_WIDTH = 1600;
const BANNER_HEIGHT = 500;

export default function ProfileMediaUploader({
  type,
  currentUrl,
  themeColor,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceMime, setSourceMime] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [crop, setCrop] = useState<CropState>({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  });

  const activePreview = sourceUrl || currentUrl || "";
  const accent = themeColor || "#f472b6";
  const isAvatar = type === "avatar";

  useEffect(() => {
    return () => {
      if (sourceUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(sourceUrl);
      }
    };
  }, [sourceUrl]);

  function openPicker() {
    fileInputRef.current?.click();
  }

  function resetEditor() {
    setCrop({
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
    setError(null);
  }

  function resetAll() {
    if (sourceUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(sourceUrl);
    }
    setSourceUrl(null);
    setSourceMime(null);
    setCrop({
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
    setUploadProgress(0);
    setError(null);
  }

  async function onPickFile(file: File | null) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Escolha uma imagem válida.");
      return;
    }

    if (sourceUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(sourceUrl);
    }

    const localUrl = URL.createObjectURL(file);
    setSourceUrl(localUrl);
    setSourceMime(file.type);
    setCrop({
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
    setUploadProgress(0);
    setError(null);
  }

  function onDropzoneDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingFile(true);
  }

  function onDropzoneDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingFile(false);
  }

  async function onDropzoneDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    await onPickFile(file);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: crop.offsetX,
      baseY: crop.offsetY,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    setCrop((prev) => ({
      ...prev,
      offsetX: Math.round(dragRef.current!.baseX + dx),
      offsetY: Math.round(dragRef.current!.baseY + dy),
    }));
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  async function removeMedia() {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/profile/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isAvatar ? { avatarUrl: "" } : { bannerUrl: "" }),
      });

      if (!res.ok) {
        throw new Error("Falha ao remover mídia.");
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao remover mídia.");
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadEdited() {
    if (!sourceUrl) return;

    setIsUploading(true);
    setUploadProgress(8);
    setError(null);

    try {
      let fileToUpload: File;

      const sourceResponse = await fetch(sourceUrl);
      const originalBlob = await sourceResponse.blob();
      const isGif = originalBlob.type === "image/gif";

      setUploadProgress(18);

      if (isGif) {
        fileToUpload = new File([originalBlob], `${type}-${Date.now()}.gif`, {
          type: "image/gif",
        });
      } else {
        const croppedBlob = await renderCroppedBlob(sourceUrl, type, crop);
        setUploadProgress(38);

        fileToUpload = new File([croppedBlob], `${type}-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
      }

      const uploadForm = new FormData();
      uploadForm.append("file", fileToUpload);

      const uploadJson = await uploadWithProgress("/api/upload", uploadForm, (progress) => {
        const mapped = 40 + Math.round(progress * 0.45);
        setUploadProgress(Math.min(mapped, 88));
      });

      if (!uploadJson?.url) {
        throw new Error(uploadJson?.error || "Falha no upload.");
      }

      setUploadProgress(92);

      const saveRes = await fetch("/api/profile/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isAvatar ? { avatarUrl: uploadJson.url } : { bannerUrl: uploadJson.url }
        ),
      });

      if (!saveRes.ok) {
        throw new Error("Falha ao salvar no perfil.");
      }

      setUploadProgress(100);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  }

  function nudge(dx: number, dy: number) {
    setCrop((prev) => ({
      ...prev,
      offsetX: prev.offsetX + dx,
      offsetY: prev.offsetY + dy,
    }));
  }

  const isGif = sourceMime === "image/gif";

  return (
    <section
      style={{
        backgroundColor: "#0b0b0b",
        border: "1px solid #1f1f1f",
        borderRadius: "24px",
        padding: "20px",
        display: "grid",
        gap: "16px",
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: "24px" }}>
          {isAvatar ? "Avatar" : "Banner"}
        </h2>
        <p style={{ color: "#a3a3a3", marginTop: "8px", marginBottom: 0 }}>
          {isAvatar
            ? "Arraste arquivo, enquadre e compare antes e depois."
            : "Arraste arquivo, ajuste o enquadramento e compare antes e depois."}
        </p>
      </div>

      <div
        onDragOver={onDropzoneDragOver}
        onDragLeave={onDropzoneDragLeave}
        onDrop={onDropzoneDrop}
        onClick={openPicker}
        style={{
          borderRadius: "22px",
          border: isDraggingFile
            ? `1px solid ${accent}`
            : "1px dashed rgba(255,255,255,0.18)",
          background: isDraggingFile
            ? `linear-gradient(180deg, ${accent}14, rgba(10,10,14,0.96))`
            : "linear-gradient(180deg, rgba(18,18,22,0.96), rgba(10,10,14,0.96))",
          padding: "22px",
          cursor: "pointer",
          transition: "all 180ms ease",
          boxShadow: isDraggingFile ? `0 0 0 4px ${accent}12` : "none",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "8px",
            justifyItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "18px",
              display: "grid",
              placeItems: "center",
              backgroundColor: "rgba(244,114,182,0.10)",
              border: "1px solid rgba(244,114,182,0.18)",
              fontSize: "22px",
            }}
          >
            ⤴
          </div>

          <div style={{ fontWeight: 800, fontSize: "16px" }}>
            Arraste e solte sua imagem aqui
          </div>

          <div style={{ color: "#a3a3a3", fontSize: "14px" }}>
            ou clique para escolher do seu PC
          </div>

          <div style={{ color: "#71717a", fontSize: "12px" }}>
            PNG, JPG, WEBP e GIF
          </div>
        </div>
      </div>

      {isUploading ? (
        <div
          style={{
            borderRadius: "16px",
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "10px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <span>Enviando imagem</span>
            <span>{uploadProgress}%</span>
          </div>

          <div
            style={{
              height: "10px",
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "100%",
                borderRadius: "999px",
                background: `linear-gradient(90deg, ${accent}, rgba(244,114,182,0.65))`,
                transition: "width 180ms ease",
              }}
            />
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <CompareCard title="Antes">
          {isAvatar ? (
            <AvatarStaticPreview imageUrl={currentUrl || ""} accent={accent} />
          ) : (
            <BannerStaticPreview imageUrl={currentUrl || ""} accent={accent} />
          )}
        </CompareCard>

        <CompareCard title="Depois">
          {isAvatar ? (
            <AvatarEditorPreview
              imageUrl={activePreview}
              crop={crop}
              accent={accent}
              sourceMime={sourceMime}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
          ) : (
            <BannerEditorPreview
              imageUrl={activePreview}
              crop={crop}
              accent={accent}
              sourceMime={sourceMime}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
          )}
        </CompareCard>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        <label style={labelStyle}>
          Zoom: {crop.zoom.toFixed(2)}x
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={crop.zoom}
            onChange={(e) =>
              setCrop((prev) => ({ ...prev, zoom: Number(e.target.value) }))
            }
          />
        </label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <label style={labelStyle}>
            Posição X
            <input
              type="range"
              min="-240"
              max="240"
              step="1"
              value={crop.offsetX}
              onChange={(e) =>
                setCrop((prev) => ({
                  ...prev,
                  offsetX: Number(e.target.value),
                }))
              }
            />
          </label>

          <label style={labelStyle}>
            Posição Y
            <input
              type="range"
              min="-240"
              max="240"
              step="1"
              value={crop.offsetY}
              onChange={(e) =>
                setCrop((prev) => ({
                  ...prev,
                  offsetY: Number(e.target.value),
                }))
              }
            />
          </label>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "10px",
          }}
        >
          <button type="button" onClick={() => nudge(-10, 0)} style={ghostButtonStyle}>
            ←
          </button>
          <button type="button" onClick={() => nudge(10, 0)} style={ghostButtonStyle}>
            →
          </button>
          <button type="button" onClick={() => nudge(0, -10)} style={ghostButtonStyle}>
            ↑
          </button>
          <button type="button" onClick={() => nudge(0, 10)} style={ghostButtonStyle}>
            ↓
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button type="button" onClick={openPicker} style={primaryButtonStyle}>
          Escolher imagem
        </button>

        <button
          type="button"
          onClick={uploadEdited}
          disabled={!sourceUrl || isUploading}
          style={primaryButtonStyle}
        >
          {isUploading ? "Salvando..." : "Salvar imagem"}
        </button>

        <button
          type="button"
          onClick={resetEditor}
          disabled={!sourceUrl}
          style={ghostButtonStyle}
        >
          Resetar ajuste
        </button>

        <button
          type="button"
          onClick={resetAll}
          disabled={!sourceUrl}
          style={ghostButtonStyle}
        >
          Limpar editor
        </button>

        <button
          type="button"
          onClick={removeMedia}
          disabled={isSaving}
          style={dangerButtonStyle}
        >
          {isSaving ? "Removendo..." : "Remover"}
        </button>
      </div>

      {error ? (
        <div
          style={{
            backgroundColor: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.22)",
            color: "#fca5a5",
            borderRadius: "16px",
            padding: "12px 14px",
          }}
        >
          {error}
        </div>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
      />
    </section>
  );
}

function CompareCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.07)",
        background:
          "linear-gradient(180deg, rgba(18,18,22,0.96), rgba(10,10,14,0.96))",
        padding: "16px",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          fontWeight: 800,
          color: "#d4d4d8",
          marginBottom: "12px",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function AvatarStaticPreview({
  imageUrl,
  accent,
}: {
  imageUrl: string;
  accent: string;
}) {
  return (
    <div
      style={{
        minHeight: "320px",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: "190px",
          height: "190px",
          borderRadius: "999px",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          border: `4px solid ${accent}`,
          boxShadow: `0 0 0 8px rgba(0,0,0,0.24), 0 18px 40px ${accent}22`,
          position: "relative",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Avatar atual"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <EmptyPlaceholder text="Sem avatar atual" />
        )}
      </div>
    </div>
  );
}

function BannerStaticPreview({
  imageUrl,
  accent,
}: {
  imageUrl: string;
  accent: string;
}) {
  return (
    <div
      style={{
        minHeight: "260px",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          height: "200px",
          borderRadius: "20px",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${accent}, rgba(17,24,39,0.72), rgba(0,0,0,0.35))`,
          border: "1px solid rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Banner atual"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <EmptyPlaceholder text="Sem banner atual" />
        )}
      </div>
    </div>
  );
}

function AvatarEditorPreview({
  imageUrl,
  crop,
  accent,
  sourceMime,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  imageUrl: string;
  crop: CropState;
  accent: string;
  sourceMime: string | null;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
}) {
  const isGif = sourceMime === "image/gif";

  return (
    <div
      style={{
        minHeight: "320px",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          width: "190px",
          height: "190px",
          borderRadius: "999px",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          border: `4px solid ${accent}`,
          boxShadow: `0 0 0 8px rgba(0,0,0,0.24), 0 18px 40px ${accent}22`,
          position: "relative",
          cursor: "grab",
          touchAction: "none",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Avatar preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate(${crop.offsetX}px, ${crop.offsetY}px) scale(${crop.zoom})`,
              transformOrigin: "center center",
            }}
          />
        ) : (
          <EmptyPlaceholder text="Escolha uma imagem" />
        )}
      </div>

      {isGif ? (
        <div style={{ marginTop: "12px", color: "#a3a3a3", fontSize: "12px" }}>
          GIF detectado: animação será preservada.
        </div>
      ) : null}
    </div>
  );
}

function BannerEditorPreview({
  imageUrl,
  crop,
  accent,
  sourceMime,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  imageUrl: string;
  crop: CropState;
  accent: string;
  sourceMime: string | null;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
}) {
  const isGif = sourceMime === "image/gif";

  return (
    <div
      style={{
        minHeight: "260px",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          width: "100%",
          maxWidth: "620px",
          height: "200px",
          borderRadius: "20px",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${accent}, rgba(17,24,39,0.72), rgba(0,0,0,0.35))`,
          border: "1px solid rgba(255,255,255,0.08)",
          position: "relative",
          cursor: "grab",
          touchAction: "none",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Banner preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate(${crop.offsetX}px, ${crop.offsetY}px) scale(${crop.zoom})`,
              transformOrigin: "center center",
            }}
          />
        ) : (
          <EmptyPlaceholder text="Escolha uma imagem" />
        )}
      </div>

      {isGif ? (
        <div style={{ marginTop: "12px", color: "#a3a3a3", fontSize: "12px" }}>
          GIF detectado: animação será preservada.
        </div>
      ) : null}
    </div>
  );
}

function EmptyPlaceholder({ text }: { text: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        color: "#a3a3a3",
        fontWeight: 700,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
      }}
    >
      {text}
    </div>
  );
}

async function renderCroppedBlob(
  sourceUrl: string,
  type: "avatar" | "banner",
  crop: CropState
): Promise<Blob> {
  const image = await loadImage(sourceUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas não disponível.");
  }

  const outWidth = type === "avatar" ? AVATAR_SIZE : BANNER_WIDTH;
  const outHeight = type === "avatar" ? AVATAR_SIZE : BANNER_HEIGHT;

  canvas.width = outWidth;
  canvas.height = outHeight;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, outWidth, outHeight);

  const scale = crop.zoom;
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;

  const x = (outWidth - drawWidth) / 2 + crop.offsetX;
  const y = (outHeight - drawHeight) / 2 + crop.offsetY;

  ctx.drawImage(image, x, y, drawWidth, drawHeight);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.92);
  });

  if (!blob) {
    throw new Error("Falha ao gerar imagem.");
  }

  return blob;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

function uploadWithProgress(
  url: string,
  formData: FormData,
  onProgress: (progress: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress(progress);
    };

    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(json);
        } else {
          reject(new Error(json?.error || "Falha no upload."));
        }
      } catch {
        reject(new Error("Resposta inválida do upload."));
      }
    };

    xhr.onerror = () => reject(new Error("Falha de rede no upload."));
    xhr.send(formData);
  });
}

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
  color: "#d4d4d8",
  fontSize: "14px",
  fontWeight: 700,
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

const dangerButtonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(239,68,68,0.18)",
  backgroundColor: "rgba(239,68,68,0.10)",
  color: "#fca5a5",
  cursor: "pointer",
  fontWeight: "bold",
};
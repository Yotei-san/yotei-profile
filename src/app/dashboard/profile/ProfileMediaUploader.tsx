"use client";

import type { CSSProperties, DragEvent, PointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  PROFILE_BANNER_ACCEPT,
  PROFILE_BANNER_VIDEO_MAX_BYTES,
  PROFILE_BANNER_VIDEO_MIME_TYPES,
  PROFILE_IMAGE_ACCEPT,
  PROFILE_IMAGE_MAX_BYTES,
  PROFILE_IMAGE_MIME_TYPES,
  formatBytes,
  getMediaKind,
} from "@/app/lib/profile-media";

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

type AvatarFitMode = "cover" | "contain";

const AVATAR_SIZE = 512;
const AVATAR_PREVIEW_SIZE = 190;
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
  const [sourceFile, setSourceFile] = useState<File | null>(null);
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
  const [avatarFitMode, setAvatarFitMode] = useState<AvatarFitMode>("cover");

  const accent = themeColor || "#f472b6";
  const isAvatar = type === "avatar";
  const activePreview = sourceUrl || currentUrl || "";
  const currentKind = getMediaKind(currentUrl || "");
  const sourceKind = sourceMime
    ? sourceMime.startsWith("video/")
      ? "video"
      : "image"
    : sourceUrl
      ? getMediaKind(sourceUrl)
      : "unknown";
  const activePreviewKind = sourceUrl ? sourceKind : currentKind;
  const isVideoBannerPreview = !isAvatar && activePreviewKind === "video";
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
    setAvatarFitMode("cover");
    setError(null);
  }

  function resetAll() {
    if (sourceUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(sourceUrl);
    }

    setSourceUrl(null);
    setSourceMime(null);
    setSourceFile(null);
    setCrop({
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
    setAvatarFitMode("cover");
    setUploadProgress(0);
    setError(null);
  }

  async function onPickFile(file: File | null) {
    if (!file) return;

    const mimeType = file.type.toLowerCase();
    const isImage = PROFILE_IMAGE_MIME_TYPES.includes(
      mimeType as (typeof PROFILE_IMAGE_MIME_TYPES)[number]
    );
    const isVideo =
      !isAvatar &&
      PROFILE_BANNER_VIDEO_MIME_TYPES.includes(
        mimeType as (typeof PROFILE_BANNER_VIDEO_MIME_TYPES)[number]
      );

    if (!isImage && !isVideo) {
      setError(
        isAvatar
          ? "Avatar aceita apenas PNG, JPG, WEBP ou GIF."
          : "Banner aceita imagem, GIF ou video MP4/WebM/MOV."
      );
      return;
    }

    const maxSize = isVideo ? PROFILE_BANNER_VIDEO_MAX_BYTES : PROFILE_IMAGE_MAX_BYTES;

    if (file.size > maxSize) {
      setError(
        isVideo
          ? `Video muito grande. O limite do banner em video e ${formatBytes(
              PROFILE_BANNER_VIDEO_MAX_BYTES
            )}.`
          : `Arquivo muito grande. O limite para imagem e ${formatBytes(
              PROFILE_IMAGE_MAX_BYTES
            )}.`
      );
      return;
    }

    if (sourceUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(sourceUrl);
    }

    const localUrl = URL.createObjectURL(file);
    setSourceUrl(localUrl);
    setSourceMime(file.type);
    setSourceFile(file);
    setCrop({
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
    setAvatarFitMode("cover");
    setUploadProgress(0);
    setError(null);
  }

  function onDropzoneDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingFile(true);
  }

  function onDropzoneDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingFile(false);
  }

  async function onDropzoneDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    await onPickFile(file);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (isVideoBannerPreview) return;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: crop.offsetX,
      baseY: crop.offsetY,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || isVideoBannerPreview) return;

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
        throw new Error("Falha ao remover media.");
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao remover media.");
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadEdited() {
    if (!sourceUrl || !sourceFile) return;

    setIsUploading(true);
    setUploadProgress(8);
    setError(null);

    try {
      let fileToUpload: File;
      const isVideo = sourceFile.type.startsWith("video/");

      if (isVideo || sourceFile.type === "image/gif") {
        fileToUpload = sourceFile;
        setUploadProgress(28);
      } else {
        const croppedBlob = await renderCroppedBlob(sourceUrl, type, crop, avatarFitMode);
        setUploadProgress(38);

        fileToUpload = new File([croppedBlob], `${type}-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
      }

      const uploadForm = new FormData();
      uploadForm.append("file", fileToUpload);
      uploadForm.append("purpose", isAvatar ? "avatar" : "banner");

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

  const accept = isAvatar ? PROFILE_IMAGE_ACCEPT : PROFILE_BANNER_ACCEPT;
  const dropzoneFormats = isAvatar
    ? "PNG, JPG, WEBP e GIF"
    : "PNG, JPG, WEBP, GIF, MP4, WebM e MOV";
  const uploadActionLabel = isAvatar ? "Salvar imagem" : "Salvar banner";
  const pickActionLabel = isAvatar ? "Escolher imagem" : "Escolher banner";
  const zoomMin = isAvatar ? 0.35 : 1;
  const positionLimit = isAvatar ? 320 : 240;

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
            : "Banners aceitam imagem, GIF ou video MP4/WebM/MOV."}
        </p>
        {!isAvatar ? (
          <p style={{ color: "#71717a", marginTop: "8px", marginBottom: 0, fontSize: "13px" }}>
            Recomendado: video curto, 5-10s, horizontal, ate 30MB.
          </p>
        ) : null}
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
            ^
          </div>

          <div style={{ fontWeight: 800, fontSize: "16px" }}>
            {isAvatar ? "Arraste e solte seu avatar aqui" : "Arraste e solte seu banner aqui"}
          </div>

          <div style={{ color: "#a3a3a3", fontSize: "14px" }}>
            ou clique para escolher do seu PC
          </div>

          <div style={{ color: "#71717a", fontSize: "12px" }}>{dropzoneFormats}</div>
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
            <span>{isAvatar ? "Enviando imagem" : "Enviando banner"}</span>
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
            <BannerStaticPreview mediaUrl={currentUrl || ""} accent={accent} />
          )}
        </CompareCard>

        <CompareCard title="Depois">
          {isAvatar ? (
            <AvatarEditorPreview
              imageUrl={activePreview}
              crop={crop}
              fitMode={avatarFitMode}
              accent={accent}
              sourceMime={sourceMime}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
          ) : (
            <BannerEditorPreview
              mediaUrl={activePreview}
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

      {!isVideoBannerPreview ? (
        <div style={{ display: "grid", gap: "12px" }}>
          {isAvatar ? (
            <div style={{ display: "grid", gap: "8px" }}>
              <div style={labelStyle}>Enquadramento</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setAvatarFitMode("cover")}
                  style={avatarFitMode === "cover" ? primaryButtonStyle : ghostButtonStyle}
                >
                  Preencher avatar
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarFitMode("contain")}
                  style={avatarFitMode === "contain" ? primaryButtonStyle : ghostButtonStyle}
                >
                  Mostrar imagem inteira
                </button>
              </div>
            </div>
          ) : null}

          <label style={labelStyle}>
            Zoom: {crop.zoom.toFixed(2)}x
            <input
              type="range"
              min={String(zoomMin)}
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
              Posicao X
              <input
                type="range"
                min={String(-positionLimit)}
                max={String(positionLimit)}
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
              Posicao Y
              <input
                type="range"
                min={String(-positionLimit)}
                max={String(positionLimit)}
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
              {"<-"}
            </button>
            <button type="button" onClick={() => nudge(10, 0)} style={ghostButtonStyle}>
              {"->"}
            </button>
            <button type="button" onClick={() => nudge(0, -10)} style={ghostButtonStyle}>
              {"^"}
            </button>
            <button type="button" onClick={() => nudge(0, 10)} style={ghostButtonStyle}>
              {"v"}
            </button>
          </div>

          {isAvatar ? (
            <div style={{ color: "#a3a3a3", fontSize: "12px", lineHeight: 1.6 }}>
              Use "Mostrar imagem inteira" para imagens largas. O arquivo salvo respeita o
              mesmo zoom e deslocamento mostrados no preview.
            </div>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            borderRadius: "16px",
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "14px 16px",
            color: "#cbd5e1",
            fontSize: "13px",
            lineHeight: 1.65,
          }}
        >
          Video detectado: o banner sera enviado sem recorte e reproduzido com autoplay,
          muted, loop e playsInline no perfil publico.
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button type="button" onClick={openPicker} style={primaryButtonStyle}>
          {pickActionLabel}
        </button>

        <button
          type="button"
          onClick={uploadEdited}
          disabled={!sourceUrl || isUploading}
          style={primaryButtonStyle}
        >
          {isUploading ? "Salvando..." : uploadActionLabel}
        </button>

        <button
          type="button"
          onClick={resetEditor}
          disabled={!sourceUrl || isVideoBannerPreview}
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
        accept={accept}
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
  children: ReactNode;
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
  mediaUrl,
  accent,
}: {
  mediaUrl: string;
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
      <BannerFrame mediaUrl={mediaUrl} accent={accent} />
    </div>
  );
}

function AvatarEditorPreview({
  imageUrl,
  crop,
  fitMode,
  accent,
  sourceMime,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  imageUrl: string;
  crop: CropState;
  fitMode: AvatarFitMode;
  accent: string;
  sourceMime: string | null;
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
}) {
  const isGif = sourceMime === "image/gif";
  const dimensions = useImageDimensions(imageUrl);
  const layout = dimensions
    ? getImageLayout(
        dimensions.width,
        dimensions.height,
        AVATAR_PREVIEW_SIZE,
        AVATAR_PREVIEW_SIZE,
        crop.zoom,
        crop.offsetX,
        crop.offsetY,
        fitMode
      )
    : null;

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
          width: `${AVATAR_PREVIEW_SIZE}px`,
          height: `${AVATAR_PREVIEW_SIZE}px`,
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
          <>
            {fitMode === "contain" ? (
              <>
                <img
                  src={imageUrl}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "-12%",
                    width: "124%",
                    height: "124%",
                    objectFit: "cover",
                    filter: "blur(24px) brightness(0.42)",
                    transform: "scale(1.08)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 58%), linear-gradient(180deg, rgba(4,6,10,0.14), rgba(4,6,10,0.58))",
                  }}
                />
              </>
            ) : null}

            {layout ? (
              <img
                src={imageUrl}
                alt="Avatar preview"
                style={{
                  position: "absolute",
                  left: `${layout.x}px`,
                  top: `${layout.y}px`,
                  width: `${layout.width}px`,
                  height: `${layout.height}px`,
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  color: "#a3a3a3",
                  fontSize: "12px",
                }}
              >
                Carregando preview...
              </div>
            )}
          </>
        ) : (
          <EmptyPlaceholder text="Escolha uma imagem" />
        )}
      </div>

      {isGif ? (
        <div style={{ marginTop: "12px", color: "#a3a3a3", fontSize: "12px" }}>
          GIF detectado: a animacao sera preservada.
        </div>
      ) : null}
    </div>
  );
}

function BannerEditorPreview({
  mediaUrl,
  crop,
  accent,
  sourceMime,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  mediaUrl: string;
  crop: CropState;
  accent: string;
  sourceMime: string | null;
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
}) {
  const mediaKind = sourceMime
    ? sourceMime.startsWith("video/")
      ? "video"
      : "image"
    : getMediaKind(mediaUrl);

  return (
    <div
      style={{
        minHeight: "260px",
        display: "grid",
        placeItems: "center",
      }}
    >
      {mediaKind === "video" ? (
        <>
          <BannerFrame mediaUrl={mediaUrl} accent={accent} mediaKind="video" />
          <div style={{ marginTop: "12px", color: "#a3a3a3", fontSize: "12px" }}>
            Video detectado: sera enviado sem recorte.
          </div>
        </>
      ) : (
        <>
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
            {mediaUrl ? (
              <img
                src={mediaUrl}
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

          {sourceMime === "image/gif" ? (
            <div style={{ marginTop: "12px", color: "#a3a3a3", fontSize: "12px" }}>
              GIF detectado: a animacao sera preservada.
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function BannerFrame({
  mediaUrl,
  accent,
  mediaKind,
}: {
  mediaUrl: string;
  accent: string;
  mediaKind?: "video" | "image" | "unknown";
}) {
  const resolvedMediaKind = mediaKind || getMediaKind(mediaUrl);

  return (
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
      {mediaUrl ? (
        resolvedMediaKind === "video" ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              backgroundColor: "#000",
            }}
          >
            <source src={mediaUrl} />
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt="Banner atual"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )
      ) : (
        <EmptyPlaceholder text="Sem banner atual" />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,10,14,0.10), rgba(10,10,14,0.42) 54%, rgba(10,10,14,0.72) 100%)",
          pointerEvents: "none",
        }}
      />
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
  crop: CropState,
  avatarFitMode: AvatarFitMode
): Promise<Blob> {
  const image = await loadImage(sourceUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas nao disponivel.");
  }

  const outWidth = type === "avatar" ? AVATAR_SIZE : BANNER_WIDTH;
  const outHeight = type === "avatar" ? AVATAR_SIZE : BANNER_HEIGHT;

  canvas.width = outWidth;
  canvas.height = outHeight;

  if (type === "avatar") {
    renderAvatarToCanvas(ctx, image, crop, avatarFitMode, outWidth, outHeight);
  } else {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, outWidth, outHeight);

    const scale = crop.zoom;
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;

    const x = (outWidth - drawWidth) / 2 + crop.offsetX;
    const y = (outHeight - drawHeight) / 2 + crop.offsetY;

    ctx.drawImage(image, x, y, drawWidth, drawHeight);
  }

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

function useImageDimensions(src: string) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    if (!src) {
      setDimensions(null);
      return;
    }

    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (!cancelled) {
        setDimensions({
          width: image.naturalWidth || image.width,
          height: image.naturalHeight || image.height,
        });
      }
    };

    image.onerror = () => {
      if (!cancelled) {
        setDimensions(null);
      }
    };

    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return dimensions;
}

function renderAvatarToCanvas(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  crop: CropState,
  fitMode: AvatarFitMode,
  outWidth: number,
  outHeight: number
) {
  ctx.fillStyle = "#05070c";
  ctx.fillRect(0, 0, outWidth, outHeight);

  if (fitMode === "contain") {
    const backgroundLayout = getImageLayout(
      image.width,
      image.height,
      outWidth,
      outHeight,
      1.08,
      0,
      0,
      "cover"
    );

    ctx.save();
    ctx.filter = "blur(26px) brightness(0.4)";
    ctx.drawImage(
      image,
      backgroundLayout.x,
      backgroundLayout.y,
      backgroundLayout.width,
      backgroundLayout.height
    );
    ctx.restore();

    ctx.fillStyle = "rgba(4, 6, 10, 0.42)";
    ctx.fillRect(0, 0, outWidth, outHeight);
  }

  const avatarOffsetScale = outWidth / AVATAR_PREVIEW_SIZE;
  const layout = getImageLayout(
    image.width,
    image.height,
    outWidth,
    outHeight,
    crop.zoom,
    crop.offsetX * avatarOffsetScale,
    crop.offsetY * avatarOffsetScale,
    fitMode
  );

  ctx.drawImage(image, layout.x, layout.y, layout.width, layout.height);
}

function getImageLayout(
  imageWidth: number,
  imageHeight: number,
  frameWidth: number,
  frameHeight: number,
  zoom: number,
  offsetX: number,
  offsetY: number,
  fitMode: AvatarFitMode
) {
  const fitScale =
    fitMode === "contain"
      ? Math.min(frameWidth / imageWidth, frameHeight / imageHeight)
      : Math.max(frameWidth / imageWidth, frameHeight / imageHeight);
  const scale = fitScale * zoom;
  const width = imageWidth * scale;
  const height = imageHeight * scale;

  return {
    width,
    height,
    x: (frameWidth - width) / 2 + offsetX,
    y: (frameHeight - height) / 2 + offsetY,
  };
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
        reject(new Error("Resposta invalida do upload."));
      }
    };

    xhr.onerror = () => reject(new Error("Falha de rede no upload."));
    xhr.send(formData);
  });
}

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  color: "#d4d4d8",
  fontSize: "14px",
  fontWeight: 700,
};

const primaryButtonStyle: CSSProperties = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
  cursor: "pointer",
  fontWeight: "bold",
};

const ghostButtonStyle: CSSProperties = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
  backgroundColor: "#141414",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const dangerButtonStyle: CSSProperties = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(239,68,68,0.18)",
  backgroundColor: "rgba(239,68,68,0.10)",
  color: "#fca5a5",
  cursor: "pointer",
  fontWeight: "bold",
};

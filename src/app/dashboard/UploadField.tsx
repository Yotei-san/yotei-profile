"use client";

import { useMemo, useRef, useState } from "react";

type Props = {
  label: string;
  name: string;
  initialValue?: string | null;
};

function isVideoField(name: string, label: string) {
  const value = `${name} ${label}`.toLowerCase();
  return value.includes("video");
}

function isVideoUrl(url: string) {
  const normalized = url.toLowerCase();

  return (
    normalized.endsWith(".mp4") ||
    normalized.endsWith(".webm") ||
    normalized.endsWith(".mov") ||
    normalized.includes(".mp4?") ||
    normalized.includes(".webm?") ||
    normalized.includes(".mov?")
  );
}

export default function UploadField({ label, name, initialValue }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(initialValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const allowVideo = useMemo(() => isVideoField(name, label), [name, label]);

  const accept = allowVideo
    ? "image/png,image/jpeg,image/jpg,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
    : "image/png,image/jpeg,image/jpg,image/webp,image/gif";

  const shouldRenderVideoPreview = allowVideo && value && isVideoUrl(value);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";

      let data: any = null;
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || "Erro no upload.");
      }

      if (!response.ok) {
        throw new Error(data?.error || "Erro no upload.");
      }

      if (!data?.url || typeof data.url !== "string") {
        throw new Error("Upload concluído, mas a URL não foi retornada.");
      }

      setValue(data.url);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro no upload.";

      if (
        allowVideo &&
        (
          message.includes("Request Entity Too Large") ||
          message.includes("FUNCTION_PAYLOAD_TOO_LARGE") ||
          message.includes("413")
        )
      ) {
        setError("Vídeo muito grande para upload via servidor no Vercel. Use um arquivo menor que ~4.5 MB.");
      } else {
        setError(message);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "10px",
        backgroundColor: "#111111",
        border: "1px solid #2a2a2a",
        borderRadius: "14px",
        padding: "14px",
      }}
    >
      <label
        style={{
          fontSize: "14px",
          color: "#d4d4d4",
          fontWeight: "bold",
        }}
      >
        {label}
      </label>

      <input type="hidden" name={name} value={value} readOnly />

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cole uma URL ou use upload"
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: "12px",
          border: "1px solid #303030",
          backgroundColor: "#0f0f0f",
          color: "#fff",
          outline: "none",
        }}
      />

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #2a2a2a",
            backgroundColor: uploading ? "#141414" : "#1a1a1a",
            color: "#fff",
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.75 : 1,
          }}
        >
          {uploading ? "Enviando..." : "Upload do PC"}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              setError("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #7f1d1d",
              backgroundColor: "#3f1010",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Limpar
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
      />

      {error && (
        <p style={{ margin: 0, color: "#fca5a5", fontSize: "14px" }}>
          {error}
        </p>
      )}

      {value && (
        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #2a2a2a",
            backgroundColor: "#0f0f0f",
          }}
        >
          {shouldRenderVideoPreview ? (
            <video
              src={value}
              controls
              muted
              playsInline
              style={{
                width: "100%",
                maxHeight: "220px",
                display: "block",
                backgroundColor: "#000",
              }}
            />
          ) : (
            <img
              src={value}
              alt={label}
              style={{
                width: "100%",
                maxHeight: "180px",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
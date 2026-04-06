"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  name: string;
  initialValue?: string | null;
};

export default function UploadField({ label, name, initialValue }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(initialValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Erro no upload.");
      }

      setValue(data.url);
    } catch (err: any) {
      setError(err?.message || "Erro no upload.");
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

      <input
        type="hidden"
        name={name}
        value={value}
        readOnly
      />

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
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #2a2a2a",
            backgroundColor: "#1a1a1a",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {uploading ? "Enviando..." : "Upload do PC"}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
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
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
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
        </div>
      )}
    </div>
  );
}
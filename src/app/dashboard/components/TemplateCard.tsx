"use client";

import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";

export type TemplateCardData = {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  previewImageUrl: string | null;
  isPremium: boolean;
  isPublic: boolean;
  usageCount: number;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  themeColor: string | null;
  createdByUserId: string;
  createdByUser: {
    username: string;
    displayName: string | null;
  };
};

type TemplateCardProps = {
  template: TemplateCardData;
  currentUserId: string;
  currentTab: "all" | "mine" | "premium";
  canUsePremium: boolean;
  applyAction: (formData: FormData) => Promise<void>;
  onOpenPreview?: () => void;
};

export default function TemplateCard({
  template,
  currentUserId,
  currentTab,
  canUsePremium,
  applyAction,
  onOpenPreview,
}: TemplateCardProps) {
  const previewUrl =
    template.previewImageUrl || template.bannerUrl || template.avatarUrl || null;
  const isLockedPremium = template.isPremium && !canUsePremium;
  const isOwner = template.createdByUserId === currentUserId;
  const authorName = template.createdByUser.displayName || template.createdByUser.username;
  const accent = template.themeColor || "#f472b6";

  const openPreview = () => {
    onOpenPreview?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPreview();
    }
  };

  const stopCardPreview = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <article
      className="template-card"
      style={cardStyle}
      onClick={openPreview}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Abrir preview do template ${template.name}`}
    >
      <div
        className="template-card__preview"
        style={{ ...previewStyle, background: buildPreviewBackground(accent) }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`Preview do template ${template.name}`}
            style={previewImageStyle}
          />
        ) : (
          <div style={fallbackPreviewStyle}>
            <div style={fallbackBadgeStyle}>Yotei</div>
            <div style={{ fontSize: "26px", fontWeight: 900 }}>{template.name}</div>
            <div style={{ color: "#d4d4d8", fontSize: "13px" }}>
              Template sem imagem de preview
            </div>
          </div>
        )}

        <div style={previewOverlayStyle} />
        <div className="template-card__sheen" style={previewSheenStyle} />

        <div style={chipRowStyle}>
          <span style={template.isPremium ? premiumChipStyle : freeChipStyle}>
            {template.isPremium ? "Premium" : "Free"}
          </span>
          <span style={template.isPublic ? publicChipStyle : privateChipStyle}>
            {template.isPublic ? "Public" : "Private"}
          </span>
        </div>

        <div style={previewHintStyle}>Click for live preview</div>
      </div>

      <div style={contentStyle}>
        <div style={{ display: "grid", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <h3 style={titleStyle}>{template.name}</h3>
            {isOwner ? <span style={ownerPillStyle}>Mine</span> : null}
          </div>

          <div style={metaStyle}>
            Created by @{template.createdByUser.username} ({authorName})
          </div>

          <p style={descriptionStyle}>
            {template.description || "Template basico do perfil, pronto para aplicar em um clique."}
          </p>
        </div>

        <div style={tagWrapStyle}>
          {template.tags.length > 0 ? (
            template.tags.map((tag) => (
              <span key={tag} style={tagStyle}>
                #{tag}
              </span>
            ))
          ) : (
            <span style={emptyTagStyle}>Sem tags</span>
          )}
        </div>

        <div style={statsStyle}>
          <span>Use count: {template.usageCount}</span>
          <span>{template.isPremium ? "Premium only" : "Ready to use"}</span>
        </div>

        <div style={actionRowStyle} onClick={stopCardPreview}>
          <form action={applyAction} style={{ display: "contents" }}>
            <input type="hidden" name="templateId" value={template.id} />
            <input type="hidden" name="tab" value={currentTab} />
            <button
              type="submit"
              disabled={isLockedPremium}
              className="template-card__action"
              style={isLockedPremium ? lockedButtonStyle : useButtonStyle}
            >
              {isLockedPremium ? "Premium Only" : "Use Template"}
            </button>
          </form>

          <a
            href="#create-template-form"
            style={createButtonStyle}
            className="template-card__ghost"
            onClick={stopCardPreview}
          >
            Create Template
          </a>
        </div>
      </div>

      <style jsx>{`
        .template-card {
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .template-card:hover,
        .template-card:focus-visible {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(244, 114, 182, 0.18);
          box-shadow:
            0 30px 68px rgba(0, 0, 0, 0.36),
            0 0 0 1px rgba(244, 114, 182, 0.1);
        }

        .template-card:hover .template-card__preview,
        .template-card:focus-visible .template-card__preview {
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
        }

        .template-card:hover .template-card__sheen,
        .template-card:focus-visible .template-card__sheen {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .template-card:hover .template-card__action,
        .template-card:focus-visible .template-card__action {
          filter: brightness(1.05);
        }

        .template-card:hover .template-card__ghost,
        .template-card:focus-visible .template-card__ghost {
          border-color: rgba(255, 255, 255, 0.14);
          background-color: rgba(255, 255, 255, 0.06);
        }
      `}</style>
    </article>
  );
}

function buildPreviewBackground(accent: string) {
  return `linear-gradient(135deg, ${accent}, rgba(17,24,39,0.68), rgba(3,7,18,0.96))`;
}

const cardStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  borderRadius: "28px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(14,14,18,0.98), rgba(8,8,12,0.98))",
  boxShadow: "0 22px 52px rgba(0,0,0,0.26)",
  outline: "none",
};

const previewStyle: CSSProperties = {
  position: "relative",
  minHeight: "220px",
  overflow: "hidden",
};

const previewImageStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const fallbackPreviewStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "grid",
  alignContent: "end",
  gap: "8px",
  padding: "22px",
};

const fallbackBadgeStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.16)",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const previewOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(9,9,12,0.02), rgba(9,9,12,0.28) 42%, rgba(9,9,12,0.74) 100%)",
  pointerEvents: "none",
};

const previewSheenStyle: CSSProperties = {
  position: "absolute",
  inset: "-20%",
  opacity: 0,
  pointerEvents: "none",
  background:
    "linear-gradient(120deg, transparent 24%, rgba(255,255,255,0.12) 42%, transparent 58%)",
  transform: "translate3d(-12%, 0, 0)",
  transition: "opacity 180ms ease, transform 180ms ease",
};

const chipRowStyle: CSSProperties = {
  position: "absolute",
  top: "16px",
  left: "16px",
  right: "16px",
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  zIndex: 1,
};

const previewHintStyle: CSSProperties = {
  position: "absolute",
  left: "16px",
  bottom: "16px",
  zIndex: 1,
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "rgba(8,8,12,0.44)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  backdropFilter: "blur(10px)",
};

const chipBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const premiumChipStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#f9a8d4",
  backgroundColor: "rgba(236,72,153,0.14)",
  border: "1px solid rgba(244,114,182,0.22)",
};

const freeChipStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#dbeafe",
  backgroundColor: "rgba(59,130,246,0.14)",
  border: "1px solid rgba(96,165,250,0.22)",
};

const publicChipStyle: CSSProperties = {
  ...chipBaseStyle,
  marginLeft: "auto",
  color: "#bbf7d0",
  backgroundColor: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(74,222,128,0.18)",
};

const privateChipStyle: CSSProperties = {
  ...chipBaseStyle,
  marginLeft: "auto",
  color: "#fde68a",
  backgroundColor: "rgba(245,158,11,0.12)",
  border: "1px solid rgba(245,158,11,0.18)",
};

const contentStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
  padding: "0 20px 20px",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "24px",
  lineHeight: 1.1,
};

const ownerPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 10px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#d4d4d8",
  fontSize: "12px",
  fontWeight: 700,
};

const metaStyle: CSSProperties = {
  color: "#a1a1aa",
  fontSize: "13px",
  fontWeight: 700,
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  color: "#d4d4d8",
  fontSize: "14px",
  lineHeight: 1.7,
};

const tagWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const tagStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 10px",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  color: "#e4e4e7",
  fontSize: "12px",
  fontWeight: 700,
};

const emptyTagStyle: CSSProperties = {
  color: "#71717a",
  fontSize: "12px",
  fontWeight: 700,
};

const statsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
  color: "#a1a1aa",
  fontSize: "13px",
  fontWeight: 700,
};

const actionRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "10px",
};

const buttonBaseStyle: CSSProperties = {
  borderRadius: "14px",
  padding: "14px 16px",
  fontWeight: 800,
  fontSize: "14px",
  textDecoration: "none",
  textAlign: "center",
  transition: "filter 160ms ease, background-color 160ms ease, border-color 160ms ease",
};

const useButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
  cursor: "pointer",
};

const lockedButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  border: "1px solid rgba(245,158,11,0.18)",
  backgroundColor: "rgba(245,158,11,0.10)",
  color: "#fcd34d",
  cursor: "not-allowed",
};

const createButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#ffffff",
};

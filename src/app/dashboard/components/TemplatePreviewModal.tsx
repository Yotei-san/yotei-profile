"use client";

import type { CSSProperties } from "react";
import { useEffect } from "react";
import FormActionButton from "@/app/components/FormActionButton";
import { type TemplateCardData } from "@/app/dashboard/components/TemplateCard";

type Props = {
  template: TemplateCardData | null;
  currentTab: "all" | "mine" | "premium";
  canUsePremium: boolean;
  applyAction: (formData: FormData) => Promise<void>;
  onClose: () => void;
};

export default function TemplatePreviewModal({
  template,
  currentTab,
  canUsePremium,
  applyAction,
  onClose,
}: Props) {
  useEffect(() => {
    if (!template) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [template, onClose]);

  if (!template) {
    return null;
  }

  const accent = template.themeColor || "#f472b6";
  const previewUrl =
    template.previewImageUrl || template.bannerUrl || template.avatarUrl || null;
  const isLockedPremium = template.isPremium && !canUsePremium;
  const authorName = template.createdByUser.displayName || template.createdByUser.username;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={backdropGlowStyle(accent)} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Preview do template ${template.name}`}
        style={modalStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} style={closeButtonStyle}>
          Close
        </button>

        <div style={modalGridStyle}>
          <div style={previewColumnStyle}>
            <div style={{ ...heroPreviewStyle, background: buildPreviewBackground(accent) }}>
              {previewUrl ? <img src={previewUrl} alt="" style={heroImageStyle} /> : null}
              <div style={heroOverlayStyle} />

              <div style={heroTopRowStyle}>
                <span style={template.isPremium ? premiumChipStyle : freeChipStyle}>
                  {template.isPremium ? "Premium" : "Free"}
                </span>
                <span style={template.isPublic ? publicChipStyle : privateChipStyle}>
                  {template.isPublic ? "Public" : "Private"}
                </span>
              </div>

              <div style={heroBottomCopyStyle}>
                <div style={eyebrowStyle}>Preview</div>
                <h2 style={heroTitleStyle}>{template.name}</h2>
                <p style={heroTextStyle}>
                  {template.description || "Template pronto para aplicar em um clique."}
                </p>
              </div>
            </div>

            <div style={simulationShellStyle}>
              <div style={simulationBannerStyle(accent)}>
                {template.bannerUrl ? (
                  <img src={template.bannerUrl} alt="" style={simulationBannerImageStyle} />
                ) : null}
                <div style={simulationBannerOverlayStyle} />
              </div>

              <div style={simulationContentStyle}>
                <div style={simulationIdentityRowStyle}>
                  <div style={simulationAvatarShellStyle}>
                    {template.avatarUrl ? (
                      <img src={template.avatarUrl} alt="" style={simulationAvatarImageStyle} />
                    ) : (
                      <div style={simulationAvatarFallbackStyle(accent)}>
                        {(template.displayName || template.name).slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={simulationNameStyle}>
                      {template.displayName || template.name}
                    </div>
                    <div style={simulationUsernameStyle}>
                      @{template.createdByUser.username}
                    </div>
                  </div>
                </div>

                <p style={simulationBioStyle}>
                  {template.bio ||
                    "Preview rapido do estilo visual, avatar, banner e tom geral desse template."}
                </p>

                <div style={simulationLinksStyle}>
                  <div style={simulationLinkCardStyle}>
                    <span style={simulationDotStyle(accent)} />
                    <span>Main link</span>
                  </div>
                  <div style={simulationLinkCardStyle}>
                    <span style={simulationDotStyle(accent)} />
                    <span>Social highlight</span>
                  </div>
                  <div style={simulationLinkCardStyle}>
                    <span style={simulationDotStyle(accent)} />
                    <span>Creator destination</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={detailsColumnStyle}>
            <div style={detailsBlockStyle}>
              <div style={detailEyebrowStyle}>Details</div>
              <h3 style={detailsTitleStyle}>{template.name}</h3>
              <div style={detailsMetaStyle}>Created by @{template.createdByUser.username}</div>
              <div style={detailsMetaStyle}>Author: {authorName}</div>
              <div style={detailsMetaStyle}>Uses: {template.usageCount}</div>
            </div>

            <div style={detailsBlockStyle}>
              <div style={detailEyebrowStyle}>Tags</div>
              <div style={tagsWrapStyle}>
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
            </div>

            <div style={detailsBlockStyle}>
              <div style={detailEyebrowStyle}>Apply</div>
              <div style={ctaTextStyle}>
                {isLockedPremium
                  ? "Premium required to use this template."
                  : "Apply this look to your profile."}
              </div>

              <form action={applyAction} style={{ display: "grid", gap: "12px" }}>
                <input type="hidden" name="templateId" value={template.id} />
                <input type="hidden" name="tab" value={currentTab} />
                <FormActionButton
                  idleLabel={isLockedPremium ? "Premium Required" : "Use Template"}
                  pendingLabel="Applying Template..."
                  disabled={isLockedPremium}
                  style={isLockedPremium ? lockedButtonStyle : useButtonStyle}
                />
              </form>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes modal-fade-in {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.985);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function buildPreviewBackground(accent: string) {
  return `linear-gradient(135deg, ${accent}, rgba(17,24,39,0.68), rgba(3,7,18,0.96))`;
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 60,
  display: "grid",
  placeItems: "center",
  padding: "22px",
  background: "rgba(4,4,8,0.72)",
  backdropFilter: "blur(14px)",
};

const backdropGlowStyle = (accent: string): CSSProperties => ({
  position: "absolute",
  inset: "12% 18%",
  background: `radial-gradient(circle, ${accent}22 0%, transparent 62%)`,
  filter: "blur(42px)",
  pointerEvents: "none",
});

const modalStyle: CSSProperties = {
  position: "relative",
  width: "min(1120px, 100%)",
  maxHeight: "min(92vh, 960px)",
  overflow: "auto",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(14,14,18,0.98), rgba(8,8,12,0.98))",
  boxShadow: "0 34px 80px rgba(0,0,0,0.42)",
  animation: "modal-fade-in 180ms ease",
};

const closeButtonStyle: CSSProperties = {
  position: "absolute",
  top: "16px",
  right: "16px",
  zIndex: 2,
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#ffffff",
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: 700,
};

const modalGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.2fr) minmax(300px, 0.8fr)",
  gap: "0",
};

const previewColumnStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  padding: "24px",
  borderRight: "1px solid rgba(255,255,255,0.06)",
};

const detailsColumnStyle: CSSProperties = {
  display: "grid",
  alignContent: "start",
  gap: "16px",
  padding: "24px",
};

const heroPreviewStyle: CSSProperties = {
  position: "relative",
  minHeight: "320px",
  borderRadius: "26px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
};

const heroImageStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const heroOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(8,8,12,0.08), rgba(8,8,12,0.24) 42%, rgba(8,8,12,0.82) 100%)",
};

const heroTopRowStyle: CSSProperties = {
  position: "absolute",
  top: "18px",
  left: "18px",
  right: "18px",
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  zIndex: 1,
};

const heroBottomCopyStyle: CSSProperties = {
  position: "absolute",
  left: "22px",
  right: "22px",
  bottom: "22px",
  zIndex: 1,
  display: "grid",
  gap: "10px",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.14)",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "44px",
  lineHeight: 0.94,
  letterSpacing: "-0.05em",
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: "54ch",
  color: "#e4e4e7",
  lineHeight: 1.75,
  fontSize: "14px",
};

const simulationShellStyle: CSSProperties = {
  overflow: "hidden",
  borderRadius: "26px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(14,14,18,0.98), rgba(8,8,12,0.98))",
};

const simulationBannerStyle = (accent: string): CSSProperties => ({
  position: "relative",
  height: "160px",
  overflow: "hidden",
  background: buildPreviewBackground(accent),
});

const simulationBannerImageStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const simulationBannerOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(8,8,12,0.08), rgba(8,8,12,0.24) 42%, rgba(8,8,12,0.72) 100%)",
};

const simulationContentStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  padding: "0 20px 20px",
  marginTop: "-34px",
  position: "relative",
  zIndex: 1,
};

const simulationIdentityRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: "14px",
  alignItems: "center",
};

const simulationAvatarShellStyle: CSSProperties = {
  width: "84px",
  height: "84px",
  borderRadius: "999px",
  overflow: "hidden",
  border: "3px solid rgba(255,255,255,0.18)",
  background: "#111827",
  boxShadow: "0 16px 32px rgba(0,0,0,0.28)",
};

const simulationAvatarImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const simulationAvatarFallbackStyle = (accent: string): CSSProperties => ({
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center",
  background: `linear-gradient(145deg, ${accent}, rgba(96,165,250,0.72))`,
  color: "#ffffff",
  fontSize: "30px",
  fontWeight: 900,
});

const simulationNameStyle: CSSProperties = {
  fontSize: "26px",
  fontWeight: 900,
  lineHeight: 1,
  letterSpacing: "-0.04em",
};

const simulationUsernameStyle: CSSProperties = {
  marginTop: "6px",
  color: "#9ca3af",
  fontSize: "14px",
  fontWeight: 700,
};

const simulationBioStyle: CSSProperties = {
  margin: 0,
  color: "#d4d4d8",
  fontSize: "14px",
  lineHeight: 1.75,
};

const simulationLinksStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const simulationLinkCardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  minHeight: "44px",
  padding: "0 14px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.07)",
  backgroundColor: "rgba(255,255,255,0.03)",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 700,
};

const simulationDotStyle = (accent: string): CSSProperties => ({
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  backgroundColor: accent,
  boxShadow: `0 0 14px ${accent}55`,
  flexShrink: 0,
});

const detailsBlockStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  padding: "18px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
};

const detailEyebrowStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const detailsTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "30px",
  lineHeight: 1,
  letterSpacing: "-0.04em",
};

const detailsMetaStyle: CSSProperties = {
  color: "#c4c7cf",
  fontSize: "14px",
  lineHeight: 1.7,
};

const tagsWrapStyle: CSSProperties = {
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

const ctaTextStyle: CSSProperties = {
  color: "#c4c7cf",
  fontSize: "14px",
  lineHeight: 1.75,
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
  color: "#bbf7d0",
  backgroundColor: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(74,222,128,0.18)",
};

const privateChipStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#fde68a",
  backgroundColor: "rgba(245,158,11,0.12)",
  border: "1px solid rgba(245,158,11,0.18)",
};

const buttonBaseStyle: CSSProperties = {
  borderRadius: "16px",
  padding: "15px 16px",
  fontWeight: 800,
  fontSize: "14px",
  textAlign: "center",
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

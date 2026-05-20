"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import { LuCrown, LuLock } from "react-icons/lu";
import LivingAvatar from "@/app/components/LivingAvatar";
import {
  DashboardSectionHeading,
  dashboardButtonStyle,
  dashboardInputStyle,
  dashboardLabelStyle,
  dashboardMutedTextStyle,
  dashboardSoftSurfaceStyle,
  dashboardTagStyle,
} from "@/app/dashboard/components/DashboardUI";
import type { DecorationCatalogItem } from "@/app/lib/decorations";
import {
  DECORATION_CATEGORIES,
  DECORATION_RARITIES,
} from "@/app/lib/decorations";
import {
  getProfilePresence,
  type ProfileAura,
  type ProfileMood,
} from "@/app/lib/profile-presence";

type EquippedDecoration = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  previewUrl: string | null;
  posterUrl: string | null;
  mediaType: string;
  overlayScale: number | null;
  overlayOffsetY: number | null;
  createdByUserId?: string | null;
} | null;

type Props = {
  decorations: DecorationCatalogItem[];
  selectedDecorationId?: string | null;
  selectedScale: number;
  selectedOffsetX: number;
  selectedOffsetY: number;
  equippedDecoration: EquippedDecoration;
  saveAction: (formData: FormData) => Promise<void>;
  clearAction: () => Promise<void>;
  uploadAction: (formData: FormData) => Promise<void>;
  avatarUrl?: string | null;
  displayName: string;
  username: string;
  themeColor: string;
  profileMood: ProfileMood;
  profileAura: ProfileAura;
};

type FilterMode = "all" | "free" | "premium" | "locked";

export default function DecorationManager({
  decorations,
  selectedDecorationId,
  selectedScale,
  selectedOffsetX,
  selectedOffsetY,
  equippedDecoration,
  saveAction,
  clearAction,
  uploadAction,
  avatarUrl,
  displayName,
  username,
  themeColor,
  profileMood,
  profileAura,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedId, setSelectedId] = useState(
    selectedDecorationId || decorations[0]?.id || "",
  );
  const [scale, setScale] = useState(selectedScale || 165);
  const [offsetX, setOffsetX] = useState(selectedOffsetX || 0);
  const [offsetY, setOffsetY] = useState(selectedOffsetY || 0);
  const [categoryFilter, setCategoryFilter] = useState<"all" | (typeof DECORATION_CATEGORIES)[number]>("all");
  const [rarityFilter, setRarityFilter] = useState<"all" | (typeof DECORATION_RARITIES)[number]>("all");
  const [accessFilter, setAccessFilter] = useState<FilterMode>("all");
  const [uploadName, setUploadName] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const selected = useMemo(
    () => decorations.find((item) => item.id === selectedId) || decorations[0] || null,
    [decorations, selectedId],
  );

  const filteredDecorations = useMemo(
    () =>
      decorations.filter((item) => {
        if (categoryFilter !== "all" && item.category !== categoryFilter) {
          return false;
        }

        if (rarityFilter !== "all" && item.rarity !== rarityFilter) {
          return false;
        }

        if (accessFilter === "free" && item.isPremium) {
          return false;
        }

        if (accessFilter === "premium" && !item.isPremium) {
          return false;
        }

        if (accessFilter === "locked" && !item.isLocked) {
          return false;
        }

        return true;
      }),
    [accessFilter, categoryFilter, decorations, rarityFilter],
  );

  const previewPresence = getProfilePresence({
    mood: profileMood,
    aura: profileAura,
    themeColor,
  });
  const avatarInitials = getInitials(displayName);
  const equippedId = equippedDecoration?.id || null;
  const isSelectedUploaded = Boolean(selected && !selected.isStarter);

  async function handleUpload(file: File | null) {
    if (!file) {
      return;
    }

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
        throw new Error(data?.error || "Upload failed.");
      }

      setUploadUrl(data.url);

      if (!uploadName) {
        const raw = file.name.replace(/\.[^.]+$/, "").trim();
        setUploadName(raw || "Custom overlay");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <style>{`
        .decoration-catalog-card {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .decoration-catalog-card:hover {
          transform: translateY(-4px);
        }

        .decoration-preview-button {
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .decoration-catalog-card:hover .decoration-preview-button {
          box-shadow: 0 18px 32px rgba(0, 0, 0, 0.18);
        }

        @media (prefers-reduced-motion: reduce) {
          .decoration-catalog-card,
          .decoration-preview-button {
            transition: none;
          }
        }
      `}</style>

      <section style={studioLayoutStyle}>
        <div style={panelStyle}>
          <DashboardSectionHeading
            eyebrow="Preview"
            title="Live avatar frame"
            description="Starter decorations are CSS/SVG-only and react subtly to your current mood and aura."
            actions={
              <>
                <span style={dashboardTagStyle("pink")}>{profileMood}</span>
                <span style={dashboardTagStyle("violet")}>{profileAura} aura</span>
              </>
            }
          />

          <div style={previewSurfaceStyle(previewPresence.accent, previewPresence.contrast)}>
            <div style={previewCardStyle}>
              <LivingAvatar
                avatarUrl={avatarUrl || null}
                avatarInitials={avatarInitials}
                avatarAlt={displayName}
                selectedDecoration={selected}
                themeColor={themeColor}
                accentColor={previewPresence.accent}
                contrastColor={previewPresence.contrast}
                softColor={previewPresence.soft}
                pulseColor={previewPresence.pulse}
                auraBackground={previewPresence.avatarAuraBackground}
                ringColor={previewPresence.avatarRing}
                glowColor={previewPresence.avatarGlow}
                size={190}
                frameInset={10}
                decorationScale={scale}
                decorationOffsetX={offsetX}
                decorationOffsetY={offsetY}
                emphasized
              />

              <div style={{ display: "grid", gap: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff" }}>
                  {displayName}
                </div>
                <div style={{ color: "#a8b4cc", fontSize: "14px" }}>@{username}</div>
                <div style={previewStatusStyle(previewPresence.accent)}>
                  {selected?.isAnimated ? "Animated" : "Static"} decoration
                </div>
              </div>
            </div>

            <div style={dashboardSoftSurfaceStyle}>
              <div style={{ display: "grid", gap: "8px" }}>
                <strong style={{ color: "#ffffff", fontSize: "16px" }}>
                  {selected?.name || "No decoration selected"}
                </strong>
                <div style={dashboardMutedTextStyle}>
                  {selected?.description ||
                    "Choose a lightweight frame, aura, or effect to strengthen profile identity."}
                </div>
              </div>

              {selected ? (
                <div style={metaRailStyle}>
                  <span style={metaTagStyle(selected.category, previewPresence.accent)}>
                    {selected.category}
                  </span>
                  <span style={metaTagStyle(selected.rarity, previewPresence.contrast)}>
                    {selected.rarity}
                  </span>
                  <span style={metaTagStyle("style", previewPresence.soft)}>
                    {selected.previewStyle}
                  </span>
                </div>
              ) : null}

              {isSelectedUploaded ? (
                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={dashboardMutedTextStyle}>
                    Custom overlays keep the existing alignment controls. Starter presets ignore these offsets.
                  </div>

                  <label style={dashboardLabelStyle}>
                    Scale: {scale}%
                    <input
                      type="range"
                      min="90"
                      max="240"
                      step="1"
                      value={scale}
                      onChange={(event) => setScale(Number(event.target.value))}
                    />
                  </label>

                  <div style={numberGridStyle}>
                    <label style={dashboardLabelStyle}>
                      Offset X
                      <input
                        type="number"
                        value={offsetX}
                        onChange={(event) => setOffsetX(Number(event.target.value))}
                        style={dashboardInputStyle}
                      />
                    </label>

                    <label style={dashboardLabelStyle}>
                      Offset Y
                      <input
                        type="number"
                        value={offsetY}
                        onChange={(event) => setOffsetY(Number(event.target.value))}
                        style={dashboardInputStyle}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div style={dashboardMutedTextStyle}>
                  Starter decorations are aligned automatically to avoid face coverage and keep mobile rendering light.
                </div>
              )}

              <div style={actionRailStyle}>
                {selected ? (
                  <form action={saveAction}>
                    <input type="hidden" name="decorationSlug" value={selected.slug} readOnly />
                    <input type="hidden" name="scale" value={scale} readOnly />
                    <input type="hidden" name="offsetX" value={offsetX} readOnly />
                    <input type="hidden" name="offsetY" value={offsetY} readOnly />
                    <button type="submit" style={dashboardButtonStyle("primary")}>
                      {equippedId === selected.id ? "Save alignment" : "Equip selected"}
                    </button>
                  </form>
                ) : null}

                <form action={clearAction}>
                  <button type="submit" style={dashboardButtonStyle("secondary")}>
                    Clear decoration
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div style={panelStyle}>
          <DashboardSectionHeading
            eyebrow="Filters"
            title="Catalog view"
            description="Free users can browse everything, but only eligible decorations can be equipped."
          />

          <div style={filterBlockStyle}>
            <div style={filterLabelStyle}>Access</div>
            <div style={chipRowStyle}>
              {[
                { value: "all", label: "All" },
                { value: "free", label: "Free" },
                { value: "premium", label: "Premium" },
                { value: "locked", label: "Locked" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAccessFilter(option.value as FilterMode)}
                  style={filterChipStyle(accessFilter === option.value, previewPresence.accent)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div style={filterBlockStyle}>
            <div style={filterLabelStyle}>Category</div>
            <div style={chipRowStyle}>
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                style={filterChipStyle(categoryFilter === "all", previewPresence.contrast)}
              >
                All
              </button>
              {DECORATION_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setCategoryFilter(category)}
                  style={filterChipStyle(categoryFilter === category, previewPresence.contrast)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <label style={dashboardLabelStyle}>
            Rarity
            <select
              value={rarityFilter}
              onChange={(event) =>
                setRarityFilter(event.target.value as "all" | (typeof DECORATION_RARITIES)[number])
              }
              style={dashboardInputStyle}
            >
              <option value="all">All rarities</option>
              {DECORATION_RARITIES.map((rarity) => (
                <option key={rarity} value={rarity}>
                  {rarity}
                </option>
              ))}
            </select>
          </label>

          <div style={dashboardMutedTextStyle}>
            {filteredDecorations.length} decoration
            {filteredDecorations.length === 1 ? "" : "s"} visible
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <DashboardSectionHeading
          eyebrow="Catalog"
          title="Starter frames and overlays"
          description="Click a card to inspect it in the preview. Use Equip on unlocked items, or read the lock badge for gated cosmetics."
        />

        <div style={catalogGridStyle}>
          {filteredDecorations.map((item) => {
            const isSelected = item.id === selected?.id;
            const isEquipped = item.id === equippedId;

            return (
              <article
                key={item.id}
                className="decoration-catalog-card"
                style={catalogCardStyle(
                  isSelected,
                  isEquipped,
                  item.isLocked,
                  isEquipped,
                  previewPresence.accent,
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className="decoration-preview-button"
                  style={previewButtonStyle}
                >
                  <LivingAvatar
                    avatarUrl={avatarUrl || null}
                    avatarInitials={avatarInitials}
                    avatarAlt={displayName}
                    selectedDecoration={item}
                    themeColor={themeColor}
                    accentColor={previewPresence.accent}
                    contrastColor={previewPresence.contrast}
                    softColor={previewPresence.soft}
                    pulseColor={previewPresence.pulse}
                    auraBackground={previewPresence.avatarAuraBackground}
                    ringColor={previewPresence.avatarRing}
                    glowColor={previewPresence.avatarGlow}
                    size={112}
                    frameInset={8}
                    decorationScale={item.isStarter ? 165 : scale}
                    decorationOffsetX={item.isStarter ? 0 : offsetX}
                    decorationOffsetY={item.isStarter ? 0 : offsetY}
                    minimal
                    interactive
                    emphasized={isEquipped}
                  />
                </button>

                <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
                  <div style={catalogHeaderStyle}>
                    <strong style={catalogTitleStyle}>{item.name}</strong>
                    {isEquipped ? (
                      <span style={dashboardTagStyle("green")}>Equipped</span>
                    ) : item.lockedReason === "premium" ? (
                      <span style={dashboardTagStyle("violet")}>Premium required</span>
                    ) : item.lockedReason === "owner" ? (
                      <span style={dashboardTagStyle("violet")}>Owner only</span>
                    ) : null}
                  </div>

                  <div style={dashboardMutedTextStyle}>{item.description}</div>

                  <div style={metaRailStyle}>
                    <span style={metaTagStyle(item.category, previewPresence.accent)}>
                      {item.category}
                    </span>
                    <span style={metaTagStyle(item.rarity, previewPresence.contrast)}>
                      {item.rarity}
                    </span>
                    {item.isAnimated ? (
                      <span style={metaTagStyle("animated", previewPresence.soft)}>
                        animated
                      </span>
                    ) : null}
                  </div>

                  <div style={catalogActionRowStyle}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      style={dashboardButtonStyle("secondary")}
                    >
                      {isSelected ? "Previewing" : "Preview"}
                    </button>

                    {isEquipped ? (
                      <button type="button" disabled style={disabledButtonStyle}>
                        Equipped
                      </button>
                    ) : item.lockedReason === "premium" ? (
                      <button type="button" disabled style={disabledButtonStyle}>
                        <LuLock size={14} />
                        Premium required
                      </button>
                    ) : item.lockedReason === "owner" ? (
                      <button type="button" disabled style={disabledButtonStyle}>
                        <LuCrown size={14} />
                        Owner only
                      </button>
                    ) : (
                      <form action={saveAction}>
                        <input type="hidden" name="decorationSlug" value={item.slug} readOnly />
                        <input
                          type="hidden"
                          name="scale"
                          value={item.isStarter ? 165 : scale}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="offsetX"
                          value={item.isStarter ? 0 : offsetX}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="offsetY"
                          value={item.isStarter ? 0 : offsetY}
                          readOnly
                        />
                        <button type="submit" style={dashboardButtonStyle("primary")}>
                          Equip
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section style={panelStyle}>
        <DashboardSectionHeading
          eyebrow="Custom Upload"
          title="Keep the existing upload pipeline"
          description="Starter decorations stay lightweight, but you can still upload a custom PNG, GIF, or WebM overlay when you need something specific."
        />

        <div style={uploadGridStyle}>
          <div style={dashboardSoftSurfaceStyle}>
            <div style={{ display: "grid", gap: "10px" }}>
              <strong style={{ color: "#ffffff", fontSize: "16px" }}>Upload media</strong>
              <div style={dashboardMutedTextStyle}>
                Transparent PNG or WebM works best. Heavy files are still a bad fit for mobile.
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={dashboardButtonStyle("secondary")}
            >
              {uploading ? "Uploading..." : "Choose file"}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,video/webm"
              style={{ display: "none" }}
              onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
            />
          </div>

          <form action={uploadAction} style={dashboardSoftSurfaceStyle}>
            <label style={dashboardLabelStyle}>
              Name
              <input
                name="name"
                value={uploadName}
                onChange={(event) => setUploadName(event.target.value)}
                placeholder="Custom overlay"
                style={dashboardInputStyle}
              />
            </label>

            <label style={dashboardLabelStyle}>
              Media URL
              <input
                name="imageUrl"
                value={uploadUrl}
                onChange={(event) => setUploadUrl(event.target.value)}
                placeholder="https://..."
                style={dashboardInputStyle}
              />
            </label>

            <input name="mediaType" type="hidden" value="" readOnly />
            <button
              type="submit"
              style={dashboardButtonStyle("primary")}
              disabled={!uploadName || !uploadUrl}
            >
              Create custom decoration
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function getInitials(input: string) {
  return (
    input
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "Y"
  );
}

const studioLayoutStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "18px",
} satisfies CSSProperties;

const panelStyle = {
  display: "grid",
  gap: "16px",
  padding: "24px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(10,11,18,0.96), rgba(8,9,15,0.98))",
  boxShadow: "0 18px 42px rgba(0,0,0,0.18)",
} satisfies CSSProperties;

function previewSurfaceStyle(accentColor: string, contrastColor: string) {
  return {
    display: "grid",
    gap: "16px",
    padding: "18px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      `radial-gradient(circle at top left, ${withAlpha(accentColor, "20")} 0%, transparent 26%), radial-gradient(circle at 82% 18%, ${withAlpha(contrastColor, "16")} 0%, transparent 22%), linear-gradient(180deg, rgba(17,18,28,0.98), rgba(8,9,14,0.98))`,
  } satisfies CSSProperties;
}

const previewCardStyle = {
  minHeight: "360px",
  display: "grid",
  alignContent: "center",
  justifyItems: "center",
  gap: "18px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.06)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
} satisfies CSSProperties;

function previewStatusStyle(color: string) {
  return {
    width: "fit-content",
    margin: "0 auto",
    minHeight: "30px",
    padding: "0 12px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    color: "#ffffff",
    background: withAlpha(color, "18"),
    border: `1px solid ${withAlpha(color, "30")}`,
    fontSize: "12px",
    fontWeight: 800,
  } satisfies CSSProperties;
}

const metaRailStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
} satisfies CSSProperties;

function metaTagStyle(label: string, color: string) {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "26px",
    padding: "0 10px",
    borderRadius: "999px",
    color: "#f4f8ff",
    background: withAlpha(color, "14"),
    border: `1px solid ${withAlpha(color, "26")}`,
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: label === "style" ? "none" : "uppercase",
  } satisfies CSSProperties;
}

const numberGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
  gap: "12px",
} satisfies CSSProperties;

const actionRailStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
} satisfies CSSProperties;

const filterBlockStyle = {
  display: "grid",
  gap: "10px",
} satisfies CSSProperties;

const filterLabelStyle = {
  color: "#dbe4f8",
  fontSize: "13px",
  fontWeight: 800,
} satisfies CSSProperties;

const chipRowStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
} satisfies CSSProperties;

function filterChipStyle(isActive: boolean, color: string) {
  return {
    minHeight: "34px",
    padding: "0 12px",
    borderRadius: "999px",
    border: `1px solid ${
      isActive ? withAlpha(color, "30") : "rgba(255,255,255,0.08)"
    }`,
    background: isActive
      ? withAlpha(color, "16")
      : "rgba(255,255,255,0.03)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 800,
  } satisfies CSSProperties;
}

const catalogGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "14px",
} satisfies CSSProperties;

function catalogCardStyle(
  isSelected: boolean,
  isEquipped: boolean,
  isLocked: boolean,
  equippedGlow: boolean,
  accentColor: string,
) {
  return {
    display: "grid",
    gap: "14px",
    minWidth: 0,
    padding: "16px",
    borderRadius: "24px",
    border: `1px solid ${
      isSelected
        ? withAlpha(accentColor, "34")
        : isEquipped
          ? "rgba(52,211,153,0.24)"
          : "rgba(255,255,255,0.08)"
    }`,
    background: isLocked
      ? "linear-gradient(180deg, rgba(18,18,24,0.92), rgba(10,10,15,0.98))"
      : "linear-gradient(180deg, rgba(22,24,34,0.94), rgba(11,12,18,0.98))",
    boxShadow: equippedGlow
      ? `0 22px 40px ${withAlpha(accentColor, "16")}, 0 0 0 1px ${withAlpha("#34d399", "1c")}`
      : isSelected
        ? `0 18px 34px ${withAlpha(accentColor, "14")}`
        : "none",
  } satisfies CSSProperties;
}

const previewButtonStyle = {
  padding: "12px",
  borderRadius: "20px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
  border: "1px solid rgba(255,255,255,0.06)",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
} satisfies CSSProperties;

const catalogHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
} satisfies CSSProperties;

const catalogTitleStyle = {
  color: "#ffffff",
  fontSize: "17px",
  lineHeight: 1.3,
  overflowWrap: "anywhere",
} satisfies CSSProperties;

const catalogActionRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  alignItems: "center",
} satisfies CSSProperties;

const disabledButtonStyle = {
  minHeight: "46px",
  padding: "0 16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#b9c4da",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: 800,
  cursor: "not-allowed",
} satisfies CSSProperties;

const uploadGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "16px",
} satisfies CSSProperties;

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

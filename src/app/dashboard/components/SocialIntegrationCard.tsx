import Link from "next/link";
import type { CSSProperties } from "react";
import SocialBrandIcon, {
  type SocialBrandIconName,
} from "@/app/dashboard/components/SocialBrandIcon";

export type SocialIntegrationItem = {
  key: string;
  name: string;
  description: string;
  accent: string;
  icon: SocialBrandIconName;
};

type Props = {
  item: SocialIntegrationItem;
  selected: boolean;
  href: string;
};

export default function SocialIntegrationCard({
  item,
  selected,
  href,
}: Props) {
  const cardStyle: CSSProperties = {
    display: "grid",
    gap: "16px",
    minHeight: "208px",
    padding: "20px",
    borderRadius: "24px",
    textDecoration: "none",
    color: "#ffffff",
    border: `1px solid ${selected ? item.accent : "rgba(255,255,255,0.08)"}`,
    background: selected
      ? `linear-gradient(180deg, ${toRgba(item.accent, 0.16)}, rgba(7,7,10,0.96))`
      : "linear-gradient(180deg, rgba(14,14,18,0.96), rgba(7,7,10,0.96))",
    boxShadow: selected
      ? `0 22px 48px ${toRgba(item.accent, 0.16)}`
      : `0 18px 40px rgba(0,0,0,0.24), 0 0 0 1px ${toRgba(item.accent, 0.08)}`,
  };

  const iconWrapStyle: CSSProperties = {
    width: "52px",
    height: "52px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: item.accent,
    backgroundColor: selected ? toRgba(item.accent, 0.16) : "rgba(255,255,255,0.05)",
    border: `1px solid ${selected ? toRgba(item.accent, 0.42) : "rgba(255,255,255,0.08)"}`,
    boxShadow: selected ? `0 0 22px ${toRgba(item.accent, 0.18)}` : "none",
    flexShrink: 0,
  };

  const stateStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "30px",
    padding: "0 12px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: selected ? item.accent : "#b6bdd0",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.02em",
  };

  const dotStyle: CSSProperties = {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    backgroundColor: item.accent,
    boxShadow: `0 0 12px ${toRgba(item.accent, 0.45)}`,
    flexShrink: 0,
  };

  return (
    <Link href={href} style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={iconWrapStyle} aria-hidden="true">
          <SocialBrandIcon name={item.icon} size={24} />
        </div>
        <div style={stateStyle}>{selected ? "Selected" : "Preview"}</div>
      </div>

      <div style={{ display: "grid", gap: "10px" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "22px",
            lineHeight: 1.1,
            fontWeight: 900,
          }}
        >
          {item.name}
        </h3>
        <p
          style={{
            margin: 0,
            color: "#a7afc2",
            fontSize: "14px",
            lineHeight: 1.6,
            maxWidth: "30ch",
          }}
        >
          {item.description}
        </p>
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          color: "#d8deef",
          fontSize: "13px",
          fontWeight: 700,
        }}
      >
        <span style={dotStyle} />
        <span>{selected ? "Enabled in layout preview" : "Click to preview block"}</span>
      </div>

    </Link>
  );
}

function toRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((part) => part + part)
          .join("")
      : value;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

import Link from "next/link";
import type { CSSProperties } from "react";
import type { BadgeFilter } from "@/app/lib/badge-missions";

type FilterItem = {
  key: BadgeFilter;
  label: string;
  count: number;
};

type Props = {
  activeFilter: BadgeFilter;
  items: FilterItem[];
};

export default function BadgeFilterTabs({ activeFilter, items }: Props) {
  return (
    <div style={wrapStyle}>
      {items.map((item) => (
        <Link
          key={item.key}
          aria-current={item.key === activeFilter ? "page" : undefined}
          href={item.key === "all" ? "/dashboard/badges" : `/dashboard/badges?filter=${item.key}`}
          style={item.key === activeFilter ? activeTabStyle : tabStyle}
        >
          <span>{item.label}</span>
          <span style={countStyle}>{item.count}</span>
        </Link>
      ))}
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const tabBaseStyle: CSSProperties = {
  textDecoration: "none",
  minHeight: "42px",
  padding: "0 16px",
  borderRadius: "16px",
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "13px",
  fontWeight: 800,
};

const tabStyle: CSSProperties = {
  ...tabBaseStyle,
  color: "#d4d4d8",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
};

const activeTabStyle: CSSProperties = {
  ...tabBaseStyle,
  color: "#ffffff",
  border: "1px solid rgba(255,110,168,0.18)",
  background:
    "linear-gradient(135deg, rgba(255,110,168,0.14), rgba(135,118,255,0.12))",
  boxShadow: "0 0 0 1px rgba(255,110,168,0.08)",
};

const countStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "28px",
  minHeight: "28px",
  padding: "0 8px",
  borderRadius: "999px",
  backgroundColor: "rgba(0,0,0,0.18)",
  fontSize: "11px",
};

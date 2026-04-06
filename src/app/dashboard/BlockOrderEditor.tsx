"use client";

import { useState } from "react";

type BlockKey =
  | "stats"
  | "about"
  | "gallery"
  | "music"
  | "reactions"
  | "links";

type Props = {
  initialOrder?: string | null;
};

const LABELS: Record<BlockKey, string> = {
  stats: "Stats",
  about: "Sobre",
  gallery: "Galeria",
  music: "Música",
  reactions: "Reações",
  links: "Links",
};

const DEFAULT_ORDER: BlockKey[] = [
  "stats",
  "about",
  "gallery",
  "music",
  "reactions",
  "links",
];

function normalizeOrder(value?: string | null): BlockKey[] {
  const raw = (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean) as BlockKey[];

  const seen = new Set<BlockKey>();
  const result: BlockKey[] = [];

  for (const item of raw) {
    if (DEFAULT_ORDER.includes(item) && !seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }

  for (const item of DEFAULT_ORDER) {
    if (!seen.has(item)) {
      result.push(item);
    }
  }

  return result;
}

export default function BlockOrderEditor({ initialOrder }: Props) {
  const [items, setItems] = useState<BlockKey[]>(normalizeOrder(initialOrder));
  const [dragging, setDragging] = useState<BlockKey | null>(null);

  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;

    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    setItems(copy);
  }

  return (
    <div
      style={{
        backgroundColor: "#111111",
        border: "1px solid #2a2a2a",
        borderRadius: "14px",
        padding: "14px",
      }}
    >
      <input type="hidden" name="blocksOrder" value={items.join(",")} />

      <div
        style={{
          fontSize: "14px",
          color: "#d4d4d4",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Ordem dos blocos
      </div>

      <div style={{ display: "grid", gap: "10px" }}>
        {items.map((item, index) => (
          <div
            key={item}
            draggable
            onDragStart={() => setDragging(item)}
            onDragEnd={() => setDragging(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (!dragging) return;
              const from = items.indexOf(dragging);
              const to = index;
              move(from, to);
            }}
            style={{
              backgroundColor: dragging === item ? "#1f2937" : "#0f0f0f",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "14px 16px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "grab",
              userSelect: "none",
            }}
          >
            ↕ {LABELS[item]}
          </div>
        ))}
      </div>
    </div>
  );
}
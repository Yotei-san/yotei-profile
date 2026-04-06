"use client";

import { useMemo, useState } from "react";

type BlockItem = {
  id: string;
  label: string;
};

type Props = {
  initialOrder: string;
};

const ALL_BLOCKS: BlockItem[] = [
  { id: "stats", label: "Stats" },
  { id: "about", label: "Sobre" },
  { id: "gallery", label: "Galeria" },
  { id: "music", label: "Música" },
  { id: "reactions", label: "Reações" },
  { id: "links", label: "Links" },
];

function buildInitial(initialOrder: string) {
  const parts = initialOrder
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);

  const ordered = parts
    .map((id) => ALL_BLOCKS.find((item) => item.id === id))
    .filter(Boolean) as BlockItem[];

  const missing = ALL_BLOCKS.filter(
    (item) => !ordered.some((orderedItem) => orderedItem.id === item.id)
  );

  return [...ordered, ...missing];
}

export default function BlockSorter({ initialOrder }: Props) {
  const [blocks, setBlocks] = useState(() => buildInitial(initialOrder));
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const draggingIndex = useMemo(
    () => blocks.findIndex((item) => item.id === draggingId),
    [blocks, draggingId]
  );

  function reorder(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;

    const updated = [...blocks];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setBlocks(updated);
  }

  const serialized = blocks.map((block) => block.id).join(",");

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <input type="hidden" name="blocksOrder" value={serialized} readOnly />

      <p
        style={{
          margin: 0,
          color: "#a3a3a3",
          fontSize: "14px",
        }}
      >
        Arraste para mudar a ordem dos blocos do perfil público.
      </p>

      {blocks.map((block, index) => (
        <div
          key={block.id}
          draggable
          onDragStart={() => setDraggingId(block.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (draggingIndex === -1) return;
            reorder(draggingIndex, index);
            setDraggingId(null);
          }}
          onDragEnd={() => setDraggingId(null)}
          style={{
            backgroundColor: draggingId === block.id ? "#1f2937" : "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: "14px",
            padding: "14px 16px",
            cursor: "grab",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {block.label}
        </div>
      ))}
    </div>
  );
}
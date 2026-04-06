"use client";

import { useMemo, useState } from "react";

type Item = {
  id: string;
  title: string;
  url: string;
  clicks: number;
};

type Props = {
  items: Item[];
};

export default function LinkSorter({ items }: Props) {
  const [links, setLinks] = useState(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const draggingIndex = useMemo(
    () => links.findIndex((item) => item.id === draggingId),
    [links, draggingId]
  );

  function moveItem(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;

    const updated = [...links];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setLinks(updated);
  }

  async function saveOrder(updatedLinks: Item[]) {
    setSaving(true);

    try {
      await fetch("/api/links/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: updatedLinks.map((item) => item.id),
        }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <div
        style={{
          color: "#a3a3a3",
          fontSize: "14px",
        }}
      >
        Arraste os links para mudar a ordem. {saving ? "Salvando..." : ""}
      </div>

      {links.map((link, index) => (
        <div
          key={link.id}
          draggable
          onDragStart={() => setDraggingId(link.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (draggingIndex === -1) return;
            moveItem(draggingIndex, index);
            const updated = [...links];
            const [moved] = updated.splice(draggingIndex, 1);
            updated.splice(index, 0, moved);
            setLinks(updated);
            void saveOrder(updated);
            setDraggingId(null);
          }}
          onDragEnd={() => setDraggingId(null)}
          style={{
            backgroundColor: draggingId === link.id ? "#1f2937" : "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: "14px",
            padding: "16px",
            cursor: "grab",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "220px" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                wordBreak: "break-word",
              }}
            >
              {link.title}
            </div>
            <div
              style={{
                color: "#a3a3a3",
                fontSize: "14px",
                marginTop: "4px",
                wordBreak: "break-word",
              }}
            >
              {link.url}
            </div>
          </div>

          <div
            style={{
              color: "#d1d5db",
              fontSize: "14px",
            }}
          >
            {link.clicks} cliques
          </div>
        </div>
      ))}
    </div>
  );
}
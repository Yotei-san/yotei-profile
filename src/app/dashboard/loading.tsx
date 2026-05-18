import type { CSSProperties } from "react";

export default function DashboardLoading() {
  return (
    <main
      style={{
        display: "grid",
        gap: "22px",
        color: "#ffffff",
      }}
    >
      <section style={{ ...skeletonPanelStyle, minHeight: "200px" }} />

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} style={{ ...skeletonPanelStyle, minHeight: "132px" }} />
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "18px",
        }}
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} style={{ ...skeletonPanelStyle, minHeight: "240px" }} />
        ))}
      </section>

      <style>{`
        @keyframes yotei-dashboard-skeleton {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </main>
  );
}

const skeletonPanelStyle: CSSProperties = {
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.06)",
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.07), rgba(255,255,255,0.04))",
  backgroundSize: "200% 100%",
  animation: "yotei-dashboard-skeleton 1.1s linear infinite",
};

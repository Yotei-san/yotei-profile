export default function DashboardLoading() {
  return (
    <main
      style={{
        display: "grid",
        gap: "18px",
        color: "#ffffff",
      }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <section
          key={index}
          style={{
            minHeight: index === 0 ? "180px" : "120px",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.06)",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.07), rgba(255,255,255,0.04))",
            backgroundSize: "200% 100%",
            animation: "yotei-dashboard-skeleton 1.1s linear infinite",
          }}
        />
      ))}

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

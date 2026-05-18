export default function AppLoading() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at top, rgba(244,114,182,0.08), transparent 28%), linear-gradient(180deg, #07080d 0%, #05060a 100%)",
        color: "#ffffff",
        fontFamily:
          'Inter, Arial, Helvetica, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "14px",
          justifyItems: "center",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "999px",
            border: "2px solid rgba(255,255,255,0.18)",
            borderTopColor: "#f9a8d4",
            animation: "yotei-app-spin 0.8s linear infinite",
          }}
        />
        <div style={{ fontWeight: 800 }}>Carregando o Yotei...</div>
        <style>{`
          @keyframes yotei-app-spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </main>
  );
}

type ProfileDecorationProps = {
  imageUrl?: string | null;
  size?: number;
  top?: number;
};

export default function ProfileDecoration({
  imageUrl,
  size = 360,
  top = -28,
}: ProfileDecorationProps) {
  if (!imageUrl) return null;

  return (
    <img
      src={imageUrl}
      alt="Profile decoration"
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top,
        width: size,
        height: size,
        objectFit: "contain",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 3,
        filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.35))",
      }}
    />
  );
}

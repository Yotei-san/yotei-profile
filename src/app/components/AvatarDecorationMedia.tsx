type Decoration = {
  imageUrl: string;
  previewUrl?: string | null;
  posterUrl?: string | null;
  mediaType?: string | null;
  overlayScale?: number | null;
  overlayOffsetY?: number | null;
};

type Props = {
  avatarUrl: string;
  decoration?: Decoration | null;
  size?: number;
};

export default function AvatarDecorationMedia({
  avatarUrl,
  decoration,
  size = 170,
}: Props) {
  const overlayScale = (decoration?.overlayScale ?? 100) / 100;
  const overlayOffsetY = decoration?.overlayOffsetY ?? 0;

  const avatarSize = size * 0.72;
  const overlaySize = size * overlayScale;

  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "visible",
      }}
    >
      <img
        src={avatarUrl}
        alt="Avatar"
        style={{
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          objectFit: "cover",
          borderRadius: "999px",
          position: "relative",
          zIndex: 1,
          backgroundColor: "#111",
        }}
      />

      {decoration ? (
        decoration.mediaType === "webm" ? (
          <video
            src={decoration.imageUrl}
            poster={decoration.posterUrl || decoration.previewUrl || undefined}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: `${overlaySize}px`,
              height: `${overlaySize}px`,
              objectFit: "contain",
              transform: `translate(-50%, calc(-50% + ${overlayOffsetY}px))`,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        ) : (
          <img
            src={decoration.imageUrl}
            alt="Decoration"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: `${overlaySize}px`,
              height: `${overlaySize}px`,
              objectFit: "contain",
              transform: `translate(-50%, calc(-50% + ${overlayOffsetY}px))`,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        )
      ) : null}
    </div>
  );
}
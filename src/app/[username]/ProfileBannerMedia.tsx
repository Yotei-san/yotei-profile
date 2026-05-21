"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

type Props = {
  url: string | null;
  kind: "image" | "video" | "unknown";
  className?: string;
  style?: CSSProperties;
};

export default function ProfileBannerMedia({
  url,
  kind,
  className,
  style,
}: Props) {
  const [hidden, setHidden] = useState(false);

  if (!url || hidden) {
    return null;
  }

  if (kind === "video") {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={className}
        style={style}
        onError={() => setHidden(true)}
      >
        <source src={url} />
      </video>
    );
  }

  return (
    <img
      src={url}
      alt=""
      className={className}
      style={style}
      onError={() => setHidden(true)}
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  buildTwitchEmbedUrl,
  type LiveEmbedPlatform,
} from "@/app/lib/live-embed";

type Props = {
  platform: Extract<LiveEmbedPlatform, "twitch_live" | "youtube_live">;
  channelName: string | null;
  embedUrl: string | null;
  title: string;
};

export default function LiveEmbedPlayer({
  platform,
  channelName,
  embedUrl,
  title,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hostname, setHostname] = useState<string | null>(null);

  useEffect(() => {
    if (platform !== "twitch_live") {
      return;
    }

    setHostname(window.location.hostname || "localhost");
  }, [platform]);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || shouldLoad) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "240px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoad]);

  const src =
    shouldLoad && platform === "youtube_live"
      ? embedUrl
      : shouldLoad
        ? buildTwitchEmbedUrl(channelName ?? "", hostname)
        : null;

  return (
    <div ref={containerRef} style={shellStyle}>
      {src ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          scrolling="no"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          style={iframeStyle}
        />
      ) : (
        <div style={placeholderStyle}>
          <span style={placeholderLabelStyle}>
            {shouldLoad ? "Embed unavailable for this source" : "Preparing live preview"}
          </span>
        </div>
      )}
    </div>
  );
}

const shellStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 9",
  minHeight: "220px",
  borderRadius: "22px",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, rgba(18,18,24,0.98), rgba(8,8,14,0.98) 55%, rgba(5,5,9,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
};

const iframeStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  border: "none",
  display: "block",
  backgroundColor: "#09090b",
};

const placeholderStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center",
  padding: "24px",
  textAlign: "center",
  background:
    "radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 46%), linear-gradient(145deg, rgba(17,17,23,0.98), rgba(8,8,14,0.98))",
};

const placeholderLabelStyle: CSSProperties = {
  color: "#d4d4d8",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

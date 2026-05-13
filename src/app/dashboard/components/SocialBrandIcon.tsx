import type { CSSProperties } from "react";

export type SocialBrandIconName =
  | "discord"
  | "github"
  | "roblox"
  | "telegram"
  | "lastfm"
  | "statsfm"
  | "valorant"
  | "chess"
  | "tiktok"
  | "instagram"
  | "x"
  | "steam"
  | "spotify"
  | "youtube"
  | "twitch"
  | "minecraft"
  | "weather"
  | "brawl-stars";

type Props = {
  name: SocialBrandIconName;
  size?: number;
  style?: CSSProperties;
  title?: string;
};

export default function SocialBrandIcon({
  name,
  size = 24,
  style,
  title,
}: Props) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      {renderIcon(name)}
    </svg>
  );
}

function renderIcon(name: SocialBrandIconName) {
  switch (name) {
    case "discord":
      return (
        <>
          <path
            d="M7.2 7.7A13.7 13.7 0 0 1 10 6.8l.4.8c1-.2 2.2-.2 3.2 0l.4-.8a13.7 13.7 0 0 1 2.8.9c1.8 2.6 2.7 5.1 2.9 7.7a10.5 10.5 0 0 1-3.4 1.7l-.8-1.3c.5-.2 1-.5 1.4-.8-.3.2-.6.3-.9.4-1.7.7-3.5.9-5.2.6a10 10 0 0 1-2.8-1c.5.3.9.6 1.4.8l-.8 1.3a10.6 10.6 0 0 1-3.4-1.7c.2-2.6 1.1-5.1 2.9-7.7Z"
            fill="currentColor"
          />
          <circle cx="10" cy="12.2" r="1.1" fill="#0B0C12" />
          <circle cx="14" cy="12.2" r="1.1" fill="#0B0C12" />
        </>
      );
    case "github":
      return (
        <path
          d="M12 3.6a8.6 8.6 0 0 0-2.7 16.8c.4.1.5-.2.5-.4v-1.6c-2.3.5-2.8-1-2.8-1-.4-.8-.9-1-1-1-.8-.5 0-.5 0-.5.9.1 1.4.9 1.4.9.8 1.3 2 1 2.5.8.1-.6.3-1 .6-1.3-1.8-.2-3.8-.9-3.8-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .8-.3 2.5.9a8.7 8.7 0 0 1 4.6 0c1.7-1.2 2.5-.9 2.5-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.3 0 3.3-2 4-3.9 4.2.4.3.7.9.7 1.8v2.6c0 .2.1.5.5.4A8.6 8.6 0 0 0 12 3.6Z"
          fill="currentColor"
        />
      );
    case "roblox":
      return (
        <path
          d="M8 4.5 19.5 8 16 19.5 4.5 16 8 4.5Zm2.2 4.3-1.4 4.4 4.4 1.4 1.4-4.4-4.4-1.4Z"
          fill="currentColor"
        />
      );
    case "telegram":
      return (
        <>
          <path
            d="M20.2 5.4 4.5 11.6c-.7.3-.7 1.3.1 1.5l4 1.2 1.5 4.5c.3.8 1.4.9 1.8.1l2.2-4.1 3.8 2.8c.6.4 1.4 0 1.5-.7L21 6.5c.1-.8-.6-1.4-1.3-1.1Z"
            fill="currentColor"
          />
          <path d="m9 14 7.8-6.2-5.8 7.7-.6 3.3L9 14Z" fill="#0B0C12" fillOpacity=".22" />
        </>
      );
    case "lastfm":
      return (
        <>
          <circle cx="7" cy="14.5" r="2" fill="currentColor" />
          <path
            d="M10.2 10.8c.7 0 1.2.4 1.7 1.3l.8 1.6c.8 1.6 1.8 2.7 4 2.7 1.9 0 3.3-.9 3.3-2.7 0-1.4-.8-2.3-2.3-2.7l-1.1-.3c-.8-.2-1.1-.4-1.1-.9 0-.4.3-.7 1-.7.8 0 1.2.4 1.4 1l1.8-.5c-.4-1.5-1.6-2.4-3.2-2.4-1.9 0-3 .9-3 2.5 0 1.4.8 2.2 2.3 2.6l1.1.3c.8.2 1.1.5 1.1 1 0 .5-.4.8-1.1.8-.9 0-1.4-.4-1.9-1.3l-.8-1.6c-.8-1.5-1.8-2.7-4-2.7-2.1 0-3.6 1.4-3.6 3.5 0 2.4 1.7 4 4 4v-1.9c-1.2 0-2-.8-2-2 0-1.1.7-1.7 1.6-1.7Z"
            fill="currentColor"
          />
        </>
      );
    case "statsfm":
      return (
        <>
          <rect x="4" y="12" width="3" height="8" rx="1.5" fill="currentColor" />
          <rect x="9" y="8" width="3" height="12" rx="1.5" fill="currentColor" opacity=".88" />
          <rect x="14" y="5" width="3" height="15" rx="1.5" fill="currentColor" opacity=".76" />
          <rect x="19" y="9" width="3" height="11" rx="1.5" fill="currentColor" opacity=".64" />
        </>
      );
    case "valorant":
      return (
        <path d="M4 6h6.6L12 8.2 7.7 18H4V6Zm9.4 0H20v12h-3.7L12 8.2 13.4 6Z" fill="currentColor" />
      );
    case "chess":
      return (
        <>
          <path
            d="M13.6 5.2c-.8-.5-2-.6-2.8-.2-.8.4-1.2 1.2-1.2 2.1 0 .5.2 1 .5 1.3L7.5 12c-.5.7-.2 1.7.6 2l1.2.5-.8 1.5c-.4.8.2 1.8 1.1 1.8h6.8c.9 0 1.5-1 .9-1.8l-1.1-1.5 1-.5c.8-.4 1-1.4.5-2.1L15 8.4c.4-.4.7-1 .7-1.6 0-.7-.3-1.2-.8-1.6l.7-1.2h-2Z"
            fill="currentColor"
          />
          <path d="M8 20h8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    case "tiktok":
      return (
        <path
          d="M14.4 4.5c.6 1.6 1.8 2.7 3.6 3V10a6.8 6.8 0 0 1-3.6-1.2v5.4a4.5 4.5 0 1 1-4.5-4.5h.6v2.3h-.6a2.2 2.2 0 1 0 2.2 2.2V4.5h2.3Z"
          fill="currentColor"
        />
      );
    case "instagram":
      return (
        <>
          <rect x="4.3" y="4.3" width="15.4" height="15.4" rx="4.4" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" />
        </>
      );
    case "x":
      return (
        <path
          d="M5 4h4.3l3.1 4.4L16.4 4H19l-5.3 6.1L20 20h-4.3l-3.5-5L7.7 20H5l5.8-6.6L5 4Z"
          fill="currentColor"
        />
      );
    case "steam":
      return (
        <>
          <circle cx="15.7" cy="8.4" r="2.2" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M5 15.4 8.7 17a4.4 4.4 0 1 0 2.2-5.4l-2.2-.9A4.1 4.1 0 1 0 5 15.4Z"
            fill="currentColor"
          />
          <circle cx="11.8" cy="15.9" r="2" fill="#0B0C12" fillOpacity=".24" />
          <path d="m13 14.5 2.1-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    case "spotify":
      return (
        <>
          <circle cx="12" cy="12" r="8" fill="currentColor" />
          <path d="M8 10.2c2.4-.7 5.5-.4 7.9.8" stroke="#0B0C12" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8.7 12.9c1.9-.5 4.2-.2 6 .7" stroke="#0B0C12" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9.4 15.2c1.4-.3 3-.1 4.3.6" stroke="#0B0C12" strokeWidth="1.4" strokeLinecap="round" />
        </>
      );
    case "youtube":
      return (
        <>
          <rect x="3.5" y="6.5" width="17" height="11" rx="4" fill="currentColor" />
          <path d="m10 9.7 5 2.3-5 2.3V9.7Z" fill="#0B0C12" fillOpacity=".9" />
        </>
      );
    case "twitch":
      return (
        <>
          <path d="M5 5h14v9l-3 3h-3l-2 2H8v-2H5V5Z" fill="currentColor" />
          <path d="M10 9v4M14 9v4" stroke="#0B0C12" strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    case "minecraft":
      return (
        <>
          <rect x="4" y="5" width="16" height="14" rx="2.5" fill="currentColor" />
          <path d="M4 9h16" stroke="#0B0C12" strokeOpacity=".25" strokeWidth="1.5" />
          <path
            d="M8 8h2v2H8V8Zm6 0h2v2h-2V8ZM9 12h6v2H9v-2Zm-2 3h2v2H7v-2Zm8 0h2v2h-2v-2Z"
            fill="#0B0C12"
            fillOpacity=".25"
          />
        </>
      );
    case "weather":
      return (
        <>
          <circle cx="9" cy="10" r="3.2" fill="currentColor" />
          <path
            d="M14.2 18a3.8 3.8 0 1 0-.7-7.5A5 5 0 0 0 4.4 12a3 3 0 0 0 .6 6h9.2Z"
            fill="currentColor"
            opacity=".9"
          />
        </>
      );
    case "brawl-stars":
      return (
        <>
          <path
            d="m12 4 2 4.1 4.5.7-3.2 3.1.8 4.4-4.1-2.2-4.1 2.2.8-4.4L5.5 8.8l4.5-.7L12 4Z"
            fill="currentColor"
          />
          <circle cx="12" cy="12" r="2.1" fill="#0B0C12" fillOpacity=".26" />
        </>
      );
    default:
      return null;
  }
}

import {
  FaDiscord,
  FaInstagram,
  FaGithub,
  FaXTwitter,
  FaYoutube,
  FaTwitch,
  FaTiktok,
  FaLinkedin,
  FaSpotify,
  FaLink,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

export type PlatformIcon = {
  name: string;
  icon: IconType;
  color: string;
};

export function getLinkPlatform(url: string, title?: string | null): PlatformIcon {
  const value = `${title || ""} ${url}`.toLowerCase();

  if (value.includes("discord")) {
    return { name: "Discord", icon: FaDiscord, color: "#5865F2" };
  }

  if (value.includes("instagram")) {
    return { name: "Instagram", icon: FaInstagram, color: "#E4405F" };
  }

  if (value.includes("github")) {
    return { name: "GitHub", icon: FaGithub, color: "#ffffff" };
  }

  if (value.includes("x.com") || value.includes("twitter")) {
    return { name: "X", icon: FaXTwitter, color: "#ffffff" };
  }

  if (value.includes("youtube") || value.includes("youtu.be")) {
    return { name: "YouTube", icon: FaYoutube, color: "#FF0000" };
  }

  if (value.includes("twitch")) {
    return { name: "Twitch", icon: FaTwitch, color: "#9146FF" };
  }

  if (value.includes("tiktok")) {
    return { name: "TikTok", icon: FaTiktok, color: "#ffffff" };
  }

  if (value.includes("linkedin")) {
    return { name: "LinkedIn", icon: FaLinkedin, color: "#0A66C2" };
  }

  if (value.includes("spotify")) {
    return { name: "Spotify", icon: FaSpotify, color: "#1DB954" };
  }

  return {
    name: "Link",
    icon: FaLink,
    color: "#888888",
  };
}
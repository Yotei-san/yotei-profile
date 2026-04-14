import {
  siDiscord,
  siInstagram,
  siGithub,
  siX,
  siYoutube,
  siTwitch,
  siTiktok,
  siLinkedin,
  siSpotify,
} from "simple-icons";

type PlatformIcon = {
  name: string;
  svg: string;
  color: string;
};

function makeIcon(icon: any): PlatformIcon {
  return {
    name: icon.title,
    svg: icon.path,
    color: `#${icon.hex}`,
  };
}

export function getLinkPlatform(url: string, title?: string | null): PlatformIcon {
  const value = `${title || ""} ${url}`.toLowerCase();

  if (value.includes("discord")) return makeIcon(siDiscord);
  if (value.includes("instagram")) return makeIcon(siInstagram);
  if (value.includes("github")) return makeIcon(siGithub);
  if (value.includes("x.com") || value.includes("twitter")) return makeIcon(siX);
  if (value.includes("youtube") || value.includes("youtu.be")) return makeIcon(siYoutube);
  if (value.includes("twitch")) return makeIcon(siTwitch);
  if (value.includes("tiktok")) return makeIcon(siTiktok);
  if (value.includes("linkedin")) return makeIcon(siLinkedin);
  if (value.includes("spotify")) return makeIcon(siSpotify);

  return {
    name: "Link",
    svg: "",
    color: "#888888",
  };
}
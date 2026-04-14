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
  siSteam,
  siFacebook,
  siReddit,
  siTelegram,
  siWhatsapp,
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

export function getLinkPlatform(
  url: string,
  title?: string | null
): PlatformIcon {
  const value = `${title || ""} ${url}`.toLowerCase();

  // 🔥 PRIORIDADE: DOMÍNIO

  if (value.includes("discord.gg") || value.includes("discord.com") || value.includes("discord"))
    return makeIcon(siDiscord);

  if (value.includes("instagram.com") || value.includes("instagram"))
    return makeIcon(siInstagram);

  if (value.includes("github.com") || value.includes("github"))
    return makeIcon(siGithub);

  if (value.includes("x.com") || value.includes("twitter.com") || value.includes("twitter"))
    return makeIcon(siX);

  if (value.includes("youtube.com") || value.includes("youtu.be") || value.includes("youtube"))
    return makeIcon(siYoutube);

  if (value.includes("twitch.tv") || value.includes("twitch"))
    return makeIcon(siTwitch);

  if (value.includes("tiktok.com") || value.includes("tiktok"))
    return makeIcon(siTiktok);

  if (value.includes("linkedin.com") || value.includes("linkedin"))
    return makeIcon(siLinkedin);

  if (value.includes("spotify.com") || value.includes("spotify"))
    return makeIcon(siSpotify);

  if (value.includes("steamcommunity.com") || value.includes("steampowered.com") || value.includes("steam"))
    return makeIcon(siSteam);

  if (value.includes("facebook.com") || value.includes("facebook"))
    return makeIcon(siFacebook);

  if (value.includes("reddit.com") || value.includes("reddit"))
    return makeIcon(siReddit);

  if (value.includes("t.me") || value.includes("telegram"))
    return makeIcon(siTelegram);

  if (value.includes("wa.me") || value.includes("whatsapp"))
    return makeIcon(siWhatsapp);

  // 🔥 FALLBACK INTELIGENTE

  return {
    name: title || "Link",
    svg: "",
    color: "#a1a1aa",
  };
}
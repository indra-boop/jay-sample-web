import type { EmbedProvider, MusicPlatform, SocialPlatform } from "@/types/content";

// Text labels instead of brand icons: icon set not approved (jerco 04-icons = controlled intake)
// and third-party logos carry their own usage rules.
export const musicPlatformLabel: Record<MusicPlatform, string> = {
  spotify: "Spotify",
  appleMusic: "Apple Music",
  soundcloud: "SoundCloud",
  youtube: "YouTube",
  beatport: "Beatport",
  mixcloud: "Mixcloud",
};

export const socialLabel: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  spotify: "Spotify",
  soundcloud: "SoundCloud",
  youtube: "YouTube",
  tiktok: "TikTok",
  mixcloud: "Mixcloud",
  beatport: "Beatport",
};

export const embedLabel: Record<EmbedProvider, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  mixcloud: "Mixcloud",
  soundcloud: "SoundCloud",
};

/** Ordered list of platforms that actually have a URL. */
export function configuredLinks<K extends string>(links: Partial<Record<K, string>>, order: readonly K[]) {
  return order.filter((k) => typeof links[k] === "string" && links[k]!.startsWith("https://")).map((k) => ({
    key: k,
    url: links[k] as string,
  }));
}

export const musicPlatformOrder: MusicPlatform[] = ["spotify", "appleMusic", "soundcloud", "beatport", "youtube", "mixcloud"];

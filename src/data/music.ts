import type { EmbedProvider, LiveSet, Release } from "@/types/content";

/** DATA BELUM ADA: official releases (Spotify/Beatport/…). Do not add releases without official links. */
export const releases: Release[] = [
  // {
  //   id: "…", title: "…", type: "Single", releaseDate: "2026-01-01",
  //   artwork: { src: "/images/music/….jpg", width: 1200, height: 1200, alt: "Cover artwork for …" },
  //   links: { spotify: "https://open.spotify.com/…" }, featured: true, status: "DATA FINAL",
  // },
];

/**
 * Mixes / live sets. Source: https://www.mixcloud.com/jay-sample/uploads/ (fetched 2026-10-01),
 * profile confirmed by project coordinator 2026-10-01. Order = Mixcloud upload order (newest first).
 * Titles and durations exactly as published on Mixcloud (UI uppercases titles). Embed = official Mixcloud widget,
 * no autoplay param; iframe is created only when the visitor presses Play.
 */
const MIXCLOUD_USER = "jay-sample";

export const mixcloudEmbed = (slug: string) =>
  `https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(`/${MIXCLOUD_USER}/${slug}/`)}`;

const mix = (slug: string, title: string, duration: string, provider: EmbedProvider = "mixcloud"): LiveSet => ({
  id: `mixcloud-${slug}`,
  title,
  provider,
  url: `https://www.mixcloud.com/${MIXCLOUD_USER}/${slug}/`,
  embedUrl: mixcloudEmbed(slug),
  duration,
  status: "DATA FINAL",
});

export const liveSets: LiveSet[] = [
  mix("workings-of-classic-chicago-new-york-80s-house", "CLASSIC CHICAGO and NEW YORK 80's HOUSE", "2:00:23"),
  mix("summer-soul-back-yard-party", "SUMMER SOUL BACK YARD PARTY", "1:30:58"),
  mix("sundae-soul-vol-5", "SUNDAE SOUL VOL. 5", "57:24"),
  mix("sundae-soul-sessions-vol3", "SUNDAE SOUL SESSIONS VOL.3", "1:34:50"),
  mix("do-you-remember-juneteenth-edition-2026", "DO YOU REMEMBER JUNETEENTH EDITION 2026", "2:45:21"),
  mix("late-night-sessions-2026-feb", "Late night Sessions 2026 Feb", "41:24"),
  mix("day-sessions-in-mami", "DAY SESSIONS IN MAMI 2026" /* sic: "MAMI" as published — FIELD VERIFICATION */, "43:34"),
  mix("dj-sample-live-miami-part-2", "DJ sample live miami part 2", "1:13:59"),
  mix("dj-sample-live-in-miami-day-jan-2026-set-part-1", "DJ SAMPLE LIVE IN MIAMI DAY. JAN 2026 SET PART 1", "57:59"),
  mix("dj-jay-sample-presents-island-vibes-2026", "DJ JAY SAMPLE PRESENTS ISLAND VIBES 2026", "1:37:29"),
];

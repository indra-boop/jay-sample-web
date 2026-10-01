import { artist } from "./artist";

/** Site-level config. Domain comes from SITE_URL env (DATA BELUM ADA). */
export const site = {
  name: artist.name,
  titleTemplate: `%s — ${artist.name}`,
  defaultTitle: `${artist.name} — ${artist.role}`,
  description: `Official website of ${artist.name} — ${artist.role}. Music, upcoming events, media and booking.`,
  locale: "en",
  ogImage: { src: "/brand/jay-sample-og.jpg", width: 1200, height: 630, alt: artist.name },
  themeColor: "#050505",
} as const;

export const navItems = [
  { label: "Music", href: "/music", section: "music" },
  { label: "Events", href: "/events", section: "events" },
  { label: "About", href: "/about", section: "about" },
  { label: "Media", href: "/media", section: "media" },
  { label: "Booking", href: "/booking", section: "booking" },
] as const;

export type NavSection = (typeof navItems)[number]["section"];

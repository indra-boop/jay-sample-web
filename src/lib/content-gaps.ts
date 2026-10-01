import { artist } from "@/data/artist";
import { booking } from "@/data/booking";
import { events } from "@/data/events";
import { media } from "@/data/media";
import { liveSets, releases } from "@/data/music";
import { socials } from "@/data/socials";
import type { ContentGap } from "@/types/content";
import { todayIso } from "./format";
import { siteUrl } from "./content-mode";

const OWNER = "BELUM DITENTUKAN";

/** Single source for every missing item. Rendered in preview UI, build log and QA report. */
export function getContentGaps(): ContentGap[] {
  const gaps: ContentGap[] = [];
  const add = (g: Omit<ContentGap, "owner" | "label"> & Partial<Pick<ContentGap, "owner" | "label">>) =>
    gaps.push({ owner: OWNER, label: "DATA BELUM ADA", ...g });

  // Brand — static gaps (asset pipeline knows there is no vector master).
  add({ area: "brand", item: "original Jay Sample vector logo", resolver: "original AI/EPS/SVG artwork from brand owner", blocking: false });
  add({ area: "brand", item: "official favicon / monogram", resolver: "monogram artwork from brand owner (not redrawn by us)", blocking: false });
  add({ area: "brand", item: "monochrome logo variant", resolver: "1-colour export from vector master", blocking: false });

  const today = todayIso();
  if (releases.length === 0) add({ area: "music", item: "official releases (Spotify / Apple Music / Beatport …)", resolver: "official release links, if any exist", blocking: false });
  if (!liveSets.some((s) => s.provider === "youtube" || s.provider === "vimeo"))
    add({ area: "media", item: "live video (YouTube / Vimeo)", resolver: "official video URLs + usage rights (candidate: Vimeo 303763845 on Tropics page)", blocking: false });
  if (!events.some((e) => e.date >= today)) add({ area: "events", item: "upcoming events", resolver: "confirmed Jay Sample event calendar", blocking: false });
  if (!events.some((e) => e.date < today)) add({ area: "events", item: "past events", resolver: "verified performance history", blocking: false });

  if (!artist.bio) add({ area: "about", item: "artist biography", resolver: "approved biography from artist/management", blocking: false });
  else if (artist.bio.status !== "DATA FINAL")
    add({ area: "about", label: "CLIENT CONFIRMATION", item: "biography draft (rewritten from Tropics Entertainment profile; incl. stage-credit names)", resolver: "artist/management approval of text + celebrity stage credits", blocking: false });
  if (!artist.portrait) add({ area: "about", item: "artist portrait", resolver: "professional portrait + usage rights + photographer credit", blocking: false });
  if (!artist.heroMedia) add({ area: "media", item: "hero performance photo / video", resolver: "professional performance photo/video + usage rights", blocking: false });
  if (media.length === 0) add({ area: "media", item: "media gallery (performance, portrait, venue, press)", resolver: "approved photo/video set with credits", blocking: false });
  const unconfirmed = (
    [
      ["genres", artist.genres],
      ["base location", artist.basedIn],
      ["tagline", artist.tagline],
    ] as const
  ).filter(([, f]) => !f || f.status !== "DATA FINAL");
  if (unconfirmed.length)
    add({ area: "about", label: "CLIENT CONFIRMATION", item: unconfirmed.map(([n]) => n).join(", "), resolver: "artist confirmation", blocking: false });

  const missingSocials = (["instagram", "spotify", "soundcloud", "youtube", "tiktok", "beatport"] as const).filter((p) => !socials.some((s) => s.platform === p));
  if (missingSocials.length) add({ area: "socials", item: `social profile URLs (${missingSocials.join(", ")})`, resolver: "artist/management account list", blocking: false });

  if (!booking.formEndpoint && !booking.bookingEmail)
    add({ area: "booking", item: "booking endpoint or booking email", resolver: "form backend URL or official booking email", blocking: true });
  if (!booking.privacyNotice)
    add({ area: "booking", item: "privacy notice for booking form", resolver: "privacy text approved by owner/legal", blocking: true });

  if (!siteUrl) add({ area: "seo", item: "production domain (SITE_URL)", resolver: "final domain + DNS", blocking: true });

  return gaps;
}

export function gapsFor(area: ContentGap["area"]) {
  return getContentGaps().filter((g) => g.area === area);
}

export function formatGap(g: ContentGap) {
  return `${g.label}: ${g.item} | Penyelesai: ${g.resolver} | Owner: ${g.owner}`;
}

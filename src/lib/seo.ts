import { artist } from "@/data/artist";
import { socials } from "@/data/socials";
import type { ArtistEvent, Release } from "@/types/content";

import { absoluteUrl } from "./url";

const abs = (path: string, site?: string) => (site ? absoluteUrl(path, site) : undefined);

/** schema.org MusicGroup — recommended type for musicians incl. solo acts (ASSUMPTION: Person vs group). */
export function artistJsonLd(base?: string) {
  const sameAs = socials.filter((s) => s.status === "DATA FINAL").map((s) => s.url);
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    ...(base ? { url: absoluteUrl("/", base), logo: abs("/brand/icons/jay-sample-avatar-512.png", base), image: abs("/brand/jay-sample-og.jpg", base) } : {}),
    ...(artist.genres?.status === "DATA FINAL" ? { genre: artist.genres.value } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function eventJsonLd(e: ArtistEvent) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: e.eventName ?? `${artist.name} at ${e.venue}`,
    startDate: e.startTime ? `${e.date}T${e.startTime}` : e.date,
    eventStatus:
      e.eventStatus === "cancelled"
        ? "https://schema.org/EventCancelled"
        : e.eventStatus === "postponed"
          ? "https://schema.org/EventPostponed"
          : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: e.venue, address: { "@type": "PostalAddress", addressLocality: e.city, addressCountry: e.country } },
    performer: { "@type": "MusicGroup", name: artist.name },
    ...(e.ticketUrl ? { offers: { "@type": "Offer", url: e.ticketUrl } } : {}),
  };
}

export function releaseJsonLd(r: Release) {
  return {
    "@context": "https://schema.org",
    "@type": r.type === "Album" || r.type === "EP" ? "MusicAlbum" : "MusicRecording",
    name: r.title,
    datePublished: r.releaseDate,
    byArtist: { "@type": "MusicGroup", name: artist.name },
    ...(Object.values(r.links).length ? { sameAs: Object.values(r.links) } : {}),
  };
}

/** Safe JSON for <script type="application/ld+json">. */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

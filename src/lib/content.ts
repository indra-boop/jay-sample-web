import { artist } from "@/data/artist";
import { events } from "@/data/events";
import { media } from "@/data/media";
import { liveSets, releases } from "@/data/music";
import { socials } from "@/data/socials";
import type { EvidenceStatus, Verified } from "@/types/content";
import { isProduction } from "./content-mode";
import { todayIso } from "./format";

/** Production renders DATA FINAL only. Preview renders everything (with status badges). */
const publishable = <T extends { status: EvidenceStatus }>(items: readonly T[]) =>
  isProduction ? items.filter((i) => i.status === "DATA FINAL") : [...items];

export const verified = <T>(field: Verified<T> | undefined): T | undefined =>
  field && (!isProduction || field.status === "DATA FINAL") ? field.value : undefined;

export const getReleases = () =>
  publishable(releases).sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.releaseDate.localeCompare(a.releaseDate));
export const getLiveSets = () => publishable(liveSets);
/** Audio mixes (Mixcloud / SoundCloud) → Music section. */
export const getMixes = () => getLiveSets().filter((s) => s.provider === "mixcloud" || s.provider === "soundcloud");
/** Video sets (YouTube / Vimeo) → Media section. */
export const getVideoSets = () => getLiveSets().filter((s) => s.provider === "youtube" || s.provider === "vimeo");
export const getMedia = () => publishable(media);
export const getSocials = () => publishable(socials);

export function getEvents() {
  const today = todayIso();
  const all = publishable(events);
  return {
    upcoming: all.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
    past: all.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export function getArtist() {
  const portrait = artist.portrait && (!isProduction || artist.portrait.status === "DATA FINAL") ? artist.portrait : undefined;
  return {
    name: artist.name,
    role: artist.role,
    tagline: verified(artist.tagline),
    genres: verified(artist.genres),
    basedIn: verified(artist.basedIn),
    origin: verified(artist.origin),
    bio: verified(artist.bio),
    influences: verified(artist.influences),
    residencies: verified(artist.residencies),
    notableVenues: verified(artist.notableVenues),
    collaborations: verified(artist.collaborations),
    portrait,
    heroMedia: artist.heroMedia && (!isProduction || artist.heroMedia.status === "DATA FINAL") ? artist.heroMedia : undefined,
  };
}

/** Nav entries to hide in production when their page would be empty. Preview shows all. */
export function hiddenSections(): string[] {
  if (!isProduction) return [];
  const a = getArtist();
  const hidden: string[] = [];
  if (getReleases().length === 0 && getLiveSets().length === 0) hidden.push("music");
  const ev = getEvents();
  if (ev.upcoming.length === 0 && ev.past.length === 0) hidden.push("events");
  if (!a.bio && !a.portrait) hidden.push("about");
  if (getMedia().length === 0 && getVideoSets().length === 0) hidden.push("media");
  return hidden;
}
